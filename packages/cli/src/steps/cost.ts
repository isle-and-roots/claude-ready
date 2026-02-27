import * as p from "@clack/prompts";
import type { I18nMessages } from "@claude-ready/shared";
import {
  readBudgetConfig,
  estimateCost,
  checkThresholds,
} from "@claude-ready/shared";
import { brandText, bold, dim, success } from "../ui/theme.js";

export async function costStep(msgs: I18nMessages): Promise<void> {
  const config = readBudgetConfig();

  // Example estimation: typical session usage
  const exampleInputTokens = 50000;
  const exampleOutputTokens = 10000;
  const sessionCost = estimateCost(exampleInputTokens, exampleOutputTokens);

  const warning = checkThresholds(config.totalSpent, config.monthlyBudget);

  const lines = [
    "",
    brandText(bold(msgs.cost.title)),
    "",
    `${msgs.cost.budget}: $${config.monthlyBudget.toFixed(2)}/mo`,
    `${msgs.cost.estimatedCost}: $${sessionCost.toFixed(4)} / session`,
    `  ${dim(`(${exampleInputTokens.toLocaleString()} input + ${exampleOutputTokens.toLocaleString()} output tokens)`)}`,
    "",
  ];

  if (config.totalSpent > 0) {
    lines.push(`Spent this month: $${config.totalSpent.toFixed(4)}`);
    lines.push("");
  } else {
    lines.push(dim(msgs.cost.noBudget));
    lines.push("");
  }

  p.note(lines.join("\n"), msgs.cost.title);

  if (warning) {
    const icon =
      warning.level === "critical"
        ? "🔴"
        : warning.level === "warning"
          ? "🟡"
          : "🔵";
    p.log.warn(`${icon} ${msgs.cost.thresholdWarning}: ${warning.message}`);
  } else {
    p.log.info(success("✓") + " Budget usage looks healthy.");
  }

  console.log();
}
