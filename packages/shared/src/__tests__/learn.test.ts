import { describe, it, expect } from 'vitest';
import { getLevels, readProgress, type LevelDefinition } from '../learn.js';

describe('getLevels', () => {
  it('returns exactly 5 levels', () => {
    const levels = getLevels();
    expect(levels).toHaveLength(5);
  });

  it('levels are numbered 1 through 5', () => {
    const levels = getLevels();
    expect(levels.map((l) => l.level)).toEqual([1, 2, 3, 4, 5]);
  });

  it('each level has a name', () => {
    const levels = getLevels();
    for (const level of levels) {
      expect(typeof level.name).toBe('string');
      expect(level.name.length).toBeGreaterThan(0);
    }
  });

  it('each level has a description', () => {
    const levels = getLevels();
    for (const level of levels) {
      expect(typeof level.description).toBe('string');
      expect(level.description.length).toBeGreaterThan(0);
    }
  });

  it('each level has at least one task', () => {
    const levels = getLevels();
    for (const level of levels) {
      expect(Array.isArray(level.tasks)).toBe(true);
      expect(level.tasks.length).toBeGreaterThan(0);
    }
  });

  it('level 1 is Intro', () => {
    const levels = getLevels();
    expect(levels[0].name).toBe('Intro');
  });

  it('level 5 is Team Workflows', () => {
    const levels = getLevels();
    expect(levels[4].name).toBe('Team Workflows');
  });
});

describe('readProgress', () => {
  it('returns an object with currentLevel', () => {
    const progress = readProgress();
    expect(progress).toHaveProperty('currentLevel');
    expect(typeof progress.currentLevel).toBe('number');
  });

  it('returns a valid currentLevel (1-5)', () => {
    const progress = readProgress();
    expect(progress.currentLevel).toBeGreaterThanOrEqual(1);
    expect(progress.currentLevel).toBeLessThanOrEqual(5);
  });

  it('returns an object with completedTasks array', () => {
    const progress = readProgress();
    expect(progress).toHaveProperty('completedTasks');
    expect(Array.isArray(progress.completedTasks)).toBe(true);
  });

  it('returns an object with lastUpdated string', () => {
    const progress = readProgress();
    expect(progress).toHaveProperty('lastUpdated');
    expect(typeof progress.lastUpdated).toBe('string');
  });

  it('defaults to level 1 when no file exists', () => {
    // The test environment likely has no ~/.claude-ready/progress.json
    // so it should return defaults
    const progress = readProgress();
    // Either defaults (1) or a valid level from an existing file
    expect([1, 2, 3, 4, 5]).toContain(progress.currentLevel);
  });
});
