# {projectName}

A web application project.

## Project Structure
```
{projectName}/
├── src/
│   ├── index.html
│   ├── App.jsx       # Root component
│   ├── components/   # Reusable components
│   └── styles/       # CSS/styles
├── package.json
├── CLAUDE.md         # This file
└── .gitignore
```

## Development Guide
- Run `npm run dev` to start development server
- Components go in `src/components/`
- Keep components small and focused on one thing
- Use props for component configuration

## Coding Standards
- One component per file
- Descriptive variable and function names
- Extract repeated UI into components
- Handle loading and error states

## Security Rules
- NEVER read or output contents of .env or credential files
- NEVER hardcode API keys, tokens, or passwords
- Always use environment variables for sensitive configuration
- Validate all user input before processing
