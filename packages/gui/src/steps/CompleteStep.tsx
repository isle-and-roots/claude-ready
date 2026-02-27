import { useState } from "react";
import { createProject } from "../lib/bridge";
import type { CreateProjectOptions } from "../lib/bridge";
import type { StepProps } from "./types";

interface CompleteStepProps extends StepProps {
  projectOptions: CreateProjectOptions;
}

type RunState = "idle" | "running" | "done" | "error";

export function CompleteStep({ onBack, projectOptions }: CompleteStepProps) {
  const [runState, setRunState] = useState<RunState>("idle");
  const [result, setResult] = useState<Awaited<ReturnType<typeof createProject>> | null>(null);

  async function handleApply() {
    setRunState("running");
    const res = await createProject(projectOptions);
    setResult(res);
    setRunState(res.success ? "done" : "error");
  }

  return (
    <div className="step">
      <div className="step-header">
        <span className="step-icon">🎉</span>
        <h1 className="step-title">
          {runState === "done" ? "You're Ready!" : "Review & Apply"}
        </h1>
        <p className="step-subtitle">
          {runState === "done"
            ? "Your project is configured and ready for Claude Code."
            : "Here's a summary of what will be applied to your project."}
        </p>
      </div>

      <div className="step-body">
        {runState === "idle" && (
          <ul className="summary-list">
            <li>
              <span className="summary-label">Project</span>
              <span className="summary-value">
                {projectOptions.projectName} ({projectOptions.projectType})
              </span>
            </li>
            <li>
              <span className="summary-label">Directory</span>
              <code className="summary-value">{projectOptions.projectDir}</code>
            </li>
            <li>
              <span className="summary-label">Security</span>
              <span className="summary-value">
                {projectOptions.securityLevel}
              </span>
            </li>
            <li>
              <span className="summary-label">Hooks</span>
              <span className="summary-value">
                {projectOptions.hooksEnabled
                  ? projectOptions.hookPresets.join(", ") || "none selected"
                  : "disabled"}
              </span>
            </li>
            <li>
              <span className="summary-label">MCP Servers</span>
              <span className="summary-value">
                {projectOptions.mcpPresets.length > 0
                  ? projectOptions.mcpPresets.join(", ")
                  : "none"}
              </span>
            </li>
          </ul>
        )}

        {runState === "running" && (
          <div className="install-progress">
            <span className="spinner" />
            <p>Applying configuration…</p>
          </div>
        )}

        {runState === "done" && result && (
          <>
            <div className="alert alert-success">
              All configuration files written successfully!
            </div>
            <div className="next-steps">
              <h3>Next steps</h3>
              <ol>
                <li>
                  Open your terminal and <code>cd {projectOptions.projectDir}</code>
                </li>
                <li>
                  Run <code>claude</code> to start Claude Code
                </li>
                <li>
                  Ask Claude to help you build your project!
                </li>
              </ol>
            </div>
          </>
        )}

        {runState === "error" && result && (
          <div className="alert alert-error">
            <p>Some steps failed:</p>
            <ul>
              {result.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
            <p>Check the directory permissions and try again.</p>
          </div>
        )}
      </div>

      <div className="step-footer">
        {runState === "idle" && (
          <>
            <button className="btn btn-secondary" onClick={onBack}>
              Back
            </button>
            <button className="btn btn-primary" onClick={handleApply}>
              Apply Configuration
            </button>
          </>
        )}
        {runState === "error" && (
          <>
            <button className="btn btn-secondary" onClick={onBack}>
              Back
            </button>
            <button className="btn btn-primary" onClick={handleApply}>
              Retry
            </button>
          </>
        )}
        {runState === "done" && (
          <button
            className="btn btn-primary"
            onClick={() => window.close?.()}
          >
            Close App
          </button>
        )}
      </div>
    </div>
  );
}
