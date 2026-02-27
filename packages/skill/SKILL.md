# /setup — Claude Ready Best Practices Skill

This is a Claude Code slash command skill. When the user runs `/setup`, Claude follows the instructions below to apply claude-ready best practices to their current project.

---

## Instructions for Claude

When the user invokes `/setup`, perform the following steps in order. Ask for confirmation before writing any files.

### Step 1 — Detect environment

Check the current working directory and gather context:

1. Identify the project type by examining files present:
   - `package.json` with `next` → **webapp**
   - `package.json` with `bin` field or `commander`/`yargs` dep → **cli-tool**
   - `index.html` at root → **website**
   - Anything else → **general**

2. Check whether `.claude/settings.json` already exists. If it does, show the user its current contents and ask whether to overwrite.

3. Check whether `CLAUDE.md` already exists at the project root. If it does, show the user its first 20 lines and ask whether to overwrite.

Report your findings in a brief summary before proceeding.

---

### Step 2 — Apply security settings

Create or update `.claude/settings.json` with the following deny rules:

```json
{
  "permissions": {
    "deny": [
      "Read(.env)",
      "Read(.env.*)",
      "Read(.env.local)",
      "Read(**/secrets/**)",
      "Read(**/*credential*)",
      "Bash(rm -rf /)",
      "Bash(rm -rf ~)",
      "Bash(sudo *)",
      "Bash(curl * | bash)",
      "Write(.env)",
      "Write(.env.*)",
      "Write(.env.local)",
      "Write(*.pem)",
      "Write(**/*credential*)",
      "Write(.ssh/*)"
    ]
  }
}
```

If the user also wants hook presets (see Step 3), merge them into this file as a `hooks` field.

---

### Step 3 — Configure hooks (optional)

Ask the user which hook presets they want. Present the options as a numbered list:

1. **auto-format** — Runs `prettier --write` after every file edit (requires `prettier` installed)
2. **safe-commit** — Auto-commits a checkpoint after every file edit
3. **dangerous-cmd-block** — Blocks destructive shell commands before they run
4. **cost-tracker** — Appends a timestamped log entry to `usage.log` after every tool use
5. **notification** — Sends a desktop notification when Claude finishes a task

After the user selects presets, add a `hooks` section to `.claude/settings.json`.

**Platform-specific notification commands:**
- macOS: `osascript -e 'display notification "$CLAUDE_NOTIFICATION" with title "Claude Code"'`
- Linux: `notify-send "Claude Code" "$CLAUDE_NOTIFICATION"`
- Windows: `powershell -Command "[System.Windows.Forms.MessageBox]::Show('$env:CLAUDE_NOTIFICATION', 'Claude Code')"`

**dangerous-cmd-block pattern to use in the hook command:**
```
rm -rf /|rm -rf ~|rm -rf *|mkfs|dd if=|:\(\).*\{.*:\|:.*\};.*:|chmod -R 777 /|wget.*\|.*sh|curl.*\|.*sh|del /s|format [A-Z]:|rd /s
```

Example merged `settings.json` with dangerous-cmd-block and notification (macOS):

```json
{
  "permissions": {
    "deny": ["Read(.env)", "..."]
  },
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "command": "if echo \"$CLAUDE_COMMAND\" | grep -qE 'rm -rf /|rm -rf ~|...'; then echo \"BLOCKED: dangerous command detected\" >&2; exit 2; fi",
        "matcher": { "tool_name": "Bash" }
      }
    ],
    "Notification": [
      {
        "type": "command",
        "command": "osascript -e 'display notification \"$CLAUDE_NOTIFICATION\" with title \"Claude Code\"'",
        "timeout": 5000
      }
    ]
  }
}
```

---

### Step 4 — Generate CLAUDE.md

Ask the user for their project name (default: the current directory name).

Generate a `CLAUDE.md` file tailored to the detected project type:

**For webapp (React/Next.js):**
```markdown
# {projectName}

## Project Overview
A web application built with React/Next.js.

## Development Guidelines
- Prefer server components by default; use 'use client' only when needed
- Keep components small and focused on a single responsibility
- Manage local UI state with useState; use a store for global state
- Co-locate tests with the files they test

## State Management
- Local state: `useState` / `useReducer`
- Server state: React Query or SWR
- Global state: Zustand or Jotai

## Security Rules
The following operations are denied for safety:
- `Read(.env)`, `Read(.env.*)`, `Read(.env.local)`
- `Bash(rm -rf /)`, `Bash(sudo *)`, `Bash(curl * | bash)`
- `Write(.env)`, `Write(*.pem)`, `Write(.ssh/*)`
```

**For cli-tool:**
```markdown
# {projectName}

## Project Overview
A Node.js command-line tool.

## Development Guidelines
- Validate user input before processing
- Print helpful error messages with exit code 1 on failure
- Support `--help` and `--version` flags
- Prefer async/await over callbacks

## Security Rules
[same deny rules as above]
```

**For website (HTML/CSS/JS):**
```markdown
# {projectName}

## Project Overview
A simple website built with HTML, CSS, and JavaScript.

## Development Guidelines
- Keep HTML semantic and accessible
- Use CSS variables for theming
- Prefer vanilla JS for simple interactions

## Security Rules
[same deny rules as above]
```

**For general:**
```markdown
# {projectName}

## Project Overview
A general development project.

## Development Guidelines
- Write clear, self-documenting code
- Keep functions small and focused
- Test your changes before committing

## Security Rules
[same deny rules as above]
```

---

### Step 5 — Summary

After completing all steps, print a summary of what was done:

```
claude-ready /setup complete

Files created/updated:
  .claude/settings.json  — security deny rules + selected hooks
  CLAUDE.md              — project guidelines for {projectType}

Hook presets applied: {list or "none"}

Next steps:
  - Review .claude/settings.json and customize as needed
  - Edit CLAUDE.md to add project-specific conventions
  - Run `npx claude-ready` to go through the full interactive setup
```

---

## Notes for Claude

- Never overwrite files without explicit user confirmation.
- If the user declines a step, skip it gracefully and move on.
- Keep explanations concise. The user already knows Claude Code.
- On Windows, adjust shell commands: use `powershell` instead of `bash`, use `Get-Date` instead of `date`, use `findstr` instead of `grep`.
- If `.env` or secrets files are found in the directory, remind the user they are protected by the deny rules.
