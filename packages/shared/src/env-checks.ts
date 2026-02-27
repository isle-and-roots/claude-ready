import { execSync } from 'child_process';

export function isMacOS(): boolean {
  return process.platform === 'darwin';
}

export function isWindows(): boolean {
  return process.platform === 'win32';
}

export function isLinux(): boolean {
  return process.platform === 'linux';
}

export function getNodeVersion(): string {
  return process.version;
}

export function isNodeVersionSupported(minMajor: number): boolean {
  const major = parseInt(process.version.slice(1).split('.')[0], 10);
  return major >= minMajor;
}

export function isClaudeCodeInstalled(): boolean {
  try {
    const cmd = process.platform === 'win32' ? 'where claude' : 'which claude';
    execSync(cmd, { stdio: 'ignore', timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

export function getSystemLocale(): string {
  try {
    const locale = new Intl.DateTimeFormat().resolvedOptions().locale;
    if (locale) return locale;
  } catch {
    // fall through
  }
  return process.env.LANG ?? 'en-US';
}

export interface EnvironmentStatus {
  isMacOS: boolean;
  isWindows: boolean;
  isLinux: boolean;
  nodeVersion: string;
  isNodeVersionSupported: boolean;
  isClaudeCodeInstalled: boolean;
  systemLocale: string;
}

export function checkEnvironment(): EnvironmentStatus {
  return {
    isMacOS: isMacOS(),
    isWindows: isWindows(),
    isLinux: isLinux(),
    nodeVersion: getNodeVersion(),
    isNodeVersionSupported: isNodeVersionSupported(18),
    isClaudeCodeInstalled: isClaudeCodeInstalled(),
    systemLocale: getSystemLocale(),
  };
}
