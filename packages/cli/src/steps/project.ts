import * as p from "@clack/prompts";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname, isAbsolute, normalize } from "path";
import {
  generateClaudeMd,
  getScaffoldFiles,
  type ProjectType,
  type I18nMessages,
} from "@claude-ready/shared";
import { success } from "../ui/theme.js";
import type { ExperienceLevel } from "./welcome.js";
import { UserCancelledError, FatalError } from "../errors.js";

export async function projectStep(
  msgs: I18nMessages,
  level?: ExperienceLevel
): Promise<{ projectType: ProjectType; projectDir: string | null }> {
  // Express mode: propose default template with confirm only
  if (level === "advanced") {
    const useDefault = await p.confirm({
      message: msgs.project.justSetup + "?",
    });
    if (p.isCancel(useDefault)) {
      throw new UserCancelledError(msgs.cancel);
    }
    if (useDefault) {
      return { projectType: "general", projectDir: null };
    }
  }

  const projectType = await p.select({
    message: msgs.project.question,
    options: [
      {
        value: "website" as const,
        label: msgs.project.website,
        hint: msgs.hints.htmlCssJs,
      },
      {
        value: "webapp" as const,
        label: msgs.project.webapp,
        hint: msgs.hints.reactVite,
      },
      {
        value: "cli-tool" as const,
        label: msgs.project.cliTool,
        hint: msgs.hints.nodejs,
      },
      {
        value: "general" as const,
        label: msgs.project.justSetup,
        hint: msgs.hints.noProject,
      },
    ],
  });

  if (p.isCancel(projectType)) {
    throw new UserCancelledError(msgs.cancel);
  }

  if (projectType === "general") {
    return { projectType, projectDir: null };
  }

  const projectName =
    projectType === "website"
      ? "my-website"
      : projectType === "webapp"
        ? "my-app"
        : "my-cli";

  const projectDir = join(process.cwd(), projectName);

  // Check if directory already exists
  if (existsSync(projectDir)) {
    const overwrite = await p.confirm({
      message: msgs.project.directoryExists.replace("{name}", projectName),
    });
    if (p.isCancel(overwrite) || !overwrite) {
      throw new UserCancelledError(msgs.cancel);
    }
  }

  const s = p.spinner();
  s.start(msgs.status.projectCreating);

  try {
    // Create project directory
    mkdirSync(projectDir, { recursive: true });

    // Write scaffold files
    const scaffoldFiles = getScaffoldFiles(projectType, projectName);
    for (const file of scaffoldFiles) {
      // Path traversal prevention
      const normalizedPath = normalize(file.path);
      if (normalizedPath.includes("..") || isAbsolute(normalizedPath)) {
        throw new Error(msgs.errors.pathTraversalError);
      }
      const filePath = join(projectDir, normalizedPath);
      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, file.content, "utf-8");
    }

    // Write CLAUDE.md
    const claudeMd = generateClaudeMd(projectType, projectName);
    writeFileSync(join(projectDir, "CLAUDE.md"), claudeMd, "utf-8");
  } catch {
    s.stop(msgs.errors.fileWriteError);
    p.log.error(msgs.errors.fileWriteError);
    throw new FatalError(msgs.errors.fileWriteError);
  }

  s.stop(success("✓") + " " + msgs.status.projectCreated);

  return { projectType, projectDir };
}
