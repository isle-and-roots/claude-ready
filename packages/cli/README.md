# claude-ready

> Type one command. Start building with AI.

**claude-ready** gets you from zero to building with [Claude Code](https://docs.anthropic.com/en/docs/claude-code) in under 3 minutes. No experience required.

## Quick Start

```bash
npx claude-ready
```

That's it. One command handles everything:

- Detects your environment (macOS, Node.js)
- Installs Claude Code automatically
- Sets up your API key with guided steps
- Applies security best practices (auto, invisible)
- Creates your first project with a tailored CLAUDE.md

## Features

### Zero-Decision Setup
You make only 3 choices: your experience level, paste an API key, and pick what to build. Everything else is automatic.

### Built-in Security
Every setup automatically includes:
- `.env` and credential file protection
- Dangerous command blocking (`rm -rf /`, `sudo`, `curl | bash`)
- Sandbox mode enabled
- Security rules in every CLAUDE.md template

### Internationalization
Automatically detects your system language. Currently supports:
- English
- 日本語 (Japanese)

### Community
- `npx claude-ready --share` — Generate a share card for social media
- Join our [Discord](https://discord.gg/claude-code-jp)
- [Claude Code Meetup Japan](https://meetup.com)

## Experience Levels

| Level | What happens |
|-------|-------------|
| **Never used a terminal** | Full guided mode with extra explanations |
| **Code sometimes** | Standard mode with helpful context |
| **Developer** | Express mode, minimal prompts |

## Project Templates

| Choice | What you get |
|--------|-------------|
| **A simple website** | HTML + CSS + JS starter |
| **A web application** | React project scaffold |
| **A command-line tool** | Node.js CLI starter |
| **Just set up Claude Code** | Claude Code ready, no project |

## CLI Options

```bash
npx claude-ready              # Interactive setup
npx claude-ready --share      # Generate share text
npx claude-ready --lang ja    # Force Japanese
npx claude-ready --lang en    # Force English
```

## Development

```bash
# Clone the repo
git clone https://github.com/anthropics/claude-ready.git
cd claude-ready

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Development mode
pnpm dev
```

## Project Structure

```
claude-ready/
├── packages/
│   ├── cli/          # Main CLI tool (npx claude-ready)
│   └── shared/       # Shared logic (env detection, security, i18n)
├── templates/        # CLAUDE.md templates
├── turbo.json        # Turborepo config
└── package.json      # Root workspace
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT — see [LICENSE](LICENSE) for details.

---

Built with ❤️ for the Claude Code community.
