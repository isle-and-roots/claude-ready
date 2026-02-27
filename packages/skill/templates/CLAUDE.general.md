# {projectName}

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
