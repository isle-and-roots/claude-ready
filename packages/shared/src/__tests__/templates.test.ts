import { describe, it, expect } from 'vitest';
import { generateClaudeMd } from '../templates.js';

describe('generateClaudeMd', () => {
  it('website template contains Security Rules', () => {
    const md = generateClaudeMd('website', 'test');
    expect(md).toContain('Security Rules');
  });

  it('webapp template contains Security Rules', () => {
    const md = generateClaudeMd('webapp', 'test');
    expect(md).toContain('Security Rules');
  });

  it('cli-tool template contains Security Rules', () => {
    const md = generateClaudeMd('cli-tool', 'test');
    expect(md).toContain('Security Rules');
  });

  it('general template contains Security Rules', () => {
    const md = generateClaudeMd('general', 'test');
    expect(md).toContain('Security Rules');
  });

  it('website template contains the project name', () => {
    const md = generateClaudeMd('website', 'myproject');
    expect(md).toContain('myproject');
  });

  it('webapp template contains the project name', () => {
    const md = generateClaudeMd('webapp', 'mywebapp');
    expect(md).toContain('mywebapp');
  });

  it('cli-tool template contains the project name', () => {
    const md = generateClaudeMd('cli-tool', 'mytool');
    expect(md).toContain('mytool');
  });

  it('general template contains the project name', () => {
    const md = generateClaudeMd('general', 'mygeneral');
    expect(md).toContain('mygeneral');
  });
});
