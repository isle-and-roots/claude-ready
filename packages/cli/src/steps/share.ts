import * as p from "@clack/prompts";
import { execSync } from "child_process";
import {
  generateShareText,
  type SetupStats,
  type ProjectType,
  type I18nMessages,
} from "@claude-ready/shared";
import { formatDuration } from "../ui/animations.js";
import { success } from "../ui/theme.js";

export function generateShare(
  msgs: I18nMessages,
  startTime: number,
  projectType: ProjectType,
  nodeVersion: string
): string {
  const stats: SetupStats = {
    os: process.platform === "darwin" ? "macOS" : process.platform,
    nodeVersion,
    projectType: projectTypeLabel(msgs, projectType),
    duration: formatDuration(startTime),
  };
  return generateShareText(stats);
}

export function shareStep(
  msgs: I18nMessages,
  startTime: number,
  projectType: ProjectType,
  nodeVersion: string
): void {
  const shareText = generateShare(msgs, startTime, projectType, nodeVersion);

  console.log();
  console.log(shareText);
  console.log();

  if (process.platform === "darwin") {
    try {
      execSync('pbcopy', { input: shareText, stdio: ['pipe', 'ignore', 'ignore'] });
      p.log.success(success("✓") + " " + msgs.share.copiedToClipboard);
    } catch {
      // clipboard copy is best-effort; silently ignore failures
    }
  }
}

function projectTypeLabel(msgs: I18nMessages, type: ProjectType): string {
  switch (type) {
    case "website":
      return msgs.share.projectTypeWebsite;
    case "webapp":
      return msgs.share.projectTypeWebapp;
    case "cli-tool":
      return msgs.share.projectTypeCliTool;
    case "general":
      return msgs.share.projectTypeGeneral;
  }
}
