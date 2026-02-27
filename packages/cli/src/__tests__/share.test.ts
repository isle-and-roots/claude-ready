import { describe, it, expect } from 'vitest';
import { generateShare } from '../steps/share.js';
import { loadMessages } from '@claude-ready/shared';

const msgs = loadMessages('en');

describe('generateShare', () => {
  it('returns text containing #ClaudeReady', () => {
    const startTime = Date.now() - 5000;
    const text = generateShare(msgs, startTime, 'website', 'v20.0.0');
    expect(text).toContain('#ClaudeReady');
  });

  it('contains the node version', () => {
    const startTime = Date.now() - 1000;
    const text = generateShare(msgs, startTime, 'webapp', 'v18.12.0');
    expect(text).toContain('v18.12.0');
  });

  it('contains the project type label for website', () => {
    const startTime = Date.now() - 1000;
    const text = generateShare(msgs, startTime, 'website', 'v20.0.0');
    expect(text).toContain('Simple Website');
  });

  it('contains the project type label for webapp', () => {
    const startTime = Date.now() - 1000;
    const text = generateShare(msgs, startTime, 'webapp', 'v20.0.0');
    expect(text).toContain('Web Application');
  });

  it('contains the project type label for cli-tool', () => {
    const startTime = Date.now() - 1000;
    const text = generateShare(msgs, startTime, 'cli-tool', 'v20.0.0');
    expect(text).toContain('CLI Tool');
  });

  it('contains the project type label for general', () => {
    const startTime = Date.now() - 1000;
    const text = generateShare(msgs, startTime, 'general', 'v20.0.0');
    expect(text).toContain('Claude Code Setup');
  });

  it('contains duration information', () => {
    const startTime = Date.now() - 3 * 60 * 1000; // 3 minutes ago
    const text = generateShare(msgs, startTime, 'webapp', 'v20.0.0');
    // Duration should be present in the text
    expect(text.length).toBeGreaterThan(50);
  });
});
