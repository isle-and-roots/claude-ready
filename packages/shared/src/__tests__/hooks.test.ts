import { describe, it, expect, afterEach } from 'vitest';
import { getHookPresets, generateHooksConfig, type HookPresetId } from '../hooks.js';
import { generateClaudeSettings, applySecuritySettings } from '../security.js';
import { existsSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('getHookPresets', () => {
  it('returns 5 presets', () => {
    const presets = getHookPresets();
    expect(presets).toHaveLength(5);
  });

  it('returns all expected preset IDs', () => {
    const presets = getHookPresets();
    const ids = presets.map((p) => p.id);
    expect(ids).toContain('auto-format');
    expect(ids).toContain('safe-commit');
    expect(ids).toContain('dangerous-cmd-block');
    expect(ids).toContain('cost-tracker');
    expect(ids).toContain('notification');
  });

  it('each preset has hooks with at least one event', () => {
    const presets = getHookPresets();
    for (const preset of presets) {
      const eventKeys = Object.keys(preset.hooks);
      expect(eventKeys.length).toBeGreaterThan(0);
    }
  });

  it('auto-format preset has PostToolUse hook', () => {
    const presets = getHookPresets();
    const af = presets.find((p) => p.id === 'auto-format');
    expect(af?.hooks.PostToolUse).toBeDefined();
    expect(af?.hooks.PostToolUse?.length).toBeGreaterThan(0);
  });

  it('dangerous-cmd-block preset has PreToolUse hook', () => {
    const presets = getHookPresets();
    const dcb = presets.find((p) => p.id === 'dangerous-cmd-block');
    expect(dcb?.hooks.PreToolUse).toBeDefined();
    expect(dcb?.hooks.PreToolUse?.[0].matcher?.tool_name).toBe('Bash');
  });

  it('notification preset has Notification hook', () => {
    const presets = getHookPresets();
    const notif = presets.find((p) => p.id === 'notification');
    expect(notif?.hooks.Notification).toBeDefined();
    expect(notif?.hooks.Notification?.length).toBeGreaterThan(0);
  });
});

describe('getHookPresets platform-specific notification', () => {
  it('darwin uses osascript', () => {
    const presets = getHookPresets('darwin');
    const notif = presets.find((p) => p.id === 'notification');
    expect(notif?.hooks.Notification?.[0].command).toContain('osascript');
  });

  it('linux uses notify-send', () => {
    const presets = getHookPresets('linux');
    const notif = presets.find((p) => p.id === 'notification');
    expect(notif?.hooks.Notification?.[0].command).toContain('notify-send');
  });

  it('win32 uses powershell', () => {
    const presets = getHookPresets('win32');
    const notif = presets.find((p) => p.id === 'notification');
    expect(notif?.hooks.Notification?.[0].command).toContain('powershell');
  });
});

describe('getHookPresets platform-specific dangerous-cmd-block', () => {
  it('win32 uses powershell block command', () => {
    const presets = getHookPresets('win32');
    const dcb = presets.find((p) => p.id === 'dangerous-cmd-block');
    expect(dcb?.hooks.PreToolUse?.[0].command).toContain('Write-Error');
    expect(dcb?.hooks.PreToolUse?.[0].command).toContain('del /s');
  });

  it('darwin uses grep-based block command', () => {
    const presets = getHookPresets('darwin');
    const dcb = presets.find((p) => p.id === 'dangerous-cmd-block');
    expect(dcb?.hooks.PreToolUse?.[0].command).toContain('grep');
    expect(dcb?.hooks.PreToolUse?.[0].command).toContain('rm -rf /');
  });

  it('linux uses grep-based block command', () => {
    const presets = getHookPresets('linux');
    const dcb = presets.find((p) => p.id === 'dangerous-cmd-block');
    expect(dcb?.hooks.PreToolUse?.[0].command).toContain('grep');
  });
});

describe('getHookPresets platform-specific cost-tracker', () => {
  it('win32 uses powershell date command', () => {
    const presets = getHookPresets('win32');
    const ct = presets.find((p) => p.id === 'cost-tracker');
    expect(ct?.hooks.PostToolUse?.[0].command).toContain('powershell');
    expect(ct?.hooks.PostToolUse?.[0].command).toContain('Add-Content');
  });

  it('darwin uses unix date command', () => {
    const presets = getHookPresets('darwin');
    const ct = presets.find((p) => p.id === 'cost-tracker');
    expect(ct?.hooks.PostToolUse?.[0].command).toContain('date -u');
  });

  it('linux uses unix date command', () => {
    const presets = getHookPresets('linux');
    const ct = presets.find((p) => p.id === 'cost-tracker');
    expect(ct?.hooks.PostToolUse?.[0].command).toContain('date -u');
  });
});

describe('generateHooksConfig', () => {
  it('returns empty object for empty preset list', () => {
    const config = generateHooksConfig([]);
    expect(Object.keys(config)).toHaveLength(0);
  });

  it('returns config for single preset', () => {
    const config = generateHooksConfig(['dangerous-cmd-block']);
    expect(config.PreToolUse).toBeDefined();
    expect(config.PreToolUse?.length).toBe(1);
  });

  it('merges multiple presets into same event key', () => {
    const config = generateHooksConfig(['auto-format', 'safe-commit', 'cost-tracker']);
    expect(config.PostToolUse).toBeDefined();
    expect(config.PostToolUse!.length).toBe(3);
  });

  it('merges presets across different event keys', () => {
    const config = generateHooksConfig(['dangerous-cmd-block', 'notification'], 'darwin');
    expect(config.PreToolUse).toBeDefined();
    expect(config.Notification).toBeDefined();
  });

  it('all presets combined produce valid config', () => {
    const allIds: HookPresetId[] = [
      'auto-format', 'safe-commit', 'dangerous-cmd-block', 'cost-tracker', 'notification',
    ];
    const config = generateHooksConfig(allIds);
    expect(config.PreToolUse?.length).toBe(1);
    expect(config.PostToolUse?.length).toBe(3);
    expect(config.Notification?.length).toBe(1);
  });
});

describe('generateClaudeSettings with hooks', () => {
  it('includes hooks in settings when provided', () => {
    const hooks = generateHooksConfig(['dangerous-cmd-block']);
    const settings = generateClaudeSettings(hooks);
    expect(settings.hooks).toBeDefined();
    expect(settings.hooks?.PreToolUse).toBeDefined();
  });

  it('does not include hooks when not provided', () => {
    const settings = generateClaudeSettings();
    expect(settings.hooks).toBeUndefined();
  });

  it('does not include hooks for empty config', () => {
    const settings = generateClaudeSettings({});
    expect(settings.hooks).toBeUndefined();
  });

  it('always includes permissions.deny', () => {
    const hooks = generateHooksConfig(['notification'], 'darwin');
    const settings = generateClaudeSettings(hooks);
    expect(settings.permissions.deny).toBeDefined();
    expect(settings.permissions.deny.length).toBeGreaterThan(0);
    expect(settings.hooks).toBeDefined();
  });
});

describe('applySecuritySettings with hooks', () => {
  const testDir = join(tmpdir(), 'claude-ready-hooks-test-' + Date.now());

  afterEach(() => {
    try { rmSync(testDir, { recursive: true, force: true }); } catch {}
  });

  it('writes settings.json with hooks included', () => {
    const hooks = generateHooksConfig(['dangerous-cmd-block', 'notification'], 'darwin');
    applySecuritySettings(testDir, hooks);

    const content = readFileSync(join(testDir, '.claude', 'settings.json'), 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed.permissions.deny).toBeDefined();
    expect(parsed.hooks).toBeDefined();
    expect(parsed.hooks.PreToolUse).toBeDefined();
    expect(parsed.hooks.Notification).toBeDefined();
  });

  it('writes settings.json without hooks when not provided', () => {
    applySecuritySettings(testDir);

    const content = readFileSync(join(testDir, '.claude', 'settings.json'), 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed.permissions.deny).toBeDefined();
    expect(parsed.hooks).toBeUndefined();
  });
});
