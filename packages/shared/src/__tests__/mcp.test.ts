import { describe, it, expect, afterEach } from 'vitest';
import { existsSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  getMcpPresets,
  generateMcpConfig,
  applyMcpConfig,
  getGithubTokenGuide,
  type McpPresetId,
} from '../mcp.js';
import { loadMessages } from '../i18n.js';

describe('getMcpPresets', () => {
  it('returns 5 presets', () => {
    const presets = getMcpPresets();
    expect(presets).toHaveLength(5);
  });

  it('returns all expected preset IDs', () => {
    const presets = getMcpPresets();
    const ids = presets.map((p) => p.id);
    expect(ids).toContain('filesystem');
    expect(ids).toContain('github');
    expect(ids).toContain('postgres');
    expect(ids).toContain('puppeteer');
    expect(ids).toContain('brave-search');
  });

  it('each preset has command and args', () => {
    const presets = getMcpPresets();
    for (const preset of presets) {
      expect(preset.server.command).toBe('npx');
      expect(Array.isArray(preset.server.args)).toBe(true);
      expect(preset.server.args.length).toBeGreaterThan(0);
    }
  });

  it('filesystem preset has no requiresEnv', () => {
    const presets = getMcpPresets();
    const fs = presets.find((p) => p.id === 'filesystem');
    expect(fs?.requiresEnv).toBeUndefined();
  });

  it('github preset requires GITHUB_PERSONAL_ACCESS_TOKEN', () => {
    const presets = getMcpPresets();
    const gh = presets.find((p) => p.id === 'github');
    expect(gh?.requiresEnv).toContain('GITHUB_PERSONAL_ACCESS_TOKEN');
  });

  it('postgres preset requires POSTGRES_CONNECTION_STRING', () => {
    const presets = getMcpPresets();
    const pg = presets.find((p) => p.id === 'postgres');
    expect(pg?.requiresEnv).toContain('POSTGRES_CONNECTION_STRING');
  });

  it('brave-search preset requires BRAVE_API_KEY', () => {
    const presets = getMcpPresets();
    const brave = presets.find((p) => p.id === 'brave-search');
    expect(brave?.requiresEnv).toContain('BRAVE_API_KEY');
  });
});

describe('generateMcpConfig', () => {
  it('returns empty mcpServers for empty preset list', () => {
    const config = generateMcpConfig([]);
    expect(Object.keys(config.mcpServers)).toHaveLength(0);
  });

  it('returns config with correct server keys', () => {
    const config = generateMcpConfig(['filesystem', 'github']);
    expect(config.mcpServers).toHaveProperty('filesystem');
    expect(config.mcpServers).toHaveProperty('github');
  });

  it('filesystem server uses npx command', () => {
    const config = generateMcpConfig(['filesystem']);
    expect(config.mcpServers['filesystem'].command).toBe('npx');
    expect(config.mcpServers['filesystem'].args).toContain('@modelcontextprotocol/server-filesystem');
  });

  it('filesystem server injects projectDir into args', () => {
    const config = generateMcpConfig(['filesystem'], '/my/project');
    expect(config.mcpServers['filesystem'].args).toContain('/my/project');
  });

  it('filesystem server defaults to "." when no projectDir given', () => {
    const config = generateMcpConfig(['filesystem']);
    expect(config.mcpServers['filesystem'].args).toContain('.');
  });

  it('github server has GITHUB_PERSONAL_ACCESS_TOKEN in env', () => {
    const config = generateMcpConfig(['github']);
    expect(config.mcpServers['github'].env).toHaveProperty('GITHUB_PERSONAL_ACCESS_TOKEN');
  });

  it('all 5 presets produce valid config', () => {
    const allIds: McpPresetId[] = ['filesystem', 'github', 'postgres', 'puppeteer', 'brave-search'];
    const config = generateMcpConfig(allIds);
    expect(Object.keys(config.mcpServers)).toHaveLength(5);
  });

  it('generated config matches .mcp.json schema', () => {
    const config = generateMcpConfig(['filesystem']);
    expect(config).toHaveProperty('mcpServers');
    const server = config.mcpServers['filesystem'];
    expect(server).toHaveProperty('command');
    expect(server).toHaveProperty('args');
  });
});

