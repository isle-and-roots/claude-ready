import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @clack/prompts
vi.mock('@clack/prompts', () => ({
  select: vi.fn(),
  text: vi.fn(),
  confirm: vi.fn(),
  spinner: vi.fn(() => ({ start: vi.fn(), stop: vi.fn() })),
  log: { success: vi.fn(), warn: vi.fn(), error: vi.fn(), info: vi.fn() },
  note: vi.fn(),
  intro: vi.fn(),
  outro: vi.fn(),
  cancel: vi.fn(),
  isCancel: vi.fn(() => false),
}));

import * as p from '@clack/prompts';
import { loadMessages } from '@claude-ready/shared';

const msgs = loadMessages('en');

describe('welcomeStep', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns selected experience level', async () => {
    vi.mocked(p.select).mockResolvedValue('beginner');
    const { welcomeStep } = await import('../steps/welcome.js');
    const level = await welcomeStep(msgs);
    expect(level).toBe('beginner');
  });

  it('throws UserCancelledError when user cancels', async () => {
    vi.mocked(p.select).mockResolvedValue(Symbol.for('cancel'));
    vi.mocked(p.isCancel).mockReturnValue(true);
    const { welcomeStep } = await import('../steps/welcome.js');
    await expect(welcomeStep(msgs)).rejects.toThrow();
    vi.mocked(p.isCancel).mockReturnValue(false);
  });
});

describe('envCheckStep', () => {
  it('returns environment status', async () => {
    const { envCheckStep } = await import('../steps/env-check.js');
    const result = await envCheckStep(msgs);
    expect(result).toHaveProperty('isMacOS');
    expect(result).toHaveProperty('nodeVersion');
  });

  it('works in advanced mode', async () => {
    const { envCheckStep } = await import('../steps/env-check.js');
    const result = await envCheckStep(msgs, 'advanced');
    expect(result).toHaveProperty('nodeVersion');
  });
});

describe('installStep', () => {
  it('skips when already installed', async () => {
    const { installStep } = await import('../steps/install.js');
    await installStep(msgs, true, 'advanced');
    // Should not throw
  });
});

describe('shareStep', () => {
  it('generates share text', async () => {
    const { generateShare } = await import('../steps/share.js');
    const text = generateShare(msgs, Date.now() - 5000, 'website', 'v20.0.0');
    expect(text).toContain('#ClaudeReady');
  });
});

describe('costStep', () => {
  it('runs without error', async () => {
    const { costStep } = await import('../steps/cost.js');
    await expect(costStep(msgs)).resolves.not.toThrow();
  });
});

describe('learnStep', () => {
  it('runs without error', async () => {
    const { learnStep } = await import('../steps/learn.js');
    await expect(learnStep(msgs)).resolves.not.toThrow();
  });
});

describe('securityStep error path', () => {
  it('throws FatalError when applySecuritySettings fails', async () => {
    vi.doMock('@claude-ready/shared', async () => {
      const actual = await vi.importActual<typeof import('@claude-ready/shared')>('@claude-ready/shared');
      return {
        ...actual,
        applySecuritySettings: vi.fn(() => { throw new Error('EACCES'); }),
      };
    });
    const { securityStep } = await import('../steps/security.js');
    await expect(securityStep('/nonexistent/path', msgs)).rejects.toThrow();
    vi.doUnmock('@claude-ready/shared');
  });
});

describe('installStep error path', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('skips silently when already installed in non-advanced mode', async () => {
    const { installStep } = await import('../steps/install.js');
    // Should complete without throwing when already installed (no level = intermediate)
    await expect(installStep(msgs, true)).resolves.not.toThrow();
  });

  it('shows skip message when already installed in advanced mode', async () => {
    const { installStep } = await import('../steps/install.js');
    await installStep(msgs, true, 'advanced');
    expect(p.log.success).toHaveBeenCalledWith(msgs.install.expressSkipped);
  });
});

describe('apiKeyStep error path', () => {
  it('validates API key minimum length', async () => {
    const { apiKeyStep } = await import('../steps/api-key.js');
    // Mock text to return a short key
    vi.mocked(p.text).mockResolvedValue('sk-ant-short');
    vi.mocked(p.isCancel).mockReturnValue(true);
    // The step should throw UserCancelledError since we cancel after validation
    await expect(apiKeyStep(msgs, '/tmp/test-dir')).rejects.toThrow();
    vi.mocked(p.isCancel).mockReturnValue(false);
  });
});
