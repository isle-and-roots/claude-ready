import type { StepProps } from "./types";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

const LEVELS: { id: ExperienceLevel; label: string; description: string }[] = [
  {
    id: "beginner",
    label: "Beginner",
    description: "New to AI coding assistants — guide me step by step.",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "I've used AI tools before but want a quick setup.",
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "I know what I'm doing — minimal prompts.",
  },
];

interface WelcomeStepProps extends StepProps {
  experienceLevel: ExperienceLevel | null;
  onLevelChange: (level: ExperienceLevel) => void;
}

export function WelcomeStep({
  onNext,
  experienceLevel,
  onLevelChange,
}: WelcomeStepProps) {
  return (
    <div className="step">
      <div className="step-header">
        <span className="step-icon">⚡</span>
        <h1 className="step-title">Welcome to Claude Ready</h1>
        <p className="step-subtitle">
          One command. Everything you need to start building with Claude Code.
          Let's get you set up in a few minutes.
        </p>
      </div>

      <div className="step-body">
        <p className="field-label">What's your experience level?</p>
        <div className="option-list">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              className={[
                "option-card",
                experienceLevel === lvl.id ? "selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onLevelChange(lvl.id)}
            >
              <span className="option-label">{lvl.label}</span>
              <span className="option-desc">{lvl.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="step-footer">
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!experienceLevel}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