describe('applyMcpConfig', () => {
  const testDir = join(tmpdir(), 'claude-ready-mcp-test-' + Date.now());

  afterEach(() => {
    try { rmSync(testDir, { recursive: true, force: true }); } catch {}
  });

  it('writes .mcp.json to project directory', () => {
    applyMcpConfig(testDir, ['filesystem']);
    expect(existsSync(join(testDir, '.mcp.json'))).toBe(true);
  });

  it('does nothing for empty preset list', () => {
    applyMcpConfig(testDir, []);
    expect(existsSync(join(testDir, '.mcp.json'))).toBe(false);
  });

  it('written file contains valid JSON with mcpServers', () => {
    applyMcpConfig(testDir, ['filesystem', 'puppeteer']);
    const content = readFileSync(join(testDir, '.mcp.json'), 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed).toHaveProperty('mcpServers');
    expect(parsed.mcpServers).toHaveProperty('filesystem');
    expect(parsed.mcpServers).toHaveProperty('puppeteer');
  });

  it('written file ends with newline', () => {
    applyMcpConfig(testDir, ['filesystem']);
    const content = readFileSync(join(testDir, '.mcp.json'), 'utf-8');
    expect(content.endsWith('\n')).toBe(true);
  });

  it('filesystem server in written file has correct package name', () => {
    applyMcpConfig(testDir, ['filesystem']);
    const content = readFileSync(join(testDir, '.mcp.json'), 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed.mcpServers.filesystem.args).toContain('@modelcontextprotocol/server-filesystem');
  });
});

describe('getGithubTokenGuide', () => {
  it('returns a non-empty string', () => {
    const guide = getGithubTokenGuide();
    expect(typeof guide).toBe('string');
    expect(guide.length).toBeGreaterThan(0);
  });

  it('mentions GITHUB_PERSONAL_ACCESS_TOKEN', () => {
    const guide = getGithubTokenGuide();
    expect(guide).toContain('GITHUB_PERSONAL_ACCESS_TOKEN');
  });

  it('mentions github.com/settings/tokens', () => {
    const guide = getGithubTokenGuide();
    expect(guide).toContain('github.com/settings/tokens');
  });
});

describe('i18n mcp section', () => {
  it('en locale has mcp section with all keys', () => {
    const msgs = loadMessages('en');
    expect(msgs.mcp).toBeDefined();
    expect(msgs.mcp.question).toBeDefined();
    expect(msgs.mcp.filesystem).toBeDefined();
    expect(msgs.mcp.filesystemDesc).toBeDefined();
    expect(msgs.mcp.github).toBeDefined();
    expect(msgs.mcp.githubDesc).toBeDefined();
    expect(msgs.mcp.postgres).toBeDefined();
    expect(msgs.mcp.postgresDesc).toBeDefined();
    expect(msgs.mcp.puppeteer).toBeDefined();
    expect(msgs.mcp.puppeteerDesc).toBeDefined();
    expect(msgs.mcp.braveSearch).toBeDefined();
    expect(msgs.mcp.braveSearchDesc).toBeDefined();
    expect(msgs.mcp.enabled).toBeDefined();
    expect(msgs.mcp.skipped).toBeDefined();
    expect(msgs.mcp.envNote).toBeDefined();
  });

  it('ja locale has mcp section with all keys', () => {
    const msgs = loadMessages('ja');
    expect(msgs.mcp).toBeDefined();
    expect(msgs.mcp.question).toBeDefined();
    expect(msgs.mcp.filesystem).toBeDefined();
    expect(msgs.mcp.filesystemDesc).toBeDefined();
    expect(msgs.mcp.github).toBeDefined();
    expect(msgs.mcp.githubDesc).toBeDefined();
    expect(msgs.mcp.postgres).toBeDefined();
    expect(msgs.mcp.postgresDesc).toBeDefined();
    expect(msgs.mcp.puppeteer).toBeDefined();
    expect(msgs.mcp.puppeteerDesc).toBeDefined();
    expect(msgs.mcp.braveSearch).toBeDefined();
    expect(msgs.mcp.braveSearchDesc).toBeDefined();
    expect(msgs.mcp.enabled).toBeDefined();
    expect(msgs.mcp.skipped).toBeDefined();
    expect(msgs.mcp.envNote).toBeDefined();
  });

  it('en and ja mcp messages are different strings', () => {
    const en = loadMessages('en');
    const ja = loadMessages('ja');
    expect(en.mcp.question).not.toBe(ja.mcp.question);
    expect(en.mcp.filesystem).not.toBe(ja.mcp.filesystem);
  });
});
