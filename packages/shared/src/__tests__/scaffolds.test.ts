import { describe, it, expect } from 'vitest';
import { getScaffoldFiles } from '../scaffolds.js';

describe('getScaffoldFiles', () => {
  it('website returns files including index.html', () => {
    const files = getScaffoldFiles('website', 'test');
    const paths = files.map((f) => f.path);
    expect(paths).toContain('index.html');
  });

  it('webapp returns files including package.json', () => {
    const files = getScaffoldFiles('webapp', 'test');
    const paths = files.map((f) => f.path);
    expect(paths).toContain('package.json');
  });

  it('cli-tool returns files including src/index.js', () => {
    const files = getScaffoldFiles('cli-tool', 'test');
    const paths = files.map((f) => f.path);
    expect(paths).toContain('src/index.js');
  });

  it('general returns empty array', () => {
    const files = getScaffoldFiles('general', 'test');
    expect(files).toEqual([]);
  });

  it('each scaffold file has path and content strings', () => {
    const files = getScaffoldFiles('website', 'mysite');
    for (const file of files) {
      expect(typeof file.path).toBe('string');
      expect(typeof file.content).toBe('string');
    }
  });

  it('website files contain the project name', () => {
    const files = getScaffoldFiles('website', 'mysite');
    const indexHtml = files.find((f) => f.path === 'index.html');
    expect(indexHtml?.content).toContain('mysite');
  });

  it('webapp files contain the project name', () => {
    const files = getScaffoldFiles('webapp', 'myapp');
    const appJsx = files.find((f) => f.path === 'src/App.jsx');
    expect(appJsx?.content).toContain('myapp');
  });

  it('scaffold file paths do not contain path traversal sequences', () => {
    const types = ['website', 'webapp', 'cli-tool'] as const;
    for (const type of types) {
      const files = getScaffoldFiles(type, 'test');
      for (const file of files) {
        expect(file.path).not.toContain('..');
        expect(file.path.startsWith('/')).toBe(false);
      }
    }
  });

  it('handles project names with special characters safely', () => {
    const files = getScaffoldFiles('website', 'my-project_v2');
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      expect(typeof file.path).toBe('string');
      expect(typeof file.content).toBe('string');
    }
  });
});
