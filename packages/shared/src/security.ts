import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export const DENY_RULES = [
  'Read(.env)',
  'Read(.env.*)',
  'Read(.env.local)',
  'Read(**/secrets/**)',
  'Read(**/*credential*)',
  'Bash(rm -rf /)',
  'Bash(rm -rf ~)',
  'Bash(sudo *)',
  'Bash(curl * | bash)',
  'Write(.env)',
  'Write(.env.*)',
  'Write(.env.local)',
  'Write(*.pem)',
  'Write(**/*credential*)',
  'Write(.ssh/*)',
] as const;

export type DenyRule = (typeof DENY_RULES)[number];

export function generateClaudeSettings(): {
  permissions: { deny: readonly string[] };
} {
  return {
    permissions: {
      deny: DENY_RULES,
    },
  };
}

export function getSecurityRulesMarkdown(): string {
  const rules = DENY_RULES.map((rule) => `- \`${rule}\``).join('\n');
  return `## Security Rules

The following operations are denied for safety:

${rules}
`;
}

export function applySecuritySettings(projectDir: string): void {
  const claudeDir = join(projectDir, '.claude');
  try {
    mkdirSync(claudeDir, { recursive: true });
  } catch (err) {
    const code = err instanceof Error && 'code' in err ? (err as NodeJS.ErrnoException).code : undefined;
    throw new Error(`Failed to create .claude directory (${code ?? 'unknown error'})`);
  }
  const settingsPath = join(claudeDir, 'settings.json');
  const settings = generateClaudeSettings();
  try {
    writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf-8');
  } catch (err) {
    const code = err instanceof Error && 'code' in err ? (err as NodeJS.ErrnoException).code : undefined;
    throw new Error(`Failed to write security settings (${code ?? 'unknown error'})`);
  }
}
