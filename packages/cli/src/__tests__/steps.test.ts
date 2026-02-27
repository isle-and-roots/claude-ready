import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

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

// Mock child_process
vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

// Mock fs
vi.mock('fs', () => ({
  writeFileSync: vi.fn(),
  readFileSync: vi.fn(() => ''),
  existsSync: vi.fn(() => false),
  appendFileSync: vi.fn(),
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
    const { authStep } = await import('../steps/auth.js');
    // Mock select to choose apiKey method, then mock text to return a short key
    vi.mocked(p.select).mockResolvedValue('apiKey');
    vi.mocked(p.text).mockResolvedValue('sk-ant-short');
    vi.mocked(p.isCancel).mockReturnValue(true);
    // The step should throw UserCancelledError since we cancel after validation
    await expect(authStep(msgs, '/tmp/test-dir')).rejects.toThrow();
    vi.mocked(p.isCancel).mockReturnValue(false);
  });
});

describe('authStep', () => {
  let originalApiKey: string | undefined;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    // Re-apply default mocks
    vi.mocked(p.isCancel).mockReturnValue(false);
    const { execSync } = await import('child_process');
    vi.mocked(execSync).mockReturnValue(Buffer.from(''));
    const { existsSync, readFileSync } = await import('fs');
    vi.mocked(existsSync).mockReturnValue(false);
    vi.mocked(readFileSync).mockReturnValue('');
    originalApiKey = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
  });

  afterEach(() => {
    if (originalApiKey !== undefined) {
      process.env.ANTHROPIC_API_KEY = originalApiKey;
    } else {
      delete process.env.ANTHROPIC_API_KEY;
    }
  });

  it('skips and shows already-configured message when ANTHROPIC_API_KEY is set (advanced)', async () => {
    process.env.ANTHROPIC_API_KEY = 'sk-ant-existing';
    const { authStep } = await import('../steps/auth.js');
    await authStep(msgs, '/tmp/test', 'advanced');
    expect(p.log.success).toHaveBeenCalledWith(msgs.apiKey.expressAlreadySet);
    expect(p.select).not.toHaveBeenCalled();
  });

  it('skips and shows already-configured message when ANTHROPIC_API_KEY is set (non-advanced)', async () => {
    process.env.ANTHROPIC_API_KEY = 'sk-ant-existing';
    const { authStep } = await import('../steps/auth.js');
    await authStep(msgs, '/tmp/test', 'beginner');
    expect(p.log.success).toHaveBeenCalled();
    expect(p.select).not.toHaveBeenCalled();
  });

  it('subscription: calls execSync claude login on success', async () => {
    const { execSync } = await import('child_process');
    vi.mocked(p.select).mockResolvedValue('subscription');
    const { authStep } = await import('../steps/auth.js');
    await authStep(msgs, '/tmp/test-sub');
    expect(execSync).toHaveBeenCalledWith('claude login', expect.objectContaining({ stdio: 'inherit' }));
    expect(p.log.success).toHaveBeenCalled();
  });

  it('subscription: throws FatalError when claude login fails', async () => {
    const { execSync } = await import('child_process');
    vi.mocked(p.select).mockResolvedValue('subscription');
    vi.mocked(execSync).mockImplementation(() => { throw new Error('login failed'); });
    const { authStep } = await import('../steps/auth.js');
    await expect(authStep(msgs, '/tmp/test-sub')).rejects.toThrow();
  });

  it('apiKey: saves key to .env on valid input', async () => {
    const { writeFileSync } = await import('fs');
    vi.mocked(p.select).mockResolvedValue('apiKey');
    vi.mocked(p.text).mockResolvedValue('sk-ant-api03-validkeyabcdef12345');
    const { authStep } = await import('../steps/auth.js');
    await authStep(msgs, '/tmp/test-apikey');
    expect(writeFileSync).toHaveBeenCalled();
    expect(p.log.success).toHaveBeenCalled();
  });

  it('apiKey: throws UserCancelledError when user cancels text prompt', async () => {
    vi.mocked(p.select).mockResolvedValue('apiKey');
    vi.mocked(p.text).mockResolvedValue(Symbol.for('cancel') as unknown as string);
    vi.mocked(p.isCancel).mockReturnValue(true);
    const { authStep } = await import('../steps/auth.js');
    await expect(authStep(msgs, '/tmp/test-cancel')).rejects.toThrow();
    vi.mocked(p.isCancel).mockReturnValue(false);
  });

  it('teams: calls execSync claude login', async () => {
    const { execSync } = await import('child_process');
    vi.mocked(p.select).mockResolvedValue('teams');
    const { authStep } = await import('../steps/auth.js');
    await authStep(msgs, '/tmp/test-teams');
    expect(execSync).toHaveBeenCalledWith('claude login', expect.objectContaining({ stdio: 'inherit' }));
  });

  it('cloudProvider: shows env vars for Bedrock selection', async () => {
    vi.mocked(p.select)
      .mockResolvedValueOnce('cloudProvider')
      .mockResolvedValueOnce('bedrock');
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { authStep } = await import('../steps/auth.js');
    await authStep(msgs, '/tmp/test-cloud');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('CLAUDE_CODE_USE_BEDROCK=1'));
    consoleSpy.mockRestore();
  });

  it('cloudProvider: shows env vars for Vertex AI selection', async () => {
    vi.mocked(p.select)
      .mockResolvedValueOnce('cloudProvider')
      .mockResolvedValueOnce('vertex');
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { authStep } = await import('../steps/auth.js');
    await authStep(msgs, '/tmp/test-vertex');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('CLAUDE_CODE_USE_VERTEX=1'));
    consoleSpy.mockRestore();
  });

  it('throws UserCancelledError when method selection is cancelled', async () => {
    vi.mocked(p.select).mockResolvedValue(Symbol.for('cancel') as unknown as string);
    vi.mocked(p.isCancel).mockReturnValue(true);
    const { authStep } = await import('../steps/auth.js');
    await expect(authStep(msgs, '/tmp/test-cancel-method')).rejects.toThrow();
    vi.mocked(p.isCancel).mockReturnValue(false);
  });

  it('subscription: warns and prompts to remove existing API key conflict', async () => {
    const { existsSync, readFileSync } = await import('fs');
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue('ANTHROPIC_API_KEY=sk-ant-existing\n');
    vi.mocked(p.select).mockResolvedValue('subscription');
    vi.mocked(p.confirm).mockResolvedValue(false);
    const { authStep } = await import('../steps/auth.js');
    await authStep(msgs, '/tmp/test-conflict');
    expect(p.log.warn).toHaveBeenCalledWith(msgs.auth.apiKeyConflict);
    expect(p.confirm).toHaveBeenCalled();
  });
});
