import { useState } from "react";
import { saveApiKey } from "../lib/bridge";
import type { StepProps } from "./types";

export type AuthMethod = "api-key" | "claude-app" | "bedrock" | "vertex";

const METHODS: {
  id: AuthMethod;
  label: string;
  description: string;
  badge?: string;
}[] = [
  {
    id: "api-key",
    label: "API Key",
    description:
      "Use your Anthropic API key. Best for individual developers.",
    badge: "Most common",
  },
  {
    id: "claude-app",
    label: "Claude.ai Subscription",
    description:
      "Use your Claude Pro/Max subscription — no API key needed.",
  },
  {
    id: "bedrock",
    label: "AWS Bedrock",
    description: "Enterprise: run Claude via Amazon Bedrock.",
    badge: "Enterprise",
  },
  {
    id: "vertex",
    label: "Google Vertex AI",
    description: "Enterprise: run Claude via Google Cloud Vertex AI.",
    badge: "Enterprise",
  },
];

interface AuthStepProps extends StepProps {
  authMethod: AuthMethod | null;
  onAuthMethodChange: (method: AuthMethod) => void;
}

export function AuthStep({
  onNext,
  onBack,
  authMethod,
  onAuthMethodChange,
}: AuthStepProps) {
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSaveKey() {
    if (!apiKey.trim()) return;
    setSaving(true);
    setError("");
    const result = await saveApiKey(apiKey.trim());
    setSaving(false);
    if (result.success) {
      setSaved(true);
    } else {
      setError(result.error ?? "Failed to save API key");
    }
  }

  const canProceed =
    authMethod !== null &&
    (authMethod !== "api-key" || saved || apiKey.length === 0);

  return (
    <div className="step">
      <div className="step-header">
        <span className="step-icon">🔑</span>
        <h1 className="step-title">Authentication</h1>
        <p className="step-subtitle">
          Choose how you'll authenticate with Claude.
        </p>
      </div>

      <div className="step-body">
        <div className="option-list">
          {METHODS.map((m) => (
            <button
              key={m.id}
              className={[
                "option-card",
                authMethod === m.id ? "selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onAuthMethodChange(m.id)}
            >
              <div className="option-card-header">
                <span className="option-label">{m.label}</span>
                {m.badge && <span className="badge">{m.badge}</span>}
              </div>
              <span className="option-desc">{m.description}</span>
            </button>
          ))}
        </div>

        {authMethod === "api-key" && (
          <div className="api-key-section">
            <label className="field-label" htmlFor="api-key-input">
              Enter your Anthropic API key
            </label>
            <div className="input-row">
              <input
                id="api-key-input"
                type="password"
                className="text-input"
                placeholder="sk-ant-..."
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setSaved(false);
                }}
              />
              <button
                className="btn btn-secondary"
                onClick={handleSaveKey}
                disabled={saving || !apiKey.trim()}
              >
                {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
              </button>
            </div>
            {error && <p className="field-error">{error}</p>}
            <p className="field-hint">
              Key is saved to your shell profile (~/.zshrc or ~/.bashrc) as
              ANTHROPIC_API_KEY.
            </p>
          </div>
        )}

        {authMethod === "claude-app" && (
          <div className="alert alert-info">
            Run <code>claude</code> in your terminal and follow the login
            prompts to connect your Claude.ai account.
          </div>
        )}

        {(authMethod === "bedrock" || authMethod === "vertex") && (
          <div className="alert alert-info">
            Configure your cloud credentials as described in the{" "}
            <strong>Claude Code documentation</strong> before continuing.
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
          Continue
        </button>
      </div>
    </div>
  );
}
