# @claude-ready/gui

Claude Ready desktop app built with Tauri v2 + React.

## Prerequisites

### Required: Rust

Tauri v2 requires Rust to compile the native backend. Install it with:

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

Then restart your terminal and verify:

```bash
rustc --version   # e.g. rustc 1.75.0
cargo --version   # e.g. cargo 1.75.0
```

### macOS additional requirements

```bash
xcode-select --install
```

### Linux additional requirements

```bash
sudo apt install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```

## Development

```bash
# From the repo root:
pnpm install

# Run the Tauri dev server (requires Rust):
pnpm --filter @claude-ready/gui tauri dev

# Build the React frontend only (no Rust needed):
pnpm --filter @claude-ready/gui build
```

## Build for production

```bash
# From packages/gui/:
pnpm tauri build
```

This will produce platform-specific installers in `src-tauri/target/release/bundle/`.

## Architecture

```
packages/gui/
├── src/                    # React frontend
│   ├── main.tsx            # React entry point
│   ├── App.tsx             # Step flow router + state
│   ├── styles.css          # Global styles
│   └── steps/              # Step components (Task 5.3.3)
│       ├── WelcomeStep.tsx
│       ├── EnvCheckStep.tsx
│       ├── SecurityStep.tsx
│       ├── HooksStep.tsx
│       ├── TemplatesStep.tsx
│       ├── McpStep.tsx
│       ├── I18nStep.tsx
│       └── CompleteStep.tsx
├── src-tauri/              # Rust / Tauri backend
│   ├── src/
│   │   ├── main.rs         # Entry point
│   │   └── lib.rs          # Tauri commands
│   ├── Cargo.toml
│   ├── build.rs
│   └── tauri.conf.json     # App config
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```
