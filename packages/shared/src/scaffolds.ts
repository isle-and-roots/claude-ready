import type { ProjectType } from './templates.js';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface ScaffoldFile {
  path: string;
  content: string;
}

export function getScaffoldFiles(projectType: ProjectType, projectName: string): ScaffoldFile[] {
  switch (projectType) {
    case 'website':
      return getWebsiteScaffold(projectName);
    case 'webapp':
      return getWebappScaffold(projectName);
    case 'cli-tool':
      return getCliToolScaffold(projectName);
    case 'general':
      return [];
  }
}

function getWebsiteScaffold(projectName: string): ScaffoldFile[] {
  const safeName = escapeHtml(projectName);
  return [
    {
      path: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeName}</title>
  <!-- Link to our stylesheet -->
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Page header -->
  <header>
    <h1>${safeName}</h1>
  </header>

  <!-- Main content area -->
  <main>
    <section class="container">
      <p>Welcome to ${safeName}!</p>
    </section>
  </main>

  <!-- Page footer -->
  <footer>
    <p>&copy; ${new Date().getFullYear()} ${safeName}</p>
  </footer>

  <!-- Link to our JavaScript -->
  <script src="script.js"></script>
</body>
</html>
`,
    },
    {
      path: 'style.css',
      content: `/* CSS Reset — normalize browser defaults */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* CSS Custom Properties for easy theming */
:root {
  --color-primary: #2563eb;
  --color-text: #1f2937;
  --color-bg: #ffffff;
  --color-muted: #6b7280;
  --font-base: system-ui, -apple-system, sans-serif;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
}

/* Base styles — mobile-first */
body {
  font-family: var(--font-base);
  color: var(--color-text);
  background-color: var(--color-bg);
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Centered content wrapper */
.container {
  width: 100%;
  max-width: 960px;
  margin-inline: auto;
  padding-inline: var(--spacing-md);
}

/* Header */
header {
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-md);
  text-align: center;
}

/* Main grows to fill available space */
main {
  flex: 1;
  padding: var(--spacing-lg) var(--spacing-md);
}

/* Footer */
footer {
  padding: var(--spacing-md);
  text-align: center;
  color: var(--color-muted);
  border-top: 1px solid #e5e7eb;
}
`,
    },
    {
      path: 'script.js',
      content: `// Wait for the page to fully load before running any code
document.addEventListener('DOMContentLoaded', () => {
  // Your JavaScript goes here
  console.log('${projectName} loaded!');
});
`,
    },
    {
      path: '.gitignore',
      content: `# Dependencies
node_modules/

# Environment variables — never commit secrets
.env
.env.local
.env.*.local

# macOS metadata
.DS_Store

# Editor directories
.vscode/
.idea/
`,
    },
  ];
}

function getWebappScaffold(projectName: string): ScaffoldFile[] {
  // Sanitize project name for use as a package name
  const packageName = projectName.toLowerCase().replace(/\s+/g, '-');
  const safeName = escapeHtml(projectName);

  return [
    {
      path: 'package.json',
      content: JSON.stringify(
        {
          name: packageName,
          version: '0.1.0',
          private: true,
          scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview',
          },
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0',
          },
          devDependencies: {
            '@vitejs/plugin-react': '^4.0.0',
            vite: '^5.0.0',
          },
        },
        null,
        2
      ) + '\n',
    },
    {
      path: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeName}</title>
</head>
<body>
  <!-- React mounts here -->
  <div id="root"></div>
  <script type="module" src="./src/main.jsx"></script>
</body>
</html>
`,
    },
    {
      path: 'src/main.jsx',
      content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
    },
    {
      path: 'src/App.jsx',
      content: `// Root application component
function App() {
  return (
    <div className="app">
      <header>
        <h1>${projectName}</h1>
      </header>
      <main>
        <p>Welcome to ${projectName}!</p>
      </main>
    </div>
  );
}

export default App;
`,
    },
    {
      path: '.gitignore',
      content: `# Dependencies
node_modules/

# Build output
dist/

# Environment variables — never commit secrets
.env
.env.local
.env.*.local

# macOS metadata
.DS_Store

# Editor directories
.vscode/
.idea/
`,
    },
  ];
}

function getCliToolScaffold(projectName: string): ScaffoldFile[] {
  // Sanitize project name for use as a package name and binary name
  const packageName = projectName.toLowerCase().replace(/\s+/g, '-');

  return [
    {
      path: 'package.json',
      content: JSON.stringify(
        {
          name: packageName,
          version: '0.1.0',
          type: 'module',
          bin: {
            [packageName]: './src/index.js',
          },
          scripts: {
            start: 'node src/index.js',
          },
        },
        null,
        2
      ) + '\n',
    },
    {
      path: 'src/index.js',
      content: `#!/usr/bin/env node
// ${projectName} — CLI entry point

// Parse command-line arguments (skip 'node' and the script path)
const args = process.argv.slice(2);

// Show help when no arguments are provided
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(\`
${projectName}

Usage:
  ${packageName} [options]

Options:
  --help, -h    Show this help message
  --version     Show version number
\`);
  process.exit(0);
}

if (args.includes('--version')) {
  // Read version from package.json
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  const pkg = require('../package.json');
  console.log(pkg.version);
  process.exit(0);
}

// Your CLI logic goes here
console.log('Running ${projectName} with args:', args);
`,
    },
    {
      path: '.gitignore',
      content: `# Dependencies
node_modules/

# Environment variables — never commit secrets
.env
.env.local
.env.*.local

# macOS metadata
.DS_Store

# Editor directories
.vscode/
.idea/
`,
    },
  ];
}
