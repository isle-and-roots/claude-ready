import * as p from "@clack/prompts";
import { basename } from "path";
import type { I18nMessages } from "@claude-ready/shared";
import { box, brandText, bold, dim, success } from "../ui/theme.js";

export async function communityStep(
  msgs: I18nMessages,
  projectDir: string | null
): Promise<void> {
  const lines = [
    "",
    success("✓") + " " + brandText(bold(msgs.complete.title)),
    "",
  ];

  if (projectDir) {
    const dirName = basename(projectDir);
    lines.push(msgs.complete.toStart);
    lines.push(`  cd ${dirName}`);
    lines.push("  claude");
    lines.push("");
  }

  lines.push(msgs.complete.trySaying);
  for (const suggestion of msgs.complete.suggestions) {
    lines.push(dim(`  "${suggestion}"`));
  }
  lines.push("");

  console.log();
  console.log(box(lines));
  console.log();

  p.log.info(`📱 ${msgs.share.label}: npx claude-ready --share`);
  p.log.info(`💬 ${msgs.community.discord}: discord.gg/claude-code-jp`);
  p.log.info(
    `⭐ ${msgs.community.star}: github.com/naotoshima/claude-ready`
  );
  console.log();
}
