import { describe, it, expect, vi, afterEach } from 'vitest';
import { loadMessages, detectLocale, t } from '../i18n.js';

describe('loadMessages', () => {
  it('en returns messages with welcome.title', () => {
    const msgs = loadMessages('en');
    expect(msgs).toHaveProperty('welcome');
    expect(msgs.welcome).toHaveProperty('title');
    expect(typeof msgs.welcome.title).toBe('string');
    expect(msgs.welcome.title.length).toBeGreaterThan(0);
  });

  it('ja returns Japanese messages', () => {
    const msgs = loadMessages('ja');
    expect(msgs.welcome.title).toContain('ようこそ');
  });
});

describe('detectLocale', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('returns en when LANG is not Japanese', () => {
    vi.stubEnv('LANG', 'en_US.UTF-8');
    // Also mock Intl so the system locale doesn't override the env stub
    vi.spyOn(Intl, 'DateTimeFormat').mockReturnValue({
      resolvedOptions: () => ({ locale: 'en-US' } as Intl.ResolvedDateTimeFormatOptions),
    } as Intl.DateTimeFormat);
    const locale = detectLocale();
    expect(locale).toBe('en');
  });

  it('returns ja when LANG starts with ja', () => {
    vi.stubEnv('LANG', 'ja_JP.UTF-8');
    const locale = detectLocale();
    expect(locale).toBe('ja');
  });

  it('returns en or ja', () => {
    const locale = detectLocale();
    expect(['en', 'ja']).toContain(locale);
  });
});

describe('t', () => {
  it('returns the correct string for welcome.title', () => {
    const msgs = loadMessages('en');
    const result = t(msgs, 'welcome.title');
    expect(result).toBe('Welcome to Claude Ready');
  });

  it('returns the key itself for nonexistent.key', () => {
    const msgs = loadMessages('en');
    const result = t(msgs, 'nonexistent.key');
    expect(result).toBe('nonexistent.key');
  });

  it('works for nested keys like welcome.level.beginner', () => {
    const msgs = loadMessages('en');
    const result = t(msgs, 'welcome.level.beginner');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('learn messages', () => {
  it('en has all learn keys', () => {
    const msgs = loadMessages('en');
    expect(msgs.learn.title).toBeTruthy();
    expect(msgs.learn.currentLevel).toBeTruthy();
    expect(msgs.learn.progress).toBeTruthy();
    expect(msgs.learn.nextTask).toBeTruthy();
    expect(msgs.learn.levels).toBeTruthy();
  });

  it('ja has all learn keys', () => {
    const msgs = loadMessages('ja');
    expect(msgs.learn.title).toBeTruthy();
    expect(msgs.learn.currentLevel).toBeTruthy();
    expect(msgs.learn.progress).toBeTruthy();
    expect(msgs.learn.nextTask).toBeTruthy();
    expect(msgs.learn.levels).toBeTruthy();
  });

  it('ja learn.title is in Japanese', () => {
    const msgs = loadMessages('ja');
    expect(msgs.learn.title).toContain('学習');
  });
});

describe('errors messages', () => {
  it('en has all error keys', () => {
    const msgs = loadMessages('en');
    expect(msgs.errors.fileWriteError).toBeTruthy();
    expect(msgs.errors.networkError).toBeTruthy();
    expect(msgs.errors.retryGuidance).toBeTruthy();
    expect(msgs.errors.apiKeyFormatError).toBeTruthy();
  });

  it('ja has all error keys', () => {
    const msgs = loadMessages('ja');
    expect(msgs.errors.fileWriteError).toBeTruthy();
    expect(msgs.errors.networkError).toBeTruthy();
    expect(msgs.errors.retryGuidance).toBeTruthy();
    expect(msgs.errors.apiKeyFormatError).toBeTruthy();
  });

  it('en apiKeyFormatError mentions sk-ant-', () => {
    const msgs = loadMessages('en');
    expect(msgs.errors.apiKeyFormatError).toContain('sk-ant-');
  });

  it('en retryGuidance contains npm install command', () => {
    const msgs = loadMessages('en');
    expect(msgs.errors.retryGuidance).toContain('npm install');
  });
});

describe('share messages', () => {
  it('en has copiedToClipboard', () => {
    const msgs = loadMessages('en');
    expect(msgs.share.copiedToClipboard).toBeTruthy();
  });

  it('ja has copiedToClipboard', () => {
    const msgs = loadMessages('ja');
    expect(msgs.share.copiedToClipboard).toBeTruthy();
  });
});

describe('all sections present in both locales', () => {
  const sections = [
    'welcome', 'envCheck', 'install', 'apiKey', 'project',
    'complete', 'share', 'community', 'cost', 'learn', 'errors',
  ] as const;

  for (const section of sections) {
    it(`en has ${section} section`, () => {
      const msgs = loadMessages('en');
      expect(msgs[section]).toBeDefined();
    });

    it(`ja has ${section} section`, () => {
      const msgs = loadMessages('ja');
      expect(msgs[section]).toBeDefined();
    });
  }
});

describe('new i18n keys', () => {
  it('en has hints section', () => {
    const msgs = loadMessages('en');
    expect(msgs.hints).toBeDefined();
    expect(msgs.hints.fullGuided).toBeTruthy();
  });

  it('ja has hints section', () => {
    const msgs = loadMessages('ja');
    expect(msgs.hints).toBeDefined();
    expect(msgs.hints.fullGuided).toBeTruthy();
  });

  it('en has cancel string', () => {
    const msgs = loadMessages('en');
    expect(msgs.cancel).toBeTruthy();
  });

  it('en has dryRun section', () => {
    const msgs = loadMessages('en');
    expect(msgs.dryRun).toBeDefined();
    expect(msgs.dryRun.mode).toBeTruthy();
  });

  it('en has status section', () => {
    const msgs = loadMessages('en');
    expect(msgs.status).toBeDefined();
    expect(msgs.status.nodeRequired).toBeTruthy();
  });

  it('ja has cancel string', () => {
    const msgs = loadMessages('ja');
    expect(msgs.cancel).toBeTruthy();
  });

  it('ja has dryRun section', () => {
    const msgs = loadMessages('ja');
    expect(msgs.dryRun).toBeDefined();
  });

  it('ja has status section', () => {
    const msgs = loadMessages('ja');
    expect(msgs.status).toBeDefined();
  });

  it('expressSummary uses {os} placeholder not hardcoded macOS', () => {
    const enMsgs = loadMessages('en');
    const jaMsgs = loadMessages('ja');
    expect(enMsgs.envCheck.expressSummary).toContain('{os}');
    expect(enMsgs.envCheck.expressSummary).not.toContain('macOS');
    expect(jaMsgs.envCheck.expressSummary).toContain('{os}');
    expect(jaMsgs.envCheck.expressSummary).not.toContain('macOS');
  });

  it('events section exists in both locales', () => {
    const en = loadMessages('en');
    const ja = loadMessages('ja');
    expect(en.events).toBeDefined();
    expect(ja.events).toBeDefined();
    expect(en.events.title).toBeTruthy();
    expect(ja.events.title).toBeTruthy();
  });
});
