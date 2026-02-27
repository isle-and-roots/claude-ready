import * as p from "@clack/prompts";
import type { I18nMessages } from "@claude-ready/shared";
import {
  getLevels,
  readProgress,
  type LearningProgress,
} from "@claude-ready/shared";
import { brandText, bold, dim, success } from "../ui/theme.js";

export async function learnStep(msgs: I18nMessages): Promise<void> {
  const progress = readProgress();
  const levels = getLevels();
  const currentLevelDef = levels.find((l) => l.level === progress.currentLevel);
  const totalLevels = levels.length;

  // Progress bar (filled squares)
  const filledBars = progress.currentLevel - 1;
  const emptyBars = totalLevels - filledBars - 1;
  const progressBar =
    "█".repeat(filledBars) + "▓" + "░".repeat(emptyBars);

  const lines = [
    "",
    brandText(bold(msgs.learn.title)),
    "",
    `${msgs.learn.currentLevel}: ${bold(currentLevelDef?.name ?? `Level ${progress.currentLevel}`)}`,
    `${msgs.learn.progress}: [${progressBar}] ${progress.currentLevel}/${totalLevels}`,
    "",
    dim(currentLevelDef?.description ?? ""),
    "",
  ];

  if (currentLevelDef) {
    lines.push(msgs.learn.nextTask + ":");
    for (const task of currentLevelDef.tasks) {
      const isDone = progress.completedTasks.includes(task);
      const marker = isDone ? success("✓") : dim("○");
      lines.push(`  ${marker} ${isDone ? dim(task) : task}`);
    }
    lines.push("");
  }

  p.note(lines.join("\n"), msgs.learn.title);

  // Show all levels overview
  const levelChoices = levels.map((l) => {
    const isComplete = l.level < progress.currentLevel;
    const isCurrent = l.level === progress.currentLevel;
    const prefix = isComplete ? success("✓") : isCurrent ? "▶" : dim("○");
    return `  ${prefix} Level ${l.level}: ${l.name}`;
  });

  p.log.info(
    msgs.learn.levels + ":\n" + levelChoices.join("\n")
  );

  console.log();
}
