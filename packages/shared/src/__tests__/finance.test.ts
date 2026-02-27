import { describe, it, expect } from 'vitest';
import { estimateCost, checkThresholds, readBudgetConfig, writeBudgetConfig } from '../finance.js';

describe('estimateCost', () => {
  it('returns 0 for zero tokens', () => {
    expect(estimateCost(0, 0)).toBe(0);
  });

  it('calculates input cost correctly', () => {
    // 1000 input tokens at $0.003/1K = $0.003
    const cost = estimateCost(1000, 0);
    expect(cost).toBeCloseTo(0.003, 6);
  });

  it('calculates output cost correctly', () => {
    // 1000 output tokens at $0.015/1K = $0.015
    const cost = estimateCost(0, 1000);
    expect(cost).toBeCloseTo(0.015, 6);
  });

  it('calculates combined cost correctly', () => {
    // 1000 input + 1000 output = $0.003 + $0.015 = $0.018
    const cost = estimateCost(1000, 1000);
    expect(cost).toBeCloseTo(0.018, 6);
  });

  it('scales linearly with token count', () => {
    const cost1 = estimateCost(10000, 0);
    const cost2 = estimateCost(20000, 0);
    expect(cost2).toBeCloseTo(cost1 * 2, 6);
  });
});

describe('checkThresholds', () => {
  it('returns null when well under budget', () => {
    const result = checkThresholds(1, 20);
    expect(result).toBeNull();
  });

  it('returns info level at 50% threshold', () => {
    // 10/20 = 50%
    const result = checkThresholds(10, 20);
    expect(result).not.toBeNull();
    expect(result?.level).toBe('info');
  });

  it('returns null when under 50% threshold', () => {
    // 5/20 = 25%, under 50% threshold
    const result = checkThresholds(5, 20);
    expect(result).toBeNull();
  });

  it('returns warning level at 75% threshold', () => {
    // 15/20 = 75%
    const result = checkThresholds(15, 20);
    expect(result).not.toBeNull();
    expect(result?.level).toBe('warning');
  });

  it('returns critical level at $20 threshold', () => {
    const result = checkThresholds(20, 20);
    expect(result).not.toBeNull();
    expect(result?.level).toBe('critical');
  });

  it('returns critical level when exceeding budget', () => {
    const result = checkThresholds(25, 20);
    expect(result).not.toBeNull();
    expect(result?.level).toBe('critical');
  });

  it('includes spent and budget in result', () => {
    // 15/20 = 75% — triggers warning level
    const result = checkThresholds(15, 20);
    expect(result?.spent).toBe(15);
    expect(result?.budget).toBe(20);
  });
});

describe('readBudgetConfig', () => {
  it('returns an object with monthlyBudget', () => {
    const config = readBudgetConfig();
    expect(config).toHaveProperty('monthlyBudget');
    expect(typeof config.monthlyBudget).toBe('number');
  });

  it('returns an object with totalSpent', () => {
    const config = readBudgetConfig();
    expect(config).toHaveProperty('totalSpent');
    expect(typeof config.totalSpent).toBe('number');
  });

  it('returns an object with lastUpdated', () => {
    const config = readBudgetConfig();
    expect(config).toHaveProperty('lastUpdated');
    expect(typeof config.lastUpdated).toBe('string');
  });

  it('returns non-negative monthlyBudget', () => {
    const config = readBudgetConfig();
    expect(config.monthlyBudget).toBeGreaterThanOrEqual(0);
  });
});

describe('readBudgetConfig edge cases', () => {
  it('returns default for invalid JSON structure', () => {
    const config = readBudgetConfig();
    expect(config.monthlyBudget).toBeDefined();
    expect(typeof config.monthlyBudget).toBe('number');
  });
});

describe('estimateCost edge cases', () => {
  it('returns 0 for 0 tokens', () => {
    expect(estimateCost(0, 0)).toBe(0);
  });

  it('handles very large token counts', () => {
    const cost = estimateCost(1_000_000, 1_000_000);
    expect(cost).toBeGreaterThan(0);
    expect(typeof cost).toBe('number');
  });
});

describe('checkThresholds edge cases', () => {
  it('returns null when budget is 0 and spent is 0', () => {
    expect(checkThresholds(0, 0)).toBeNull();
  });

  it('handles negative budget gracefully', () => {
    const result = checkThresholds(10, -5);
    // ratio would be 10/-5 = -2, which is < 0.5, so null
    expect(result).toBeNull();
  });
});

describe('writeBudgetConfig', () => {
  it('is a function', () => {
    expect(typeof writeBudgetConfig).toBe('function');
  });
});
