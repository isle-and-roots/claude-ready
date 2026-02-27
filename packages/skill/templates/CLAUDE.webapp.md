# {projectName}

## Project Overview
A web application built with React/Next.js.

## File Structure
```
{projectName}/
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # Reusable React components
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utility functions
├── public/             # Static assets
└── package.json
```

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
