import { useState } from "react";
import type { HookPresetId } from "@claude-ready/shared";
import type { StepProps } from "./types";

const PRESETS: {
  id: HookPresetId;
  label: string;
  description: string;
  requiresTools?: string[];
}[] = [
  {
    id: "auto-format",
    label: "Auto Format",
    description: "Run Prettier on every file edit (requires prettier).",
    requiresTools: ["prettier"],
  },
  {
    id: "safe-commit",
    label: "Safe Commit",
    description: "Auto-checkpoint via git commit after edits.",
  },
  {
    id: "dangerous-cmd-block",
    label: "Dangerous Command Block",
    description:
      "Prevent destructive shell commands (rm -rf /, fork bombs, etc.).",
  },
  {
    id: "cost-tracker",
    label: "Cost Tracker",
    description: "Log tool usage to usage.log for cost monitoring.",
  },
  {
    id: "notification",
    label: "Desktop Notifications",
    description: "Get notified when Claude Code completes a task.",
  },
];

interface HooksStepProps extends StepProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  selectedPresets: HookPresetId[];
  onPresetsChange: (presets: HookPresetId[]) => void;
}

export function HooksStep({
  onNext,
  onBack,
  enabled,
  onEnabledChange,
  selectedPresets,
  onPresetsChange,
}: HooksStepProps) {
  const [localEnabled, setLocalEnabled] = useState(enabled);

  function toggleEnabled(val: boolean) {
    setLocalEnabled(val);
    onEnabledChange(val);
    if (!val) onPresetsChange([]);
  }

  function togglePreset(id: HookPresetId) {
    if (selectedPresets.includes(id)) {
      onPresetsChange(selectedPresets.filter((p) => p !== id));
    } else {
      onPresetsChange([...selectedPresets, id]);
    }
  }

  return (
    <div className="step">
      <div className="step-header">
        <span className="step-icon">🪝</span>
        <h1 className="step-title">Claude Hooks</h1>
        <p className="step-subtitle">
          Hooks run shell commands automatically when Claude uses a tool —
          great for formatting, safety checks, and notifications.
        </p>
      </div>

      <div className="step-body">
        <div className="toggle-row">
          <label className="toggle-label">
            <input
              type="checkbox"
              className="toggle-input"
              checked={localEnabled}
              onChange={(e) => toggleEnabled(e.target.checked)}
            />
            <span className="toggle-text">Enable hooks</span>
          </label>
        </div>

        {localEnabled && (
          <div className="option-list">
            {PRESETS.map((p) => {
              const selected = selectedPresets.includes(p.id);
              return (
                <button
                  key={p.id}
                  className={["option-card checkbox-card", selected ? "selected" : ""]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => togglePreset(p.id)}
                >
                  <div className="option-card-header">
                    <input
                      type="checkbox"
                      checked={selected}
                      readOnly
                      className="checkbox-input"
                    />
                    <span className="option-label">{p.label}</span>
                    {p.requiresTools && (
                      <span className="badge">
                        requires: {p.requiresTools.join(", ")}
                      </span>
                    )}
                  </div>
                  <span className="option-desc">{p.description}</span>
                </button>
              );
            })}
          </div>
        )}

        {!localEnabled && (
          <p className="step-note">
            You can always configure hooks later by editing{" "}
            <code>~/.claude/settings.json</code>.
          </p>
        )}
      </div>

      <div className="step-footer">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          Continue
        </button>
      </div>
    </div>
  );
}
