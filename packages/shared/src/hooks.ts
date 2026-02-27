export type HookPresetId =
  | 'auto-format'
  | 'safe-commit'
  | 'dangerous-cmd-block'
  | 'cost-tracker'
  | 'notification';

export interface HookMatcher {
  tool_name?: string;
  command_pattern?: string;
}

export interface HookEntry {
  type: 'command';
  command: string;
  matcher?: HookMatcher;
  timeout?: number;
}

export interface HooksConfig {
  PreToolUse?: HookEntry[];
  PostToolUse?: HookEntry[];
  Notification?: HookEntry[];
}

export interface HookPreset {
  id: HookPresetId;
  hooks: HooksConfig;
  requiresTools?: string[];
}

const DANGEROUS_COMMANDS = [
  'rm -rf /',
  'rm -rf ~',
  'rm -rf *',
  'mkfs',
  'dd if=',
  ':(){:|:&};:',
  'chmod -R 777 /',
  'wget.*\\|.*sh',
  'curl.*\\|.*sh',
  // Windows-specific dangerous commands
  'del /s',
  'format [A-Z]:',
  'rd /s',
].join('|');

const DANGEROUS_COMMANDS_WINDOWS = [
  'del /s',
  'format [A-Z]:',
  'rd /s',
  'Remove-Item.*-Recurse.*-Force',
  'Format-Volume',
].join('|');

function getNotificationCommand(platform: NodeJS.Platform): string {
  switch (platform) {
    case 'darwin':
      return 'osascript -e \'display notification "$CLAUDE_NOTIFICATION" with title "Claude Code"\'';
    case 'win32':
      return 'powershell -Command "[System.Windows.Forms.MessageBox]::Show(\'$env:CLAUDE_NOTIFICATION\', \'Claude Code\')"';
    default:
      return 'notify-send "Claude Code" "$CLAUDE_NOTIFICATION"';
  }
}

function buildPreset(id: HookPresetId, platform: NodeJS.Platform): HookPreset {
  switch (id) {
    case 'auto-format':
      return {
        id,
        hooks: {
          PostToolUse: [
            {
              type: 'command',
              command: 'npx prettier --write "$CLAUDE_FILE_PATH" 2>/dev/null || true',
              matcher: { tool_name: 'Edit' },
              timeout: 10000,
            },
          ],
        },
        requiresTools: ['prettier'],
      };
    case 'safe-commit':
      return {
        id,
        hooks: {
          PostToolUse: [
            {
              type: 'command',
              command: 'git add -A && git commit -m "checkpoint: auto-save" --no-verify 2>/dev/null || true',
              matcher: { tool_name: 'Edit' },
              timeout: 10000,
            },
          ],
        },
      };
    case 'dangerous-cmd-block': {
      const blockCommand =
        platform === 'win32'
          ? `$cmd = $env:CLAUDE_COMMAND; if ($cmd -match '${DANGEROUS_COMMANDS_WINDOWS}') { Write-Error 'BLOCKED: dangerous command detected'; exit 2 }`
          : `if echo "$CLAUDE_COMMAND" | grep -qE '${DANGEROUS_COMMANDS}'; then echo "BLOCKED: dangerous command detected" >&2; exit 2; fi`;
      return {
        id,
        hooks: {
          PreToolUse: [
            {
              type: 'command',
              command: blockCommand,
              matcher: { tool_name: 'Bash' },
            },
          ],
        },
      };
    }
    case 'cost-tracker': {
      const costCommand =
        platform === 'win32'
          ? 'powershell -Command "Add-Content -Path usage.log -Value ((Get-Date -Format \'yyyy-MM-ddTHH:mm:ssZ\') + \' tool=\' + $env:CLAUDE_TOOL_NAME)"'
          : 'echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) tool=$CLAUDE_TOOL_NAME" >> usage.log';
      return {
        id,
        hooks: {
          PostToolUse: [
            {
              type: 'command',
              command: costCommand,
              timeout: 5000,
            },
          ],
        },
      };
    }
    case 'notification':
      return {
        id,
        hooks: {
          Notification: [
            {
              type: 'command',
              command: getNotificationCommand(platform),
              timeout: 5000,
            },
          ],
        },
      };
  }
}

export function getHookPresets(platform: NodeJS.Platform = process.platform): HookPreset[] {
  const ids: HookPresetId[] = [
    'auto-format',
    'safe-commit',
    'dangerous-cmd-block',
    'cost-tracker',
    'notification',
  ];
  return ids.map((id) => buildPreset(id, platform));
}

export function generateHooksConfig(
  presetIds: HookPresetId[],
  platform: NodeJS.Platform = process.platform,
): HooksConfig {
  const merged: HooksConfig = {};

  for (const id of presetIds) {
    const preset = buildPreset(id, platform);
    for (const [event, entries] of Object.entries(preset.hooks)) {
      const key = event as keyof HooksConfig;
      if (!merged[key]) {
        merged[key] = [];
      }
      merged[key].push(...entries);
    }
  }

  return merged;
}
