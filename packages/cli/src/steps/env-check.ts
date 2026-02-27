import * as p from "@clack/prompts";
import {
  checkEnvironment,
  type EnvironmentStatus,
  type I18nMessages,
} from "@claude-ready/shared";
import { success } from "../ui/theme.js";
import type { ExperienceLevel } from "./welcome.js";
import { FatalError } from "../errors.js";

export async function envCheckStep(
  msgs: I18nMessages,
  level?: ExperienceLevel
): Promise<EnvironmentStatus> {
  const s = p.spinner();
  s.start(msgs.envCheck.checking);

  const env = checkEnvironment();

  s.stop(msgs.envCheck.checking);

  if (!env.isNodeVersionSupported) {
    throw new FatalError(msgs.status.nodeRequired);
  }

  if (level === "advanced") {
    const claudePart = env.isClaudeCodeInstalled ? msgs.envCheck.claudeCodeInstalled : "";
    const osPart = env.isMacOS ? "macOS" : "Linux";
    p.log.success(
      msgs.envCheck.expressSummary
        .replace("{os}", osPart)
        .replace("{version}", env.nodeVersion)
        .replace("{claude}", claudePart)
    );
    return env;
  }

  if (env.isMacOS) {
    p.log.success(success("✓") + " " + msgs.envCheck.macOS);
  } else {
    p.log.warn("⚠ " + msgs.status.notMacOS);
  }

  p.log.success(
    success("✓") +
      " " +
      msgs.envCheck.nodeVersion.replace("{version}", env.nodeVersion)
  );

  if (level === "beginner") {
    p.note(msgs.envCheck.beginnerNodeNote, "What is Node.js?");
  }

  if (env.isClaudeCodeInstalled) {
    p.log.success(success("✓") + " " + msgs.envCheck.claudeCode);
  }

  return env;
}
