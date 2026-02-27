import { useEffect, useState } from "react";
import { checkEnvironment } from "../lib/bridge";
import type { EnvCheckResult } from "../lib/bridge";
import type { StepProps } from "./types";

interface Check {
  label: string;
  status: "ok" | "fail" | "warn" | "loading";
  detail?: string;
}

function StatusIcon({ status }: { status: Check["status"] }) {
  if (status === "loading") return <span className="status-icon spin">⟳</span>;
  if (status === "ok") return <span className="status-icon ok">✓</span>;
  if (status === "warn") return <span className="status-icon warn">⚠</span>;
  return <span className="status-icon fail">✗</span>;
}

function toChecks(env: EnvCheckResult): Check[] {
  const platform = env.isMacOS
    ? "macOS"
    : env.isWindows
      ? "Windows"
      : env.isLinux
        ? "Linux"
        : "Unknown";
  return [
    {
      label: "Platform",
      status: "ok",
      detail: platform,
    },
    {
      label: "Node.js ≥ 18",
      status: env.isNodeVersionSupported ? "ok" : "fail",
      detail: env.nodeVersion,
    },
    {
      label: "Claude Code",
      status: env.isClaudeCodeInstalled ? "ok" : "warn",
      detail: env.isClaudeCodeInstalled
        ? "Installed"
        : "Not found — we'll install it next",
    },
    {
      label: "System locale",
      status: "ok",
      detail: env.systemLocale,
    },
  ];
}

interface EnvCheckStepProps extends StepProps {
  onEnvResult: (result: EnvCheckResult) => void;
}

export function EnvCheckStep({ onNext, onBack, onEnvResult }: EnvCheckStepProps) {
  const [checks, setChecks] = useState<Check[]>([
    { label: "Platform", status: "loading" },
    { label: "Node.js ≥ 18", status: "loading" },
    { label: "Claude Code", status: "loading" },
    { label: "System locale", status: "loading" },
  ]);
  const [done, setDone] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    checkEnvironment().then((result) => {
      onEnvResult(result);
      setChecks(toChecks(result));
      setDone(true);
      // Allow proceeding even if Claude Code is missing — install step handles it
      setCanProceed(result.isNodeVersionSupported);
    });
  }, [onEnvResult]);

  return (
    <div className="step">
      <div className="step-header">
        <span className="step-icon">🔍</span>
        <h1 className="step-title">Environment Check</h1>
        <p className="step-subtitle">
          Making sure your system is ready for Claude Code.
        </p>
      </div>

      <div className="step-body">
        <ul className="check-list">
          {checks.map((c) => (
            <li key={c.label} className="check-item">
              <StatusIcon status={c.status} />
              <span className="check-label">{c.label}</span>
              {c.detail && <span className="check-detail">{c.detail}</span>}
            </li>
          ))}
        </ul>

        {done && !canProceed && (
          <div className="alert alert-error">
            Node.js 18 or later is required. Please install it from{" "}
            <strong>nodejs.org</strong> and re-run this app.
          </div>
        )}
      </div>

      <div className="step-footer">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!canProceed}
        >
          {canProceed ? "Continue" : "Fix issues first"}
        </button>
      </div>
    </div>
  );
}
