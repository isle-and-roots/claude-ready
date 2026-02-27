import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export type McpPresetId =
  | 'filesystem'
  | 'github'
  | 'postgres'
  | 'puppeteer'
  | 'brave-search';

export interface McpServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface McpConfig {
  mcpServers: Record<string, McpServerConfig>;
}

export interface McpPreset {
  id: McpPresetId;
  server: McpServerConfig;
  requiresEnv?: string[];
}

function buildPreset(id: McpPresetId, projectDir?: string): McpPreset {
  switch (id) {
    case 'filesystem':
      return {
        id,
        server: {
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-filesystem', projectDir ?? '.'],
          env: {},
        },
      };
    case 'github':
      return {
        id,
        server: {
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-github'],
          env: { GITHUB_PERSONAL_ACCESS_TOKEN: '' },
        },
        requiresEnv: ['GITHUB_PERSONAL_ACCESS_TOKEN'],
      };
    case 'postgres':
      return {
        id,
        server: {
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-postgres'],
          env: { POSTGRES_CONNECTION_STRING: '' },
        },
        requiresEnv: ['POSTGRES_CONNECTION_STRING'],
      };
    case 'puppeteer':
      return {
        id,
        server: {
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-puppeteer'],
          env: {},
        },
      };
    case 'brave-search':
      return {
        id,
        server: {
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-brave-search'],
          env: { BRAVE_API_KEY: '' },
        },
        requiresEnv: ['BRAVE_API_KEY'],
      };
  }
}

export function getMcpPresets(): McpPreset[] {
  const ids: McpPresetId[] = [
    'filesystem',
    'github',
    'postgres',
    'puppeteer',
    'brave-search',
  ];
  return ids.map((id) => buildPreset(id));
}

export function generateMcpConfig(presetIds: McpPresetId[], projectDir?: string): McpConfig {
  const config: McpConfig = { mcpServers: {} };

  for (const id of presetIds) {
    const preset = buildPreset(id, projectDir);
    config.mcpServers[id] = preset.server;
  }

  return config;
}

export function getGithubTokenGuide(): string {
  return [
    'To use the GitHub MCP server, set GITHUB_PERSONAL_ACCESS_TOKEN:',
    '  1. Go to https://github.com/settings/tokens',
    '  2. Generate a new token with "repo" and "read:org" scopes',
    '  3. Add to your shell profile: export GITHUB_PERSONAL_ACCESS_TOKEN=your_token',
  ].join('\n');
}

export function applyMcpConfig(projectDir: string, presetIds: McpPresetId[]): void {
  if (presetIds.length === 0) return;

  const config = generateMcpConfig(presetIds, projectDir);
  const mcpPath = join(projectDir, '.mcp.json');

  try {
    mkdirSync(projectDir, { recursive: true });
  } catch (err) {
    const code = err instanceof Error && 'code' in err ? (err as NodeJS.ErrnoException).code : undefined;
    throw new Error(`Failed to create project directory (${code ?? 'unknown error'})`);
  }

  try {
    writeFileSync(mcpPath, JSON.stringify(config, null, 2) + '\n', 'utf-8');
  } catch (err) {
    const code = err instanceof Error && 'code' in err ? (err as NodeJS.ErrnoException).code : undefined;
    throw new Error(`Failed to write .mcp.json (${code ?? 'unknown error'})`);
  }
}
