import * as p from "@clack/prompts";
import { applySecuritySettings, type I18nMessages, type HooksConfig } from "@claude-ready/shared";
import { success, dim } from "../ui/theme.js";
import { FatalError } from "../errors.js";

export async function securityStep(projectDir: string, msgs: I18nMessages, hooks?: HooksConfig): Promise<void> {
  try {
    applySecuritySettings(projectDir, hooks);
  } catch {
    p.log.error(msgs.errors.fileWriteError);
    throw new FatalError(msgs.errors.fileWriteError);
  }
  p.log.success(success("✓") + " Security settings applied " + dim("(auto)"));
}
