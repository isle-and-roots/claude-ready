/**
 * GUI component integration tests
 *
 * These tests verify that React components render correctly and respond to
 * user interactions. The Tauri bridge is automatically mocked via vi.mock
 * since @tauri-apps/api is not available in the jsdom environment.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mock Tauri bridge so components work without a Rust binary
// ---------------------------------------------------------------------------
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
  installClaudeCode: vi.fn().mockResolvedValue({
    success: true,
    alreadyInstalled: false,
  }),
  saveApiKey: vi.fn().mockResolvedValue({ success: true }),
  applySettings: vi.fn().mockResolvedValue({
    success: true,
    settingsPath: "/tmp/.claude/settings.json",
  }),
  applyHooks: vi.fn().mockResolvedValue({
    success: true,
    hooksConfig: {},
  }),
  applyTemplate: vi.fn().mockResolvedValue({
    success: true,
    claudeMdPath: "/tmp/CLAUDE.md",
  }),
  applyMcpConfig: vi.fn().mockResolvedValue({
    success: true,
    mcpConfig: { mcpServers: {} },
    mcpJsonPath: "/tmp/.mcp.json",
  }),
  createProject: vi.fn().mockResolvedValue({
    success: true,
    steps: { security: true, hooks: true, template: true, mcp: true },
    errors: [],
  }),
}));

// ---------------------------------------------------------------------------
// WelcomeStep
// ---------------------------------------------------------------------------
import { WelcomeStep } from "../steps/WelcomeStep";

describe("WelcomeStep", () => {
  it("renders the step title", () => {
    render(
      <WelcomeStep
        onNext={vi.fn()}
        experienceLevel={null}
        onLevelChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Welcome to Claude Ready")).toBeTruthy();
  });

  it("renders all three experience levels", () => {
    render(
      <WelcomeStep
        onNext={vi.fn()}
        experienceLevel={null}
        onLevelChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Beginner")).toBeTruthy();
    expect(screen.getByText("Intermediate")).toBeTruthy();
    expect(screen.getByText("Advanced")).toBeTruthy();
  });

  it("Get Started button is disabled until a level is selected", () => {
    render(
      <WelcomeStep
        onNext={vi.fn()}
        experienceLevel={null}
        onLevelChange={vi.fn()}
      />,
    );
    const btn = screen.getByText("Get Started") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it("Get Started button is enabled after selecting a level", () => {
    render(
      <WelcomeStep
        onNext={vi.fn()}
        experienceLevel="beginner"
        onLevelChange={vi.fn()}
      />,
    );
    const btn = screen.getByText("Get Started") as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });

  it("calls onLevelChange when a level is clicked", () => {
    const onLevelChange = vi.fn();
    render(
      <WelcomeStep
        onNext={vi.fn()}
        experienceLevel={null}
        onLevelChange={onLevelChange}
      />,
    );
    fireEvent.click(screen.getByText("Advanced"));
    expect(onLevelChange).toHaveBeenCalledWith("advanced");
  });

  it("calls onNext when Get Started is clicked with level selected", () => {
    const onNext = vi.fn();
    render(
      <WelcomeStep
        onNext={onNext}
        experienceLevel="intermediate"
        onLevelChange={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText("Get Started"));
    expect(onNext).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// InstallStep
// ---------------------------------------------------------------------------
import { InstallStep } from "../steps/InstallStep";

describe("InstallStep", () => {
  it("renders the step title", () => {
    render(
      <InstallStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        claudeAlreadyInstalled={false}
      />,
    );
    expect(screen.getByText("Install Claude Code")).toBeTruthy();
  });

  it("shows 'already installed' message when Claude Code is installed", () => {
    render(
      <InstallStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        claudeAlreadyInstalled={true}
      />,
    );
    expect(
      screen.getByText("Claude Code is already installed on your system."),
    ).toBeTruthy();
  });

  it("shows Install button when not yet installed", () => {
    render(
      <InstallStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        claudeAlreadyInstalled={false}
      />,
    );
    expect(screen.getByText("Install")).toBeTruthy();
  });

  it("shows Continue button when already installed", () => {
    render(
      <InstallStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        claudeAlreadyInstalled={true}
      />,
    );
    expect(screen.getByText("Continue")).toBeTruthy();
  });

  it("calls onBack when Back is clicked", () => {
    const onBack = vi.fn();
    render(
      <InstallStep
        onNext={vi.fn()}
        onBack={onBack}
        claudeAlreadyInstalled={false}
      />,
    );
    fireEvent.click(screen.getByText("Back"));
    expect(onBack).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// SecurityStep
// ---------------------------------------------------------------------------
import { SecurityStep } from "../steps/SecurityStep";

describe("SecurityStep", () => {
  it("renders the step title", () => {
    render(
      <SecurityStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        level={null}
        onLevelChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Security Settings")).toBeTruthy();
  });

  it("renders Standard and Strict level options", () => {
    render(
      <SecurityStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        level={null}
        onLevelChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Standard")).toBeTruthy();
    expect(screen.getByText("Strict")).toBeTruthy();
  });

  it("Apply button is disabled when no level selected", () => {
    render(
      <SecurityStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        level={null}
        onLevelChange={vi.fn()}
      />,
    );
    const btn = screen.getByText("Apply Security Settings") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it("Apply button is enabled when level is selected", () => {
    render(
      <SecurityStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        level="standard"
        onLevelChange={vi.fn()}
      />,
    );
    const btn = screen.getByText("Apply Security Settings") as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });

  it("calls onLevelChange when a level card is clicked", () => {
    const onLevelChange = vi.fn();
    render(
      <SecurityStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        level={null}
        onLevelChange={onLevelChange}
      />,
    );
    fireEvent.click(screen.getByText("Strict"));
    expect(onLevelChange).toHaveBeenCalledWith("strict");
  });

  it("toggles deny rules list on Show/Hide click", () => {
    render(
      <SecurityStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        level={null}
        onLevelChange={vi.fn()}
      />,
    );
    const toggle = screen.getByText("Show deny rules");
    fireEvent.click(toggle);
    expect(screen.getByText("Hide deny rules")).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// HooksStep
// ---------------------------------------------------------------------------
import { HooksStep } from "../steps/HooksStep";

describe("HooksStep", () => {
  it("renders the step title", () => {
    render(
      <HooksStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        enabled={false}
        onEnabledChange={vi.fn()}
        selectedPresets={[]}
        onPresetsChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Claude Hooks")).toBeTruthy();
  });

  it("shows note about hooks when disabled", () => {
    render(
      <HooksStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        enabled={false}
        onEnabledChange={vi.fn()}
        selectedPresets={[]}
        onPresetsChange={vi.fn()}
      />,
    );
    expect(screen.getByText(/configure hooks later/)).toBeTruthy();
  });

  it("shows preset list when enabled", () => {
    render(
      <HooksStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        enabled={true}
        onEnabledChange={vi.fn()}
        selectedPresets={[]}
        onPresetsChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Auto Format")).toBeTruthy();
    expect(screen.getByText("Safe Commit")).toBeTruthy();
    expect(screen.getByText("Dangerous Command Block")).toBeTruthy();
    expect(screen.getByText("Cost Tracker")).toBeTruthy();
    expect(screen.getByText("Desktop Notifications")).toBeTruthy();
  });

  it("calls onPresetsChange when a preset is toggled", () => {
    const onPresetsChange = vi.fn();
    render(
      <HooksStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        enabled={true}
        onEnabledChange={vi.fn()}
        selectedPresets={[]}
        onPresetsChange={onPresetsChange}
      />,
    );
    fireEvent.click(screen.getByText("Cost Tracker"));
    expect(onPresetsChange).toHaveBeenCalledWith(["cost-tracker"]);
  });
});

// ---------------------------------------------------------------------------
// ProjectStep
// ---------------------------------------------------------------------------
import { ProjectStep } from "../steps/ProjectStep";

describe("ProjectStep", () => {
  it("renders the step title", () => {
    render(
      <ProjectStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        projectType={null}
        projectName=""
        projectDir=""
        onProjectTypeChange={vi.fn()}
        onProjectNameChange={vi.fn()}
        onProjectDirChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Project Setup")).toBeTruthy();
  });

  it("renders all four project type options", () => {
    render(
      <ProjectStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        projectType={null}
        projectName=""
        projectDir=""
        onProjectTypeChange={vi.fn()}
        onProjectNameChange={vi.fn()}
        onProjectDirChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Web App")).toBeTruthy();
    expect(screen.getByText("Website")).toBeTruthy();
    expect(screen.getByText("CLI Tool")).toBeTruthy();
    expect(screen.getByText("General")).toBeTruthy();
  });

  it("Continue button is disabled when fields are empty", () => {
    render(
      <ProjectStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        projectType={null}
        projectName=""
        projectDir=""
        onProjectTypeChange={vi.fn()}
        onProjectNameChange={vi.fn()}
        onProjectDirChange={vi.fn()}
      />,
    );
    const btn = screen.getByText("Continue") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it("Continue button is enabled when all fields are filled", () => {
    render(
      <ProjectStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        projectType="webapp"
        projectName="my-app"
        projectDir="/tmp/my-app"
        onProjectTypeChange={vi.fn()}
        onProjectNameChange={vi.fn()}
        onProjectDirChange={vi.fn()}
      />,
    );
    const btn = screen.getByText("Continue") as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });

  it("calls onProjectNameChange when name input changes", () => {
    const onProjectNameChange = vi.fn();
    render(
      <ProjectStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        projectType={null}
        projectName=""
        projectDir=""
        onProjectTypeChange={vi.fn()}
        onProjectNameChange={onProjectNameChange}
        onProjectDirChange={vi.fn()}
      />,
    );
    const input = screen.getByPlaceholderText("my-awesome-app");
    fireEvent.change(input, { target: { value: "cool-project" } });
    expect(onProjectNameChange).toHaveBeenCalledWith("cool-project");
  });

  it("calls onProjectTypeChange when a project type is selected", () => {
    const onProjectTypeChange = vi.fn();
    render(
      <ProjectStep
        onNext={vi.fn()}
        onBack={vi.fn()}
        projectType={null}
        projectName=""
        projectDir=""
        onProjectTypeChange={onProjectTypeChange}
        onProjectNameChange={vi.fn()}
        onProjectDirChange={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText("CLI Tool"));
    expect(onProjectTypeChange).toHaveBeenCalledWith("cli-tool");
  });
});

// ---------------------------------------------------------------------------
// App — smoke test (step flow router)
// ---------------------------------------------------------------------------
import App from "../App";

describe("App", () => {
  it("renders without crashing", () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it("shows step 1 of 8 on initial render", () => {
    render(<App />);
    expect(screen.getByText("1 / 8")).toBeTruthy();
  });

  it("renders the Claude Ready logo text", () => {
    render(<App />);
    expect(screen.getByText("Claude Ready")).toBeTruthy();
  });
});
