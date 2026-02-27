import { useEffect, useState } from "react";
import { installClaudeCode } from "../lib/bridge";
import type { StepProps } from "./types";

type InstallState = "idle" | "installing" | "success" | "already" | "error";

interface InstallStepProps extends StepProps {
  claudeAlreadyInstalled: boolean;
}

export function InstallStep({
  onNext,
  onBack,
  claudeAlreadyInstalled,
}: InstallStepProps) {
  const [state, setState] = useState<InstallState>(
    claudeAlreadyInstalled ? "already" : "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (claudeAlreadyInstalled) {
      setState("already");
    }
  }, [claudeAlreadyInstalled]);

  async function handleInstall() {
    setState("installing");
    const result = await installClaudeCode();
    if (result.alreadyInstalled) {
      setState("already");
    } else if (result.success) {
      setState("success");
    } else {
      setState("error");
      setErrorMsg(result.error ?? "Unknown error");
    }
  }

  const isDone = state === "success" || state === "already";

  return (
    <div className="step">
      <div className="step-header">
        <span className="step-icon">📦</span>
        <h1 className="step-title">Install Claude Code</h1>
        <p className="step-subtitle">
          Claude Code is the official CLI that brings AI to your terminal.
        </p>
      </div>

      <div className="step-body">
        {state === "idle" && (
          <div className="install-prompt">
            <p>
              Claude Code is not detected on your system. Click below to install
              it via npm.
            </p>
            <code className="code-block">
              npm install -g @anthropic-ai/claude-code
            </code>
          </div>
        )}

        {state === "installing" && (
          <div className="install-progress">
            <span className="spinner" />
            <p>Installing Claude Code… this may take a moment.</p>
          </div>
        )}

        {state === "already" && (
          <div className="alert alert-success">
            Claude Code is already installed on your system.
          </div>
        )}

        {state === "success" && (
          <div className="alert alert-success">
            Claude Code installed successfully!
          </div>
        )}

        {state === "error" && (
          <div className="alert alert-error">
            <p>Installation failed: {errorMsg}</p>
            <p>
              Try running manually:{" "}
              <code>npm install -g @anthropic-ai/claude-code</code>
            </p>
          </div>
        )}
      </div>

      <div className="step-footer">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        {!isDone && state !== "installing" && (
          <button className="btn btn-primary" onClick={handleInstall}>
            Install
          </button>
        )}
        {isDone && (
          <button className="btn btn-primary" onClick={onNext}>
            Continue
          </button>
        )}
        {state === "error" && (
          <button className="btn btn-primary" onClick={onNext}>
            Skip (I'll install manually)
          </button>
        )}
      </div>
    </div>
  );
}
