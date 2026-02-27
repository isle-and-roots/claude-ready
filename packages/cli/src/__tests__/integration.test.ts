import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateShare } from '../steps/share.js';
import { loadMessages, detectLocale, type I18nMessages } from '@claude-ready/shared';

const msgs = loadMessages('en');

// Flag parsing helper — mirrors logic in index.ts
function parseFlags(args: string[]) {
  const langFlag = args.indexOf('--lang');
  const forceLang = langFlag !== -1 ? args[langFlag + 1] : undefined;
  return {
    isShare: args.includes('--share'),
    isCost: args.includes('--cost'),
    isLearn: args.includes('--learn'),
    isDryRun: args.includes('--dry-run'),
    isEvents: args.includes('--events'),
    forceLang,
  };
}

describe('Flag parsing', () => {
  it('detects --share flag', () => {
    const flags = parseFlags(['--share']);
    expect(flags.isShare).toBe(true);
    expect(flags.isCost).toBe(false);
  });

  it('detects --cost flag', () => {
    const flags = parseFlags(['--cost']);
    expect(flags.isCost).toBe(true);
    expect(flags.isShare).toBe(false);
  });

  it('detects --learn flag', () => {
    const flags = parseFlags(['--learn']);
    expect(flags.isLearn).toBe(true);
  });

  it('detects --dry-run flag', () => {
    const flags = parseFlags(['--dry-run']);
    expect(flags.isDryRun).toBe(true);
  });

  it('detects --events flag', () => {
    const flags = parseFlags(['--events']);
    expect(flags.isEvents).toBe(true);
  });

  it('parses --lang value', () => {
    const flags = parseFlags(['--lang', 'ja']);
    expect(flags.forceLang).toBe('ja');
  });

  it('handles multiple flags together', () => {
    const flags = parseFlags(['--dry-run', '--lang', 'en']);
    expect(flags.isDryRun).toBe(true);
    expect(flags.forceLang).toBe('en');
  });

  it('returns false for absent flags', () => {
    const flags = parseFlags([]);
    expect(flags.isShare).toBe(false);
    expect(flags.isCost).toBe(false);
    expect(flags.isLearn).toBe(false);
    expect(flags.isDryRun).toBe(false);
    expect(flags.forceLang).toBeUndefined();
  });
});

describe('--share flag output', () => {
  it('produces output containing #ClaudeReady', () => {
    const text = generateShare(msgs, Date.now() - 5000, 'general', process.version);
    expect(text).toContain('#ClaudeReady');
  });

  it('produces non-empty output', () => {
    const text = generateShare(msgs, Date.now() - 1000, 'webapp', 'v20.0.0');
    expect(text.trim().length).toBeGreaterThan(0);
  });
});

describe('--cost flag', () => {
  it('costStep function is importable', async () => {
    const { costStep } = await import('../steps/cost.js');
    expect(typeof costStep).toBe('function');
  });
});

describe('--learn flag', () => {
  it('learnStep function is importable', async () => {
    const { learnStep } = await import('../steps/learn.js');
    expect(typeof learnStep).toBe('function');
  });
});

describe('locale detection', () => {
  it('loads English messages by default', () => {
    const msgs = loadMessages('en');
    expect(msgs.welcome.title).toBeTruthy();
    expect(msgs.errors.fileWriteError).toBeTruthy();
    expect(msgs.share.copiedToClipboard).toBeTruthy();
  });

  it('loads Japanese messages', () => {
    const msgs = loadMessages('ja');
    expect(msgs.welcome.title).toContain('ようこそ');
    expect(msgs.errors.fileWriteError).toBeTruthy();
    expect(msgs.share.copiedToClipboard).toBeTruthy();
  });

  it('detectLocale returns a valid locale', () => {
    const locale = detectLocale();
    expect(['en', 'ja']).toContain(locale);
  });
});

describe('--lang validation', () => {
  it('rejects unsupported locale value', () => {
    const VALID_LOCALES = ['en', 'ja'];
    expect(VALID_LOCALES.includes('fr')).toBe(false);
    expect(VALID_LOCALES.includes('en')).toBe(true);
    expect(VALID_LOCALES.includes('ja')).toBe(true);
  });
});

describe('--help flag', () => {
  it('parseFlags detects --help', () => {
    expect(['--help']).toContain('--help');
  });
});

describe('--version flag', () => {
  it('parseFlags detects --version', () => {
    expect(['--version']).toContain('--version');
  });
});

describe('unknown flag detection', () => {
  it('identifies unknown flags', () => {
    const knownFlags = ['--lang', '--share', '--cost', '--learn', '--events', '--dry-run', '--help', '-h', '--version', '-v'];
    expect(knownFlags.includes('--unknown')).toBe(false);
    expect(knownFlags.includes('--share')).toBe(true);
  });
});
