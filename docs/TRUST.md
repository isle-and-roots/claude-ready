# Trust & Transparency

> claude-ready is fully open source. This document explains every file operation the tool performs.

## Files Written

### `.claude/settings.json`

**Purpose**: Security deny rules and hooks configuration for Claude Code.

**Contains**:
- `permissions.deny` — Array of file access and command restrictions
- `hooks` (optional) — Automation hooks selected during setup

**Source**: [`packages/shared/src/security.ts`](../packages/shared/src/security.ts)

### `.env`

**Purpose**: Stores your Anthropic API key (only when API Key auth method is selected).

**Security measures**:
- File permissions set to `0o600` (owner read/write only)
- Protected by deny rules: `Read(.env)`, `Write(.env)` prevent Claude from accessing it
- Automatically added to `.gitignore`

**Source**: [`packages/cli/src/steps/auth.ts`](../packages/cli/src/steps/auth.ts)

### `CLAUDE.md`

**Purpose**: Project-specific instructions for Claude Code. Contains development guidelines, file structure documentation, and security rules.

**Source**: [`packages/shared/src/templates.ts`](../packages/shared/src/templates.ts)

### `.gitignore`

**Purpose**: Updated to exclude sensitive files (`.env`, `.env.*`, `.env.local`).

### Project scaffold files

**Purpose**: Starter files for the chosen project type (HTML, React, or CLI).

**Source**: [`packages/shared/src/scaffolds.ts`](../packages/shared/src/scaffolds.ts)

## Files NOT Written

- No files are modified outside the project directory
- No global configuration files are changed (except optional Claude Code install via npm)
- No hidden background processes

## Network Activity

| Action | When | Destination |
|--------|------|-------------|
| `npm install -g @anthropic-ai/claude-code` | Only if Claude Code is not installed | npm registry |
| `claude login` | Only for subscription/teams auth | Anthropic servers |
| Event info fetch | Only with `--events` flag | GitHub raw content |

**No telemetry. No analytics. No tracking.**

## `--dry-run` Mode

Run `npx claude-ready --dry-run` to:
- Walk through the entire setup flow
- See every step and decision point
- Write zero files to disk
- Skip all installations

This lets you verify exactly what will happen before committing.

## Verifying the Source

Every function that writes files is in the open source repository:

- Security settings: [`packages/shared/src/security.ts`](../packages/shared/src/security.ts)
- Hook presets: [`packages/shared/src/hooks.ts`](../packages/shared/src/hooks.ts)
- Templates: [`packages/shared/src/templates.ts`](../packages/shared/src/templates.ts)
- Scaffolds: [`packages/shared/src/scaffolds.ts`](../packages/shared/src/scaffolds.ts)
- Auth & .env: [`packages/cli/src/steps/auth.ts`](../packages/cli/src/steps/auth.ts)
