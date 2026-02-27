import { getSecurityRulesMarkdown } from './security.js';

export type ProjectType = 'website' | 'webapp' | 'cli-tool' | 'general';

function websiteTemplate(projectName: string): string {
  return `# ${projectName}

## Project Overview
A simple website built with HTML, CSS, and JavaScript.

## File Structure
\`\`\`
${projectName}/
├── index.html      # Main entry point
├── style.css       # Styles
├── script.js       # JavaScript logic
└── assets/         # Images and other static files
\`\`\`

## Development Guidelines
- Keep HTML semantic and accessible
- Use CSS variables for theming
- Prefer vanilla JS for simple interactions
- Optimize images before committing

## Beginner Tips
- Open index.html in a browser to preview changes
- Use browser DevTools (F12) to inspect and debug
- Commit often with descriptive messages

${getSecurityRulesMarkdown()}`;
}

function webappTemplate(projectName: string): string {
  return `# ${projectName}

## Project Overview
A web application built with React/Next.js.

## File Structure
\`\`\`
${projectName}/
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # Reusable React components
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utility functions
├── public/             # Static assets
└── package.json
\`\`\`

## Development Guidelines
- Prefer server components by default; use 'use client' only when needed
- Keep components small and focused on a single responsibility
- Manage local UI state with useState; use a store for global state
- Co-locate tests with the files they test

## State Management
- Local state: \`useState\` / \`useReducer\`
- Server state: React Query or SWR
- Global state: Zustand or Jotai

${getSecurityRulesMarkdown()}`;
}

function cliToolTemplate(projectName: string): string {
  return `# ${projectName}

## Project Overview
A Node.js command-line tool.

## File Structure
\`\`\`
${projectName}/
├── src/
│   ├── index.ts        # CLI entry point
│   ├── commands/       # Subcommand handlers
│   └── utils/          # Shared utilities
├── bin/
│   └── cli.js          # Executable shim
└── package.json
\`\`\`

## Development Guidelines
- Use \`process.argv\` or a library like \`commander\` / \`yargs\` for argument parsing
- Always validate user input before processing
- Print helpful error messages with exit code 1 on failure
- Support \`--help\` and \`--version\` flags

## CLI Patterns
- Prefer async/await over callbacks
- Stream large outputs instead of buffering
- Respect \`NO_COLOR\` and \`FORCE_COLOR\` environment variables

${getSecurityRulesMarkdown()}`;
}

function generalTemplate(projectName: string): string {
  return `# ${projectName}

## Project Overview
A general development project.

## Development Guidelines
- Write clear, self-documenting code
- Keep functions small and focused
- Test your changes before committing
- Document non-obvious decisions

## Getting Started
1. Clone the repository
2. Install dependencies
3. Review the README for project-specific setup

${getSecurityRulesMarkdown()}`;
}

export function generateClaudeMd(projectType: ProjectType, projectName: string): string {
  switch (projectType) {
    case 'website':
      return websiteTemplate(projectName);
    case 'webapp':
      return webappTemplate(projectName);
    case 'cli-tool':
      return cliToolTemplate(projectName);
    case 'general':
      return generalTemplate(projectName);
  }
}
