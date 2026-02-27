import { useState } from "react";
import { DENY_RULES } from "@claude-ready/shared";
import type { StepProps } from "./types";

export type SecurityLevel = "standard" | "strict";

const LEVELS: {
  id: SecurityLevel;
  label: string;
  description: string;
  rulesCount: number;
}[] = [
  {
    id: "standard",
    label: "Standard",
    description:
      "Recommended for most projects. Blocks the most dangerous operations.",
    rulesCount: DENY_RULES.length,
  },
  {
    id: "strict",
    label: "Strict",
    description:
      "Adds additional restrictions — no sudo, no curl-to-bash, etc. Good for sensitive environments.",
    rulesCount: DENY_RULES.length,
  },
];

interface SecurityStepProps extends StepProps {
  level: SecurityLevel | null;
  onLevelChange: (level: SecurityLevel) => void;
}

export function SecurityStep({
  onNext,
  onBack,
  level,
  onLevelChange,
}: SecurityStepProps) {
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="step">
      <div className="step-header">
        <span className="step-icon">🛡️</span>
        <h1 className="step-title">Security Settings</h1>
        <p className="step-subtitle">
          Claude Code's permission system lets you define what operations are
          allowed. These rules are written to{" "}
          <code>.claude/settings.json</code>.
        </p>
      </div>

      <div className="step-body">
        <div className="option-list">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              className={["option-card", level === l.id ? "selected" : ""]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onLevelChange(l.id)}
            >
              <span className="option-label">{l.label}</span>
              <span className="option-desc">{l.description}</span>
              <span className="option-meta">{l.rulesCount} deny rules</span>
            </button>
          ))}
        </div>

        <button
          className="link-btn"
          onClick={() => setShowRules((v) => !v)}
        >
          {showRules ? "Hide" : "Show"} deny rules
        </button>

        {showRules && (
          <ul className="rules-list">
            {DENY_RULES.map((rule) => (
              <li key={rule}>
                <code>{rule}</code>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="step-footer">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!level}
        >
          Apply Security Settings
        </button>
      </div>
    </div>
  );
}
