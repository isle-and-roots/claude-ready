import type { ProjectType } from "@claude-ready/shared";
import type { StepProps } from "./types";

const PROJECT_TYPES: {
  id: ProjectType;
  label: string;
  description: string;
  emoji: string;
}[] = [
  {
    id: "webapp",
    label: "Web App",
    description: "React, Next.js, or any modern web framework.",
    emoji: "🌐",
  },
  {
    id: "website",
    label: "Website",
    description: "Static HTML/CSS/JS — simple and lightweight.",
    emoji: "📄",
  },
  {
    id: "cli-tool",
    label: "CLI Tool",
    description: "Node.js command-line application.",
    emoji: "⌨️",
  },
  {
    id: "general",
    label: "General",
    description: "Any other kind of project.",
    emoji: "📁",
  },
];

interface ProjectStepProps extends StepProps {
  projectType: ProjectType | null;
  projectName: string;
  projectDir: string;
  onProjectTypeChange: (type: ProjectType) => void;
  onProjectNameChange: (name: string) => void;
  onProjectDirChange: (dir: string) => void;
}

export function ProjectStep({
  onNext,
  onBack,
  projectType,
  projectName,
  projectDir,
  onProjectTypeChange,
  onProjectNameChange,
  onProjectDirChange,
}: ProjectStepProps) {
  const canProceed =
    projectType !== null && projectName.trim().length > 0 && projectDir.trim().length > 0;

  return (
    <div className="step">
      <div className="step-header">
        <span className="step-icon">📁</span>
        <h1 className="step-title">Project Setup</h1>
        <p className="step-subtitle">
          Tell us about the project you're setting up Claude Code for.
        </p>
      </div>

      <div className="step-body">
        <div className="field">
          <label className="field-label" htmlFor="project-name">
            Project name
          </label>
          <input
            id="project-name"
            type="text"
            className="text-input"
            placeholder="my-awesome-app"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="project-dir">
            Project directory (absolute path)
          </label>
          <input
            id="project-dir"
            type="text"
            className="text-input"
            placeholder="/Users/you/projects/my-awesome-app"
            value={projectDir}
            onChange={(e) => onProjectDirChange(e.target.value)}
          />
          <p className="field-hint">
            This is where <code>CLAUDE.md</code>, <code>.mcp.json</code>, and{" "}
            <code>.claude/settings.json</code> will be created.
          </p>
        </div>

        <p className="field-label">Project type</p>
        <div className="option-grid">
          {PROJECT_TYPES.map((t) => (
            <button
              key={t.id}
              className={["option-card grid-card", projectType === t.id ? "selected" : ""]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onProjectTypeChange(t.id)}
            >
              <span className="grid-emoji">{t.emoji}</span>
              <span className="option-label">{t.label}</span>
              <span className="option-desc">{t.description}</span>
            </button>
          ))}
        </div>
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
