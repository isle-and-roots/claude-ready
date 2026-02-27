import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },

  // @claude-ready/shared uses Node.js builtins (child_process, fs, path) for
  // its runtime helpers. In the Tauri GUI, those calls go through the Rust
  // backend (bridge.ts invoke()). We only use the *types* from shared in the
  // browser bundle, so we resolve shared from its source to get treeshaking,
  // and stub the Node builtins so Vite doesn't try to bundle them.
  resolve: {
    alias: {
      // Point directly at shared source so rollup can tree-shake type-only imports
      "@claude-ready/shared": new URL(
        "../shared/src/index.ts",
        import.meta.url,
      ).pathname,
    },
  },

  build: {
    rollupOptions: {
      // Stub Node built-ins that @claude-ready/shared imports at module level.
      // These are never called from the browser — only the Rust backend calls them.
      external: ["child_process", "fs", "path", "os"],
    },
  },

  // Provide browser-compatible stubs for Node globals used at import time
  define: {
    // shared/env-checks.ts reads process.platform — provide a sensible default
    "process.env": "{}",
    "process.platform": JSON.stringify("browser"),
    "process.version": JSON.stringify("v0.0.0"),
  },
}));
