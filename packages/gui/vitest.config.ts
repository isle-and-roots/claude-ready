import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
    // Use the compiled shared dist so Node.js builtins work naturally in vitest
    // (vitest runs in Node, not the browser, so child_process/fs/path are fine)
  },
});
