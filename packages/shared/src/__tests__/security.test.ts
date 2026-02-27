import { describe, it, expect, afterEach } from 'vitest';
import { DENY_RULES, WINDOWS_DENY_RULES, generateClaudeSettings, getSecurityRulesMarkdown, applySecuritySettings } from '../security.js';
import { existsSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('DENY_RULES', () => {
  it('contains Read(.env)', () => {
    expect(DENY_RULES).toContain('Read(.env)');
  });

  it('contains Bash(rm -rf /)', () => {
    expect(DENY_RULES).toContain('Bash(rm -rf /)');
  });

  it('contains Read(**/secrets/**)', () => {
    expect(DENY_RULES).toContain('Read(**/secrets/**)');
  });

  it('contains Bash(sudo *)', () => {
    expect(DENY_RULES).toContain('Bash(sudo *)');
  });

  it('contains Bash(curl * | bash)', () => {
    expect(DENY_RULES).toContain('Bash(curl * | bash)');
  });

  it('is a non-empty array', () => {
    expect(DENY_RULES.length).toBeGreaterThan(0);
  });
});

describe('WINDOWS_DENY_RULES', () => {
  it('is a non-empty array', () => {
    expect(WINDOWS_DENY_RULES.length).toBeGreaterThan(0);
  });

  it('contains del /s protection', () => {
    expect(WINDOWS_DENY_RULES.some((r) => r.includes('del /s'))).toBe(true);
  });

  it('contains format protection', () => {
    expect(WINDOWS_DENY_RULES.some((r) => r.includes('format'))).toBe(true);
  });

  it('contains rd /s protection', () => {
    expect(WINDOWS_DENY_RULES.some((r) => r.includes('rd /s'))).toBe(true);
  });

  it('contains PowerShell Remove-Item protection', () => {
    expect(WINDOWS_DENY_RULES.some((r) => r.includes('Remove-Item'))).toBe(true);
  });
});

describe('generateClaudeSettings', () => {
  it('returns an object with permissions.deny', () => {
    const settings = generateClaudeSettings();
    expect(settings).toHaveProperty('permissions');
    expect(settings.permissions).toHaveProperty('deny');
  });

  it('deny list equals DENY_RULES', () => {
    const settings = generateClaudeSettings();
    expect(settings.permissions.deny).toEqual(DENY_RULES);
  });
});

describe('getSecurityRulesMarkdown', () => {
  it('contains all deny rules', () => {
    const markdown = getSecurityRulesMarkdown();
    for (const rule of DENY_RULES) {
      expect(markdown).toContain(rule);
    }
  });

  it('starts with ## Security Rules heading', () => {
    const markdown = getSecurityRulesMarkdown();
    expect(markdown).toContain('## Security Rules');
  });
});

describe('DENY_RULES Write rules', () => {
  it('contains Write(.env) rule', () => {
    expect(DENY_RULES).toContain('Write(.env)');
  });

  it('contains Write(*.pem) rule', () => {
    expect(DENY_RULES).toContain('Write(*.pem)');
  });

  it('contains Write(.ssh/*) rule', () => {
    expect(DENY_RULES).toContain('Write(.ssh/*)');
  });
});

describe('applySecuritySettings', () => {
  const testDir = join(tmpdir(), 'claude-ready-test-' + Date.now());

  afterEach(() => {
    try { rmSync(testDir, { recursive: true, force: true }); } catch {}
  });

  it('creates .claude directory and settings.json', () => {
    applySecuritySettings(testDir);
    expect(existsSync(join(testDir, '.claude', 'settings.json'))).toBe(true);
  });

  it('writes valid JSON with deny rules', () => {
    applySecuritySettings(testDir);
    const content = readFileSync(join(testDir, '.claude', 'settings.json'), 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed.permissions.deny).toBeDefined();
    expect(parsed.permissions.deny.length).toBeGreaterThan(0);
  });

  it('overwrites existing settings', () => {
    applySecuritySettings(testDir);
    applySecuritySettings(testDir); // second call should not throw
    const content = readFileSync(join(testDir, '.claude', 'settings.json'), 'utf-8');
    expect(JSON.parse(content).permissions.deny).toBeDefined();
  });

  it('includes Write deny rules', () => {
    applySecuritySettings(testDir);
    const content = readFileSync(join(testDir, '.claude', 'settings.json'), 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed.permissions.deny).toContain('Write(.env)');
    expect(parsed.permissions.deny).toContain('Write(*.pem)');
  });
});
