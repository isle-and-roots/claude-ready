import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const SKILL_ROOT = join(__dirname, '../../../../packages/skill');
const SKILL_MD = join(SKILL_ROOT, 'SKILL.md');
const TEMPLATES_DIR = join(SKILL_ROOT, 'templates');

describe('SKILL.md existence and structure', () => {
  it('SKILL.md exists', () => {
    expect(existsSync(SKILL_MD)).toBe(true);
  });

  it('SKILL.md is non-empty', () => {
    const content = readFileSync(SKILL_MD, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });

  it('SKILL.md contains /setup command reference', () => {
    const content = readFileSync(SKILL_MD, 'utf-8');
    expect(content).toContain('/setup');
  });

  it('SKILL.md contains Step 1 (detect environment)', () => {
    const content = readFileSync(SKILL_MD, 'utf-8');
    expect(content).toContain('Step 1');
  });

  it('SKILL.md contains Step 2 (security settings)', () => {
    const content = readFileSync(SKILL_MD, 'utf-8');
    expect(content).toContain('Step 2');
  });

  it('SKILL.md contains Step 3 (hooks)', () => {
    const content = readFileSync(SKILL_MD, 'utf-8');
    expect(content).toContain('Step 3');
  });

  it('SKILL.md contains Step 4 (CLAUDE.md generation)', () => {
    const content = readFileSync(SKILL_MD, 'utf-8');
    expect(content).toContain('Step 4');
  });

  it('SKILL.md contains Step 5 (summary)', () => {
    const content = readFileSync(SKILL_MD, 'utf-8');
    expect(content).toContain('Step 5');
  });

  it('SKILL.md references all four project types', () => {
    const content = readFileSync(SKILL_MD, 'utf-8');
    expect(content).toContain('webapp');
    expect(content).toContain('cli-tool');
    expect(content).toContain('website');
    expect(content).toContain('general');
  });

  it('SKILL.md references platform-specific commands', () => {
    const content = readFileSync(SKILL_MD, 'utf-8');
    expect(content).toContain('macOS');
    expect(content).toContain('Linux');
    expect(content).toContain('Windows');
  });

  it('SKILL.md mentions settings.json', () => {
    const content = readFileSync(SKILL_MD, 'utf-8');
    expect(content).toContain('settings.json');
  });

  it('SKILL.md mentions CLAUDE.md', () => {
    const content = readFileSync(SKILL_MD, 'utf-8');
    expect(content).toContain('CLAUDE.md');
  });
});

describe('skill templates existence', () => {
  it('settings.json template exists', () => {
    expect(existsSync(join(TEMPLATES_DIR, 'settings.json'))).toBe(true);
  });

  it('CLAUDE.webapp.md template exists', () => {
    expect(existsSync(join(TEMPLATES_DIR, 'CLAUDE.webapp.md'))).toBe(true);
  });

  it('CLAUDE.website.md template exists', () => {
    expect(existsSync(join(TEMPLATES_DIR, 'CLAUDE.website.md'))).toBe(true);
  });

  it('CLAUDE.cli-tool.md template exists', () => {
    expect(existsSync(join(TEMPLATES_DIR, 'CLAUDE.cli-tool.md'))).toBe(true);
  });

  it('CLAUDE.general.md template exists', () => {
    expect(existsSync(join(TEMPLATES_DIR, 'CLAUDE.general.md'))).toBe(true);
  });
});

describe('settings.json template validity', () => {
  it('is valid JSON', () => {
    const content = readFileSync(join(TEMPLATES_DIR, 'settings.json'), 'utf-8');
    expect(() => JSON.parse(content)).not.toThrow();
  });

  it('has permissions.deny array', () => {
    const content = readFileSync(join(TEMPLATES_DIR, 'settings.json'), 'utf-8');
    const parsed = JSON.parse(content);
    expect(Array.isArray(parsed.permissions?.deny)).toBe(true);
    expect(parsed.permissions.deny.length).toBeGreaterThan(0);
  });

  it('deny rules include .env protection', () => {
    const content = readFileSync(join(TEMPLATES_DIR, 'settings.json'), 'utf-8');
    const parsed = JSON.parse(content);
    const deny: string[] = parsed.permissions.deny;
    expect(deny.some((r) => r.includes('.env'))).toBe(true);
  });

  it('deny rules include rm -rf protection', () => {
    const content = readFileSync(join(TEMPLATES_DIR, 'settings.json'), 'utf-8');
    const parsed = JSON.parse(content);
    const deny: string[] = parsed.permissions.deny;
    expect(deny.some((r) => r.includes('rm -rf'))).toBe(true);
  });
});

describe('CLAUDE.md templates content', () => {
  const templates = ['webapp', 'website', 'cli-tool', 'general'];

  for (const type of templates) {
    it(`CLAUDE.${type}.md contains {projectName} placeholder`, () => {
      const content = readFileSync(join(TEMPLATES_DIR, `CLAUDE.${type}.md`), 'utf-8');
      expect(content).toContain('{projectName}');
    });

    it(`CLAUDE.${type}.md contains Security Rules section`, () => {
      const content = readFileSync(join(TEMPLATES_DIR, `CLAUDE.${type}.md`), 'utf-8');
      expect(content).toContain('Security Rules');
    });

    it(`CLAUDE.${type}.md contains .env deny rule`, () => {
      const content = readFileSync(join(TEMPLATES_DIR, `CLAUDE.${type}.md`), 'utf-8');
      expect(content).toContain('.env');
    });
  }
});
