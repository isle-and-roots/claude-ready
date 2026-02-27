import * as p from "@clack/prompts";
import { execSync } from "child_process";
import type { I18nMessages } from "@claude-ready/shared";
import { isWindows, isLinux } from "@claude-ready/shared";
import { success } from "../ui/theme.js";
import type { ExperienceLevel } from "./welcome.js";
import { FatalError } from "../errors.js";

function getInstallCommand(): string {
  if (isWindows()) {
    return "npm install -g @anthropic-ai/claude-code";
  }
  if (isLinux()) {
    return "npm install -g @anthropic-ai/claude-code";
  }
  return "npm install -g @anthropic-ai/claude-code";
}

export async function installStep(
  msgs: I18nMessages,
  alreadyInstalled: boolean,
  level?: ExperienceLevel
): Promise<void> {
  if (alreadyInstalled) {
    if (level === "advanced") {
      p.log.success(msgs.install.expressSkipped);
    }
    return;
  }

  if (level === "beginner") {
    p.note(msgs.install.beginnerProgress.join("\n"), "Installing Claude Code");
  }

  const s = p.spinner();
  s.start(msgs.install.installing);

  try {
    execSync(getInstallCommand(), {
      stdio: "ignore",
      timeout: 120_000,
    });
    s.stop(success("✓") + " " + msgs.install.done);
  } catch (err) {
    s.stop(msgs.status.installFailed);
    const message = err instanceof Error ? err.message : String(err);
    const isNetwork =
      message.includes("ENOTFOUND") ||
      message.includes("ETIMEDOUT") ||
      message.includes("ECONNREFUSED") ||
      message.includes("network");
    if (isNetwork) {
      p.log.error(msgs.errors.networkError);
    } else {
      p.log.error(msgs.status.installFailed);
    }
    p.log.info(msgs.errors.retryGuidance);
    throw new FatalError(msgs.status.installFailed);
  }
}
