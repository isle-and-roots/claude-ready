import * as fs from 'fs';
import * as path from 'path';
import { CONFIG_DIR } from './config.js';

export interface BudgetConfig {
  monthlyBudget: number;
  totalSpent: number;
  lastUpdated: string;
}

export interface ThresholdWarning {
  level: 'info' | 'warning' | 'critical';
  message: string;
  spent: number;
  budget: number;
}

// Claude API pricing (approximate, per 1K tokens)
const PRICE_PER_1K_INPUT = 0.003;
const PRICE_PER_1K_OUTPUT = 0.015;

const BUDGET_FILE = path.join(CONFIG_DIR, 'budget.json');

const DEFAULT_BUDGET: BudgetConfig = {
  monthlyBudget: 20,
  totalSpent: 0,
  lastUpdated: new Date().toISOString(),
};

export function estimateCost(inputTokens: number, outputTokens: number): number {
  const inputCost = (inputTokens / 1000) * PRICE_PER_1K_INPUT;
  const outputCost = (outputTokens / 1000) * PRICE_PER_1K_OUTPUT;
  return inputCost + outputCost;
}

export function readBudgetConfig(): BudgetConfig {
  try {
    if (!fs.existsSync(BUDGET_FILE)) {
      return { ...DEFAULT_BUDGET };
    }
    const raw = fs.readFileSync(BUDGET_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (
      typeof parsed !== 'object' || parsed === null ||
      typeof parsed.monthlyBudget !== 'number' ||
      typeof parsed.totalSpent !== 'number' ||
      typeof parsed.lastUpdated !== 'string'
    ) {
      return { ...DEFAULT_BUDGET };
    }
    return parsed as BudgetConfig;
  } catch {
    return { ...DEFAULT_BUDGET };
  }
}

export function writeBudgetConfig(config: BudgetConfig): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(BUDGET_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

export function checkThresholds(total: number, budget: number): ThresholdWarning | null {
  const ratio = budget > 0 ? total / budget : 0;

  if (ratio >= 1.0) {
    return {
      level: 'critical',
      message: `You have reached or exceeded your budget of $${budget.toFixed(2)}.`,
      spent: total,
      budget,
    };
  }

  if (ratio >= 0.75) {
    return {
      level: 'warning',
      message: `You have spent $${total.toFixed(2)} of your $${budget.toFixed(2)} budget (${Math.round(ratio * 100)}%).`,
      spent: total,
      budget,
    };
  }

  if (ratio >= 0.5) {
    return {
      level: 'info',
      message: `You have used ${Math.round(ratio * 100)}% of your monthly budget.`,
      spent: total,
      budget,
    };
  }

  return null;
}
