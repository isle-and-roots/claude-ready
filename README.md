# claude-ready

[![npm](https://img.shields.io/npm/v/claude-ready)](https://www.npmjs.com/package/claude-ready)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)]()

**Get Claude Code running in 3 minutes. Zero config. Secure by default.**

> 🇯🇵 日本語版: [README_JA.md](README_JA.md)

---

## What is this?

**[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** is an AI coding assistant by Anthropic that works directly in your terminal. Setting it up securely — API keys, deny rules, project structure — takes know-how and time.

**claude-ready** automates all of that. Answer 3 questions, and you're building with AI in minutes. No terminal expertise needed.

---

## Quick Install

### macOS — Desktop App (Recommended)

No terminal knowledge required. Visual progress bar, guided setup, mouse-friendly.

```bash
curl -fsSL https://raw.githubusercontent.com/isle-and-roots/claude-ready/main/install.sh | bash
```

> **Manual install**: Download the `.dmg` from [Releases](https://github.com/isle-and-roots/claude-ready/releases/latest), then run:
> ```bash
> xattr -dr com.apple.quarantine ~/Downloads/"Claude.Ready_0.1.0_aarch64.dmg"
> ```
> Windows (.exe) and Linux (.AppImage) also available.

### CLI — All Platforms

```bash
npx claude-ready
```

---

## How It Works

```
1. Answer 3 questions     →   experience level · auth method · project type
2. claude-ready runs      →   writes config, applies 15 deny rules, sets up hooks
3. Start building         →   open your project folder and run `claude`
```

That's it.

---

## Features

- 🚀 **Zero-Decision Setup** — Only 3 questions. Done in 3 minutes.
- 🔒 **Secure by Default** — 15 deny rules auto-applied to every project
- 🖥️ **Desktop App** — No terminal required (macOS, Windows, Linux)
- 🤖 **CLI** — `npx claude-ready` for power users and automation
- 🌏 **English + Japanese** — Language auto-detected from your system
- 🎣 **Hooks Presets** — Auto-format, safe-commit, and more
- 📊 **Budget Tracking** — Cost estimation with `--cost`
- 🎴 **Share Cards** — Share your setup with the community (`--share`)

---

## Security

Every setup writes these deny rules into `.claude/settings.json`:

| Type | Rules |
|------|-------|
| **Read** | `.env`, `.env.*`, `.env.local`, `**/secrets/**`, `**/*credential*` |
| **Write** | `.env`, `.env.*`, `.env.local`, `*.pem`, `**/*credential*`, `.ssh/*` |
| **Bash** | `rm -rf /`, `rm -rf ~`, `sudo *`, `curl * | bash` |

Claude cannot read your secrets, write to sensitive files, or run destructive shell commands.

See [docs/TRUST.md](docs/TRUST.md) for the full transparency report.

---

## For Beginners

Never used a terminal before? No problem.

1. **macOS**: Run the `curl` command above in Terminal (search "Terminal" in Spotlight)
2. The **Desktop App** opens with a step-by-step visual wizard
3. Follow the on-screen prompts — no typing commands required

> **What is Claude Code?**
> Think of it as an AI assistant that lives inside your code editor. You describe what you want to build, and it writes the code. claude-ready makes sure it's set up safely from the start.

---

## For Developers

### CLI Options

```bash
npx claude-ready              # Interactive setup
npx claude-ready --dry-run    # Preview without writing any files
npx claude-ready --lang ja    # Force Japanese
npx claude-ready --lang en    # Force English
npx claude-ready --share      # Generate share text
npx claude-ready --cost       # Show cost estimator
npx claude-ready --learn      # Show learning journey
npx claude-ready --events     # Show upcoming events
```

### Hooks Presets

Optional automation hooks applied to `.claude/settings.json`:

| Hook | What it does |
|------|-------------|
| `auto-format` | Runs Prettier after every file edit |
| `safe-commit` | Auto-commits after edits (checkpoint style) |
| `dangerous-cmd-block` | Blocks dangerous shell commands before execution |
| `cost-tracker` | Logs token usage to `usage.log` |
| `notification` | Desktop notifications on task completion |

### Project Structure

```
claude-ready/
├── packages/
│   ├── cli/          # Main CLI (npx claude-ready)
│   ├── gui/          # Desktop App (Tauri v2 + React)
│   ├── shared/       # Shared logic (security, hooks, i18n)
│   └── skill/        # Skill integrations
├── docs/
│   ├── guide-ja.md   # Japanese setup guide
│   └── TRUST.md      # Full transparency document
└── templates/        # Project starter templates
```

### Local Development

```bash
git clone https://github.com/isle-and-roots/claude-ready.git
cd claude-ready
pnpm install
pnpm build
pnpm test
pnpm dev
```

---

## Documentation

- [Japanese Setup Guide](docs/guide-ja.md) — 日本語セットアップガイド
- [TRUST.md](docs/TRUST.md) — What gets written to your machine, and why

---

## Community

- **Claude Code Meetup Japan #3** — 2026/03/12 ([Details](https://github.com/isle-and-roots/claude-ready))
- Questions, feedback, and show-and-tell: open an [Issue](https://github.com/isle-and-roots/claude-ready/issues)

---

## Contributing

Contributions welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes
4. Push and open a Pull Request

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

Built for the Claude Code community.
