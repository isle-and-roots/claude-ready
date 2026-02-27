import { Component, useCallback, useState } from "react";
import type { ReactNode } from "react";
import type { EnvCheckResult } from "./lib/bridge";
import type { ExperienceLevel } from "./steps/WelcomeStep";
import type { AuthMethod } from "./steps/AuthStep";
import type { SecurityLevel } from "./steps/SecurityStep";
import type { HookPresetId, McpPresetId, ProjectType } from "@claude-ready/shared";
import { WelcomeStep } from "./steps/WelcomeStep";
import { EnvCheckStep } from "./steps/EnvCheckStep";
import { InstallStep } from "./steps/InstallStep";
import { AuthStep } from "./steps/AuthStep";
import { HooksStep } from "./steps/HooksStep";
import { SecurityStep } from "./steps/SecurityStep";
import { ProjectStep } from "./steps/ProjectStep";
import { CompleteStep } from "./steps/CompleteStep";

// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------

const STEP_LABELS = [
  "Welcome",
  "Environment",
  "Install",
  "Auth",
  "Hooks",
  "Security",
  "Project",
  "Complete",
] as const;

type StepIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
const TOTAL_STEPS = STEP_LABELS.length;

// ---------------------------------------------------------------------------
// Error boundary
// ---------------------------------------------------------------------------

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-main">
          <div className="alert alert-error">
            <strong>Something went wrong</strong>
            <p>{this.state.error?.message}</p>
            <button
              className="btn btn-secondary"
              style={{ marginTop: 12 }}
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Main App state
// ---------------------------------------------------------------------------

interface AppState {
  step: StepIndex;
  // WelcomeStep
  experienceLevel: ExperienceLevel | null;
  // EnvCheckStep
  envResult: EnvCheckResult | null;
  // AuthStep
  authMethod: AuthMethod | null;
  // HooksStep
  hooksEnabled: boolean;
  hookPresets: HookPresetId[];
  // SecurityStep
  securityLevel: SecurityLevel | null;
  // ProjectStep
  projectType: ProjectType | null;
  projectName: string;
  projectDir: string;
  // McpStep (embedded in CompleteStep for now — placeholder for Task 5.4.3)
  mcpPresets: McpPresetId[];
}

// ---------------------------------------------------------------------------
// App component
// ---------------------------------------------------------------------------

function App() {
  const [state, setState] = useState<AppState>({
    step: 0,
    experienceLevel: null,
    envResult: null,
    authMethod: null,
    hooksEnabled: false,
    hookPresets: [],
    securityLevel: null,
    projectType: null,
    projectName: "",
    projectDir: "",
    mcpPresets: [],
  });

  function next() {
    setState((prev) => ({
      ...prev,
      step: Math.min(prev.step + 1, TOTAL_STEPS - 1) as StepIndex,
    }));
  }

  function back() {
    setState((prev) => ({
      ...prev,
      step: Math.max(prev.step - 1, 0) as StepIndex,
    }));
  }

  function update<K extends keyof AppState>(key: K, value: AppState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  // Stable callback reference so EnvCheckStep's useEffect doesn't re-fire on every render
  const handleEnvResult = useCallback(
    (result: EnvCheckResult) => update("envResult", result),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const progress = (state.step / (TOTAL_STEPS - 1)) * 100;

  // Build project options for CompleteStep
  const projectOptions = {
    projectDir: state.projectDir,
    projectName: state.projectName,
    projectType: state.projectType ?? "general",
    securityLevel: state.securityLevel ?? "standard",
    hooksEnabled: state.hooksEnabled,
    hookPresets: state.hookPresets,
    mcpPresets: state.mcpPresets,
    locale: state.envResult?.systemLocale ?? "en",
  };

  function renderStep() {
    switch (state.step) {
      case 0:
        return (
          <WelcomeStep
            onNext={next}
            experienceLevel={state.experienceLevel}
            onLevelChange={(level) => update("experienceLevel", level)}
          />
        );
      case 1:
        return (
          <EnvCheckStep
            onNext={next}
            onBack={back}
            onEnvResult={handleEnvResult}
          />
        );
      case 2:
        return (
          <InstallStep
            onNext={next}
            onBack={back}
            claudeAlreadyInstalled={
              state.envResult?.isClaudeCodeInstalled ?? false
            }
          />
        );
      case 3:
        return (
          <AuthStep
            onNext={next}
            onBack={back}
            authMethod={state.authMethod}
            onAuthMethodChange={(method) => update("authMethod", method)}
          />
        );
      case 4:
        return (
          <HooksStep
            onNext={next}
            onBack={back}
            enabled={state.hooksEnabled}
            onEnabledChange={(enabled) => update("hooksEnabled", enabled)}
            selectedPresets={state.hookPresets}
            onPresetsChange={(presets) => update("hookPresets", presets)}
          />
        );
      case 5:
        return (
          <SecurityStep
            onNext={next}
            onBack={back}
            level={state.securityLevel}
            onLevelChange={(level) => update("securityLevel", level)}
          />
        );
      case 6:
        return (
          <ProjectStep
            onNext={next}
            onBack={back}
            projectType={state.projectType}
            projectName={state.projectName}
            projectDir={state.projectDir}
            onProjectTypeChange={(type) => update("projectType", type)}
            onProjectNameChange={(name) => update("projectName", name)}
            onProjectDirChange={(dir) => update("projectDir", dir)}
          />
        );
      case 7:
        return (
          <CompleteStep
            onNext={next}
            onBack={back}
            projectOptions={projectOptions}
          />
        );
    }
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="app-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Claude Ready</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="step-counter">
          {state.step + 1} / {TOTAL_STEPS}
        </span>
      </header>

      {/* Main content */}
      <main className="app-main">
        <ErrorBoundary>{renderStep()}</ErrorBoundary>
      </main>

      {/* Step nav */}
      <nav className="step-nav" aria-label="Setup progress">
        {STEP_LABELS.map((label, index) => (
          <button
            key={label}
            className={[
              "step-dot",
              state.step === index ? "active" : "",
              state.step > index ? "completed" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() =>
              setState((prev) => ({ ...prev, step: index as StepIndex }))
            }
            title={label}
            aria-label={`Step ${index + 1}: ${label}`}
            aria-current={state.step === index ? "step" : undefined}
          >
            {index + 1}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
