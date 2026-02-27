import { describe, it, expect } from 'vitest';
import {
  isMacOS,
  getNodeVersion,
  isNodeVersionSupported,
  checkEnvironment,
} from '../env-checks.js';

describe('isMacOS', () => {
  it('returns a boolean', () => {
    expect(typeof isMacOS()).toBe('boolean');
  });
});

describe('getNodeVersion', () => {
  it('returns a string starting with v', () => {
    const version = getNodeVersion();
    expect(typeof version).toBe('string');
    expect(version.startsWith('v')).toBe(true);
  });
});

describe('isNodeVersionSupported', () => {
  it('returns true when current Node major is >= minMajor', () => {
    expect(isNodeVersionSupported(1)).toBe(true);
  });

  it('returns false when minMajor is impossibly high', () => {
    expect(isNodeVersionSupported(99999)).toBe(false);
  });

  it('works correctly with Node 18 as minimum', () => {
    const result = isNodeVersionSupported(18);
    const currentMajor = parseInt(process.version.slice(1).split('.')[0], 10);
    expect(result).toBe(currentMajor >= 18);
  });
});

describe('checkEnvironment', () => {
  it('returns an object with the expected shape', () => {
    const env = checkEnvironment();
    expect(env).toHaveProperty('isMacOS');
    expect(env).toHaveProperty('nodeVersion');
    expect(env).toHaveProperty('isNodeVersionSupported');
    expect(env).toHaveProperty('isClaudeCodeInstalled');
    expect(env).toHaveProperty('systemLocale');
  });

  it('has correct types for all fields', () => {
    const env = checkEnvironment();
    expect(typeof env.isMacOS).toBe('boolean');
    expect(typeof env.nodeVersion).toBe('string');
    expect(typeof env.isNodeVersionSupported).toBe('boolean');
    expect(typeof env.isClaudeCodeInstalled).toBe('boolean');
    expect(typeof env.systemLocale).toBe('string');
  });
});
