import { describe, it, expect } from 'vitest';
import { isMacOS, isWindows, isLinux, checkEnvironment } from '../env-checks.js';
import { getHookPresets, generateHooksConfig } from '../hooks.js';
import { DENY_RULES, WINDOWS_DENY_RULES } from '../security.js';

describe('cross-platform: env-checks consistency', () => {
  it('exactly one of isMacOS/isWindows/isLinux is true on known platforms', () => {
    const platform = process.platform;
    if (platform === 'darwin' || platform === 'win32' || platform === 'linux') {
      const flags = [isMacOS(), isWindows(), isLinux()];
      expect(flags.filter(Boolean).length).toBe(1);
    }
  });

  it('isMacOS matches darwin platform', () => {
    expect(isMacOS()).toBe(process.platform === 'darwin');
  });

  it('isWindows matches win32 platform', () => {
    expect(isWindows()).toBe(process.platform === 'win32');
  });

  it('isLinux matches linux platform', () => {
    expect(isLinux()).toBe(process.platform === 'linux');
  });

  it('checkEnvironment includes all three platform flags', () => {
    const env = checkEnvironment();
    expect(typeof env.isMacOS).toBe('boolean');
    expect(typeof env.isWindows).toBe('boolean');
    expect(typeof env.isLinux).toBe('boolean');
  });

  it('checkEnvironment platform flags are consistent with individual functions', () => {
    const env = checkEnvironment();
    expect(env.isMacOS).toBe(isMacOS());
    expect(env.isWindows).toBe(isWindows());
    expect(env.isLinux).toBe(isLinux());
  });
});

describe('cross-platform: hooks produce valid commands for each platform', () => {
  const platforms: NodeJS.Platform[] = ['darwin', 'linux', 'win32'];

  for (const platform of platforms) {
    it(`all presets build successfully on ${platform}`, () => {
      expect(() => getHookPresets(platform)).not.toThrow();
    });

    it(`notification hook command is non-empty string on ${platform}`, () => {
      const presets = getHookPresets(platform);
      const notif = presets.find((p) => p.id === 'notification');
      expect(typeof notif?.hooks.Notification?.[0].command).toBe('string');
      expect(notif!.hooks.Notification![0].command.length).toBeGreaterThan(0);
    });

    it(`dangerous-cmd-block hook command is non-empty string on ${platform}`, () => {
      const presets = getHookPresets(platform);
      const dcb = presets.find((p) => p.id === 'dangerous-cmd-block');
      expect(typeof dcb?.hooks.PreToolUse?.[0].command).toBe('string');
      expect(dcb!.hooks.PreToolUse![0].command.length).toBeGreaterThan(0);
    });

    it(`cost-tracker hook command is non-empty string on ${platform}`, () => {
      const presets = getHookPresets(platform);
      const ct = presets.find((p) => p.id === 'cost-tracker');
      expect(typeof ct?.hooks.PostToolUse?.[0].command).toBe('string');
      expect(ct!.hooks.PostToolUse![0].command.length).toBeGreaterThan(0);
    });
  }
});

describe('cross-platform: Windows hook commands use PowerShell', () => {
  it('dangerous-cmd-block uses PowerShell on win32', () => {
    const presets = getHookPresets('win32');
    const dcb = presets.find((p) => p.id === 'dangerous-cmd-block');
    const cmd = dcb!.hooks.PreToolUse![0].command;
    expect(cmd).toContain('Write-Error');
    expect(cmd).not.toContain('grep');
  });

  it('cost-tracker uses Add-Content on win32', () => {
    const presets = getHookPresets('win32');
    const ct = presets.find((p) => p.id === 'cost-tracker');
    const cmd = ct!.hooks.PostToolUse![0].command;
    expect(cmd).toContain('Add-Content');
    expect(cmd).not.toContain('date -u');
  });

  it('notification uses MessageBox on win32', () => {
    const presets = getHookPresets('win32');
    const notif = presets.find((p) => p.id === 'notification');
    const cmd = notif!.hooks.Notification![0].command;
    expect(cmd).toContain('MessageBox');
  });
});

describe('cross-platform: Unix hook commands use shell utilities', () => {
  it('dangerous-cmd-block uses grep on darwin', () => {
    const presets = getHookPresets('darwin');
    const dcb = presets.find((p) => p.id === 'dangerous-cmd-block');
    const cmd = dcb!.hooks.PreToolUse![0].command;
    expect(cmd).toContain('grep -qE');
    expect(cmd).not.toContain('Write-Error');
  });

  it('cost-tracker uses date -u on linux', () => {
    const presets = getHookPresets('linux');
    const ct = presets.find((p) => p.id === 'cost-tracker');
    const cmd = ct!.hooks.PostToolUse![0].command;
    expect(cmd).toContain('date -u');
    expect(cmd).not.toContain('powershell');
  });
});

describe('cross-platform: deny rules coverage', () => {
  it('DENY_RULES covers Unix-style dangerous operations', () => {
    const unixRules = DENY_RULES.filter((r) => r.includes('rm -rf') || r.includes('sudo'));
    expect(unixRules.length).toBeGreaterThan(0);
  });

  it('WINDOWS_DENY_RULES covers Windows-style dangerous operations', () => {
    const winRules = WINDOWS_DENY_RULES.filter(
      (r) => r.includes('del') || r.includes('format') || r.includes('rd') || r.includes('Remove-Item'),
    );
    expect(winRules.length).toBeGreaterThan(0);
  });

  it('combined rules provide cross-platform coverage', () => {
    const combined = [...DENY_RULES, ...WINDOWS_DENY_RULES];
    expect(combined.length).toBeGreaterThan(DENY_RULES.length);
  });
});

describe('cross-platform: generateHooksConfig works for all platforms', () => {
  const platforms: NodeJS.Platform[] = ['darwin', 'linux', 'win32'];

  for (const platform of platforms) {
    it(`generateHooksConfig produces valid config on ${platform}`, () => {
      const config = generateHooksConfig(
        ['dangerous-cmd-block', 'cost-tracker', 'notification'],
        platform,
      );
      expect(config.PreToolUse).toBeDefined();
      expect(config.PostToolUse).toBeDefined();
      expect(config.Notification).toBeDefined();
    });
  }
});
