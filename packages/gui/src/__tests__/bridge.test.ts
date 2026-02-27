import { describe, it, expect } from "vitest";
import { checkEnvironment } from "../lib/bridge";

describe("bridge - checkEnvironment (browser fallback)", () => {
  it("returns an EnvironmentStatus-shaped object with browser fallback", async () => {
    // In jsdom, Tauri is unavailable so the browser fallback path is used
    const result = await checkEnvironment();
    expect(typeof result.isMacOS).toBe("boolean");
    expect(typeof result.isWindows).toBe("boolean");
    expect(typeof result.isLinux).toBe("boolean");
    expect(typeof result.isNodeVersionSupported).toBe("boolean");
    expect(typeof result.isClaudeCodeInstalled).toBe("boolean");
    expect(typeof result.nodeVersion).toBe("string");
    expect(typeof result.systemLocale).toBe("string");
    expect(typeof result.ok).toBe("boolean");
  });

  it("sets isClaudeCodeInstalled to false in browser context", async () => {
    const result = await checkEnvironment();
    // Can't shell out from a browser, always false
    expect(result.isClaudeCodeInstalled).toBe(false);
  });
});
