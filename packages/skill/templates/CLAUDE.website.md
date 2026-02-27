# {projectName}

## Project Overview
A simple website built with HTML, CSS, and JavaScript.

## File Structure
```
{projectName}/
├── index.html      # Main entry point
├── style.css       # Styles
├── script.js       # JavaScript logic
└── assets/         # Images and other static files
```

## Development Guidelines
- Keep HTML semantic and accessible
- Use CSS variables for theming
- Prefer vanilla JS for simple interactions
- Optimize images before committing

## Beginner Tips
- Open index.html in a browser to preview changes
- Use browser DevTools (F12) to inspect and debug
- Commit often with descriptive messages

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
