import * as p from "@clack/prompts";
import type { I18nMessages } from "@claude-ready/shared";
import { box, brandText, bold, dim } from "../ui/theme.js";
import { UserCancelledError } from "../errors.js";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export async function welcomeStep(
  msgs: I18nMessages
): Promise<ExperienceLevel> {
  console.log();
  console.log(
    box([
      "",
      brandText(bold(msgs.welcome.title)),
      msgs.welcome.subtitle,
      "",
      dim(msgs.welcome.duration),
      "",
    ])
  );
  console.log();

  const level = await p.select({
    message: msgs.welcome.levelQuestion,
    options: [
      {
        value: "beginner" as const,
        label: msgs.welcome.level.beginner,
        hint: msgs.hints.fullGuided,
      },
      {
        value: "intermediate" as const,
        label: msgs.welcome.level.intermediate,
        hint: msgs.hints.standard,
      },
      {
        value: "advanced" as const,
        label: msgs.welcome.level.advanced,
        hint: msgs.hints.express,
      },
    ],
  });

  if (p.isCancel(level)) {
    throw new UserCancelledError(msgs.cancel);
  }

  if (level === "beginner") {
    p.note(msgs.welcome.beginnerTerminalTips, "Terminal Tips");
  }

  return level;
}
