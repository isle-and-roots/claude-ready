# {projectName}

## Project Overview
A Node.js command-line tool.

## File Structure
```
{projectName}/
├── src/
│   ├── index.ts        # CLI entry point
│   ├── commands/       # Subcommand handlers
│   └── utils/          # Shared utilities
├── bin/
│   └── cli.js          # Executable shim
└── package.json
```

## Development Guidelines
- Use `process.argv` or a library like `commander` / `yargs` for argument parsing
- Always validate user input before processing
- Print helpful error messages with exit code 1 on failure
- Support `--help` and `--version` flags

## CLI Patterns
- Prefer async/await over callbacks
- Stream large outputs instead of buffering
- Respect `NO_COLOR` and `FORCE_COLOR` environment variables

## Security Rules

The following operations are denied for safety:

- `Read(.env)`
- `Read(.env.*)`
- `Read(.env.local)`
- `Read(**/secrets/**)`
- `Read(**/*credential*)`
- `Bash(rm -rf /)`
- `Bash(rm -rf ~)`
- `Bash(sudo *)`
- `Bash(curl * | bash)`
- `Write(.env)`
- `Write(.env.*)`
- `Write(.env.local)`
- `Write(*.pem)`
- `Write(**/*credential*)`
- `Write(.ssh/*)`
