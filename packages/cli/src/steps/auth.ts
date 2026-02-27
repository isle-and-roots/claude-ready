import * as p from "@clack/prompts";
import { execSync } from "child_process";
import { writeFileSync, readFileSync, existsSync, appendFileSync } from "fs";
import { join } from "path";
import type { I18nMessages } from "@claude-ready/shared";
import { success, dim } from "../ui/theme.js";
import type { ExperienceLevel } from "./welcome.js";
import { UserCancelledError, FatalError } from "../errors.js";

type AuthMethod = "subscription" | "apiKey" | "teams" | "cloudProvider";
type CloudProvider = "bedrock" | "vertex";

async function handleApiKeyFlow(
  msgs: I18nMessages,
  projectDir: string,
  level?: ExperienceLevel
): Promise<void> {
  if (level === "beginner") {
    p.note(msgs.apiKey.beginnerSteps.join("\n"), msgs.apiKey.aboutApiKeys);
  }

  p.log.warn(msgs.apiKey.needAccount);

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

async function handleSubscriptionFlow(
  msgs: I18nMessages,
  projectDir: string
): Promise<void> {
  // Check for existing ANTHROPIC_API_KEY conflict
  const envPath = join(projectDir, ".env");
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, "utf-8");
    if (envContent.includes("ANTHROPIC_API_KEY")) {
      p.log.warn(msgs.auth.apiKeyConflict);
      const removeKey = await p.confirm({ message: msgs.auth.removeApiKey });
      if (p.isCancel(removeKey)) {
        throw new UserCancelledError(msgs.cancel);
      }
      if (removeKey) {
        const updated = envContent
          .split("\n")
          .filter((line) => !line.startsWith("ANTHROPIC_API_KEY"))
          .join("\n");
        writeFileSync(envPath, updated, { encoding: "utf-8", mode: 0o600 });
      }
    }
  }

  p.log.info(msgs.auth.loginRunning);
  try {
    execSync("claude login", { stdio: "inherit", timeout: 120000 });
    p.log.success(success("✓") + " " + msgs.auth.loginSuccess);
  } catch {
    p.log.error(msgs.auth.loginFailed);
    throw new FatalError(msgs.auth.loginFailed);
  }
}

async function handleTeamsFlow(msgs: I18nMessages): Promise<void> {
  p.note(msgs.auth.teamsInviteGuide, msgs.auth.teams);
  p.log.info(msgs.auth.loginRunning);
  try {
    execSync("claude login", { stdio: "inherit", timeout: 120000 });
    p.log.success(success("✓") + " " + msgs.auth.loginSuccess);
  } catch {
    p.log.error(msgs.auth.loginFailed);
    throw new FatalError(msgs.auth.loginFailed);
  }
}

async function handleCloudProviderFlow(msgs: I18nMessages): Promise<void> {
  const provider = await p.select<CloudProvider>({
    message: msgs.auth.cloudProviderSelect,
    options: [
      { value: "bedrock", label: "AWS Bedrock" },
      { value: "vertex", label: "Google Cloud Vertex AI" },
    ],
  });

  if (p.isCancel(provider)) {
    throw new UserCancelledError(msgs.cancel);
  }

  p.log.info(msgs.auth.cloudProviderEnvGuide);

  if (provider === "bedrock") {
    console.log(
      [
        "  CLAUDE_CODE_USE_BEDROCK=1",
        "  AWS_REGION=<your-region>",
        "  AWS_ACCESS_KEY_ID=<your-key-id>",
        "  AWS_SECRET_ACCESS_KEY=<your-secret>",
      ].join("\n")
    );
  } else {
    console.log(
      [
        "  CLAUDE_CODE_USE_VERTEX=1",
        "  CLOUD_ML_REGION=<your-region>",
        "  ANTHROPIC_VERTEX_PROJECT_ID=<your-project-id>",
      ].join("\n")
    );
  }
}

export async function authStep(
  msgs: I18nMessages,
  projectDir: string,
  level?: ExperienceLevel
): Promise<void> {
  // Express path: skip if already configured
  if (process.env.ANTHROPIC_API_KEY) {
    if (level === "advanced") {
      p.log.success(msgs.apiKey.expressAlreadySet);
    } else {
      p.log.success(success("✓") + " " + msgs.apiKey.alreadyConfigured);
    }
    return;
  }

  if (level === "beginner") {
    p.note(msgs.auth.beginnerAuthGuide.join("\n\n"), msgs.auth.methodQuestion);
  }

  const authOptions = [
    {
      value: "subscription" as AuthMethod,
      label: msgs.auth.subscription,
      hint: level === "beginner" ? msgs.auth.subscriptionDesc : undefined,
    },
    {
      value: "apiKey" as AuthMethod,
      label: msgs.auth.apiKey,
      hint: level === "beginner" ? msgs.auth.apiKeyDesc : undefined,
    },
    {
      value: "teams" as AuthMethod,
      label: msgs.auth.teams,
      hint: level === "beginner" ? msgs.auth.teamsDesc : undefined,
    },
    {
      value: "cloudProvider" as AuthMethod,
      label: msgs.auth.cloudProvider,
      hint: level === "beginner" ? msgs.auth.cloudProviderDesc : undefined,
    },
  ];

  const method = await p.select<AuthMethod>({
    message: msgs.auth.methodQuestion,
    options: authOptions,
  });

  if (p.isCancel(method)) {
    throw new UserCancelledError(msgs.cancel);
  }

  switch (method) {
    case "subscription":
      await handleSubscriptionFlow(msgs, projectDir);
      break;
    case "apiKey":
      await handleApiKeyFlow(msgs, projectDir, level);
      break;
    case "teams":
      await handleTeamsFlow(msgs);
      break;
    case "cloudProvider":
      await handleCloudProviderFlow(msgs);
      break;
  }
}
