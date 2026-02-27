import * as fs from 'fs';
import * as path from 'path';
import { CONFIG_DIR } from './config.js';

export type LearningLevel = 1 | 2 | 3 | 4 | 5;

export interface LevelDefinition {
  level: LearningLevel;
  name: string;
  description: string;
  tasks: string[];
}

export interface LearningProgress {
  currentLevel: LearningLevel;
  completedTasks: string[];
  lastUpdated: string;
}

const PROGRESS_FILE = path.join(CONFIG_DIR, 'progress.json');

const DEFAULT_PROGRESS: LearningProgress = {
  currentLevel: 1,
  completedTasks: [],
  lastUpdated: new Date().toISOString(),
};

export function getLevels(): LevelDefinition[] {
  return [
    {
      level: 1,
      name: 'Intro',
      description: 'Getting started with Claude Code',
      tasks: [
        'Install Claude Code',
        'Run your first prompt',
        'Understand the chat interface',
      ],
    },
    {
      level: 2,
      name: 'Basic Prompting',
      description: 'Learn effective prompting techniques',
      tasks: [
        'Write clear, specific prompts',
        'Use context to guide Claude',
        'Iterate and refine responses',
      ],
    },
    {
      level: 3,
      name: 'CLAUDE.md Mastery',
      description: 'Configure projects with CLAUDE.md',
      tasks: [
        'Create your first CLAUDE.md',
        'Add project conventions',
        'Set up custom commands',
      ],
    },
    {
      level: 4,
      name: 'MCP & Tools',
      description: 'Extend Claude with Model Context Protocol',
      tasks: [
        'Install an MCP server',
        'Connect external tools',
        'Build a custom MCP integration',
      ],
    },
    {
      level: 5,
      name: 'Team Workflows',
      description: 'Scale Claude Code across your team',
      tasks: [
        'Share CLAUDE.md across team',
        'Set up CI with Claude Code',
        'Create team-wide standards',
      ],
    },
  ];
}

export function readProgress(): LearningProgress {
  try {
    if (!fs.existsSync(PROGRESS_FILE)) {
      return { ...DEFAULT_PROGRESS };
    }
    const raw = fs.readFileSync(PROGRESS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (
      typeof parsed !== 'object' || parsed === null ||
      typeof parsed.currentLevel !== 'number' ||
      !Array.isArray(parsed.completedTasks) ||
      typeof parsed.lastUpdated !== 'string'
    ) {
      return { ...DEFAULT_PROGRESS };
    }
    return parsed as LearningProgress;
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function writeProgress(progress: LearningProgress): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf-8');
}

export function getNextTasks(progress: LearningProgress): string[] {
  const levels = getLevels();
  const currentLevelDef = levels.find((l) => l.level === progress.currentLevel);
  if (!currentLevelDef) return [];
  return currentLevelDef.tasks.filter(
    (task) => !progress.completedTasks.includes(task)
  );
}
