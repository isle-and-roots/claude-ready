# claude-ready

> Secure Claude Code Onboarding Kit — from zero to building with AI, safely.

**claude-ready** gets you from zero to building with [Claude Code](https://docs.anthropic.com/en/docs/claude-code) in under 3 minutes. No experience required.

---

## Install

### Option 1: Desktop App (Recommended)

A native GUI with visual progress bar, guided setup, and mouse-friendly interface.

**[Download for macOS (.dmg)](https://github.com/isle-and-roots/claude-ready/releases/latest)** | [All platforms](https://github.com/isle-and-roots/claude-ready/releases/latest)

> Windows (.exe) and Linux (.AppImage) also available on the Releases page.

### Option 2: CLI

For terminal users and automation:

```bash
npx claude-ready
```

---

## Desktop App Features

| Feature | Desktop | CLI |
|---------|---------|-----|
| Visual progress bar | ✓ | — |
| Mouse-friendly guided setup | ✓ | — |
| Step-by-step explanations | ✓ | — |
| No terminal required | ✓ | — |
| Scriptable / CI-friendly | — | ✓ |
| Works offline | ✓ | ✓ |

---

## Trust & Transparency

**We believe you should know exactly what runs on your machine.**

### What claude-ready writes

| File | Purpose |
|------|---------|
| `.claude/settings.json` | Security deny rules + hooks configuration |
| `.env` | API key storage (mode `0o600`, owner-only read/write) |
| `CLAUDE.md` | Project-specific Claude Code instructions |
| `.gitignore` | Updated to exclude `.env` and secrets |

### What claude-ready does NOT do

- No telemetry or analytics
- No data sent to external servers (except `claude login` which is Anthropic's own CLI)
- No background processes
- No modifications outside the project directory

### Verify before running

```bash
npx claude-ready --dry-run
```

Preview the entire setup flow without writing any files.

---

## Features

| Feature | Description |
|---------|-------------|
| **Zero-Decision Setup** | Only 3 choices: experience level, auth method, project type |
| **Built-in Security** | 15 deny rules auto-applied to every project |
| **Hooks Presets** | Auto-format, safe-commit, dangerous command blocking, and more |
| **FinanceOps** | Budget tracking and cost estimation (`--cost`) |
| **i18n** | English + Japanese auto-detected |
| **Community** | Discord, meetups, share cards (`--share`) |

## Security

Every setup includes these deny rules in `.claude/settings.json`:

| Type | Rules |
|------|-------|
| **Read** | `.env`, `.env.*`, `.env.local`, `**/secrets/**`, `**/*credential*` |
| **Write** | `.env`, `.env.*`, `.env.local`, `*.pem`, `**/*credential*`, `.ssh/*` |
| **Bash** | `rm -rf /`, `rm -rf ~`, `sudo *`, `curl * | bash` |

### Hooks Presets

Optional automation hooks for `.claude/settings.json`:

| Hook | What it does |
|------|-------------|
| `auto-format` | Runs Prettier after every file edit |
| `safe-commit` | Auto-commits after edits (checkpoint style) |
| `dangerous-cmd-block` | Blocks dangerous shell commands before execution |
| `cost-tracker` | Logs token usage to `usage.log` |
| `notification` | Desktop notifications on task completion |

## For Everyone

| Level | Experience | What happens |
|-------|-----------|--------------|
| Beginner | Never used a terminal | Full guided mode with terminal tips and detailed explanations |
| Intermediate | Code sometimes | Standard mode with helpful context |
| Advanced | Developer | Express mode, minimal prompts |

## Project Templates

| Choice | What you get |
|--------|-------------|
| A simple website | HTML + CSS + JS starter |
| A web application | React + Vite scaffold |
| A command-line tool | Node.js CLI starter |
| Just set up Claude Code | Configuration only, no project files |

## CLI Options

```bash
npx claude-ready              # Interactive setup
npx claude-ready --dry-run    # Preview without writing files
npx claude-ready --lang ja    # Force Japanese
npx claude-ready --lang en    # Force English
npx claude-ready --share      # Generate share text
npx claude-ready --cost       # Show cost estimator
npx claude-ready --learn      # Show learning journey
npx claude-ready --events     # Show upcoming events
```

## Development

```bash
git clone https://github.com/isle-and-roots/claude-ready.git
cd claude-ready
pnpm install
pnpm build
pnpm test
pnpm dev
```

## Project Structure

```
claude-ready/
├── packages/
│   ├── cli/          # Main CLI (npx claude-ready)
│   ├── gui/          # Desktop App (Tauri v2 + React)
│   ├── shared/       # Shared logic (security, hooks, i18n)
│   └── website/      # Landing page (Astro)
├── docs/
│   └── TRUST.md      # Full transparency document
├── turbo.json        # Turborepo config
└── package.json      # Root workspace
```

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes
4. Push and open a Pull Request

## License

MIT — see [LICENSE](LICENSE) for details.

---

Built for the Claude Code community.
