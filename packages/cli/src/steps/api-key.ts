import * as p from "@clack/prompts";
import { execSync } from "child_process";
import { writeFileSync, readFileSync, existsSync, appendFileSync } from "fs";
import { join } from "path";
import type { I18nMessages } from "@claude-ready/shared";
import { success, box, dim } from "../ui/theme.js";
import type { ExperienceLevel } from "./welcome.js";
import { UserCancelledError, FatalError } from "../errors.js";

export async function apiKeyStep(
  msgs: I18nMessages,
  projectDir: string,
  level?: ExperienceLevel
): Promise<void> {
  // Check if ANTHROPIC_API_KEY is already set
  if (process.env.ANTHROPIC_API_KEY) {
    if (level === "advanced") {
      p.log.success(msgs.apiKey.expressAlreadySet);
    } else {
      p.log.success(success("✓") + " " + msgs.apiKey.alreadyConfigured);
    }
    return;
  }

  p.log.warn(msgs.apiKey.needAccount);

  if (level === "beginner") {
    p.note(msgs.apiKey.beginnerSteps.join("\n"), msgs.apiKey.aboutApiKeys);
  }

  console.log();
  console.log(
    box([
      msgs.apiKey.opening,
      "",
      msgs.apiKey.stepsLabel,
      ...msgs.apiKey.steps.map((step, i) => `${i + 1}. ${step}`),
    ])
  );
  console.log();

  // Try to open browser
  try {
    const openCmd =
      process.platform === "darwin"
        ? "open"
        : process.platform === "win32"
          ? "start"
          : "xdg-open";
    execSync(`${openCmd} https://console.anthropic.com/settings/keys`, {
      stdio: "ignore",
      timeout: 5000,
    });
  } catch {
    p.log.info(
      dim("Open https://console.anthropic.com/settings/keys in your browser")
    );
  }

  const apiKey = await p.text({
    message: msgs.apiKey.prompt,
    placeholder: "sk-ant-...",
    validate(value) {
      if (!value || !value.startsWith("sk-ant-")) {
        return msgs.errors.apiKeyFormatError;
      }
      if (value.length < 20) {
        return msgs.apiKey.apiKeyLengthError;
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
        return msgs.apiKey.apiKeyCharsError;
      }
    },
  });

  if (p.isCancel(apiKey)) {
    throw new UserCancelledError(msgs.cancel);
  }

  // Save to .env
  try {
    const envPath = join(projectDir, ".env");
    writeFileSync(envPath, `ANTHROPIC_API_KEY=${apiKey}\n`, { encoding: "utf-8", mode: 0o600 });

    // Ensure .gitignore includes .env
    const gitignorePath = join(projectDir, ".gitignore");
    if (existsSync(gitignorePath)) {
      const content = readFileSync(gitignorePath, "utf-8");
      if (!content.includes(".env")) {
        appendFileSync(gitignorePath, "\n.env\n.env.*\n.env.local\n");
      }
    } else {
      writeFileSync(gitignorePath, ".env\n.env.*\n.env.local\n", "utf-8");
    }
  } catch {
    p.log.error(msgs.errors.fileWriteError);
    throw new FatalError(msgs.errors.fileWriteError);
  }

  p.log.success(success("✓") + " " + msgs.apiKey.verified);
}
