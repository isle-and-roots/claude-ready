import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

// Mock the Tauri bridge so async effects resolve immediately in tests
vi.mock("../lib/bridge", () => ({
  checkEnvironment: vi.fn().mockResolvedValue({
    isMacOS: true,
    isWindows: false,
    isLinux: false,
    nodeVersion: "v20.0.0",
    isNodeVersionSupported: true,
    isClaudeCodeInstalled: true,
    systemLocale: "en-US",
    ok: true,
  }),
  installClaudeCode: vi.fn().mockResolvedValue({ success: true, alreadyInstalled: true }),
  saveApiKey: vi.fn().mockResolvedValue({ success: true }),
  applySettings: vi.fn().mockResolvedValue({ success: true, settingsPath: "" }),
  applyHooks: vi.fn().mockResolvedValue({ success: true, hooksConfig: {} }),
  applyTemplate: vi.fn().mockResolvedValue({ success: true, claudeMdPath: "" }),
  applyMcpConfig: vi.fn().mockResolvedValue({ success: true, mcpConfig: { mcpServers: {} }, mcpJsonPath: "" }),
  createProject: vi.fn().mockResolvedValue({ success: true, steps: { security: true, hooks: true, template: true, mcp: true }, errors: [] }),
}));

describe("App", () => {
  it("renders the Welcome step on initial load", () => {
    render(<App />);
    expect(screen.getByText(/Welcome to Claude Ready/i)).toBeDefined();
  });

  it("shows step counter 1 / 8 on first step", () => {
    render(<App />);
    expect(screen.getByText(/1 \/ 8/i)).toBeDefined();
  });

  it("Get Started button is disabled until experience level is chosen", () => {
    render(<App />);
    const btn = screen.getByRole("button", { name: /get started/i });
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  it("selecting experience level enables the Get Started button", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText("Beginner"));
    const btn = screen.getByRole("button", { name: /get started/i });
    expect((btn as HTMLButtonElement).disabled).toBe(false);
  });

  it("clicking Get Started advances to step 2 (Environment Check)", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText("Beginner"));
    await user.click(screen.getByRole("button", { name: /get started/i }));
    await waitFor(() => {
      expect(screen.getByText(/Environment Check/i)).toBeDefined();
    });
  });

  it("step nav has 8 buttons", () => {
    render(<App />);
    const nav = screen.getByRole("navigation", { name: /setup progress/i });
    const dots = nav.querySelectorAll(".step-dot");
    expect(dots.length).toBe(8);
  });
});
