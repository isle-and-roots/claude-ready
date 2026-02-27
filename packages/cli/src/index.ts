import * as p from "@clack/prompts";
import { detectLocale, loadMessages, type Locale } from "@claude-ready/shared";
import { welcomeStep } from "./steps/welcome.js";
import { envCheckStep } from "./steps/env-check.js";
import { installStep } from "./steps/install.js";
import { authStep } from "./steps/auth.js";
import { securityStep } from "./steps/security.js";
import { projectStep } from "./steps/project.js";
import { communityStep } from "./steps/community.js";
import { shareStep } from "./steps/share.js";
import { costStep } from "./steps/cost.js";
import { learnStep } from "./steps/learn.js";
import { eventsStep } from "./steps/events.js";
import { UserCancelledError, FatalError } from "./errors.js";

const VALID_LOCALES: Locale[] = ['en', 'ja'];

async function main() {
  const startTime = Date.now();
  const args = process.argv.slice(2);

  // Handle --help / --version before anything else
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`claude-ready - Setup Claude Code in minutes

Usage:
  npx claude-ready [options]

Options:
  --lang <locale>  Set language (en, ja)
  --share          Generate share text
  --cost           Show cost estimator
  --learn          Show learning journey
  --events         Show upcoming events
  --dry-run        Run without writing files
  --help, -h       Show this help
  --version, -v    Show version`);
    process.exit(0);
  }

  if (args.includes('--version') || args.includes('-v')) {
    console.log('0.1.0');
    process.exit(0);
  }

  // Parse flags
  const langFlag = args.indexOf("--lang");
  const rawLang = langFlag !== -1 ? args[langFlag + 1] : undefined;
  if (rawLang !== undefined && !VALID_LOCALES.includes(rawLang as Locale)) {
    console.error(`Error: Unsupported locale "${rawLang}". Supported: ${VALID_LOCALES.join(', ')}`);
    process.exit(1);
  }
  const forceLang = rawLang as Locale | undefined;

  const isShare = args.includes("--share");
  const isCost = args.includes("--cost");
  const isLearn = args.includes("--learn");
  const isEvents = args.includes("--events");
  const isDryRun = args.includes("--dry-run");

  // Check for unknown flags (skip the value after --lang)
  const knownFlags = ['--lang', '--share', '--cost', '--learn', '--events', '--dry-run', '--help', '-h', '--version', '-v'];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('-') && !knownFlags.includes(arg)) {
      console.error(`Unknown flag: ${arg}. Use --help to see available options.`);
      process.exit(1);
    }
    // Skip the value after --lang
    if (arg === '--lang') {
      i++;
    }
  }

  // Detect locale
  const locale: Locale = forceLang ?? detectLocale();
  const msgs = loadMessages(locale);

  // Handle --cost flag (quick exit)
  if (isCost) {
    await costStep(msgs);
    return;
  }

  // Handle --learn flag (quick exit)
  if (isLearn) {
    await learnStep(msgs);
    return;
  }

  // Handle --events flag (quick exit)
  if (isEvents) {
    await eventsStep(msgs);
    return;
  }

  // Handle --share flag (quick exit)
  if (isShare) {
    shareStep(msgs, startTime, "general", process.version);
    return;
  }

  if (isDryRun) {
    p.log.info(msgs.dryRun.mode);
  }

  // Phase 1: Welcome
  p.intro(msgs.welcome.title);
  const level = await welcomeStep(msgs);

  // Phase 2: Environment check
  const env = await envCheckStep(msgs, level);

  // Phase 3: Install Claude Code (skipped in dry-run)
  if (!isDryRun) {
    await installStep(msgs, env.isClaudeCodeInstalled, level);
  } else {
    p.log.info(msgs.dryRun.skipInstall);
  }

  // Phase 4: API key (skipped in dry-run)
  const projectDir = process.cwd();
  if (!isDryRun) {
    await authStep(msgs, projectDir, level);
  } else {
    p.log.info(msgs.dryRun.skipApiKey);
  }

  // Phase 5: Security (skipped in dry-run)
  if (!isDryRun) {
    await securityStep(projectDir, msgs);
  } else {
    p.log.info(msgs.dryRun.skipSecurity);
  }

  // Phase 6: Project creation (skipped in dry-run)
  if (!isDryRun) {
    const { projectDir: createdDir } = await projectStep(msgs, level);
    if (createdDir) {
      await securityStep(createdDir, msgs);
    }
    // Phase 7: Community + completion
    await communityStep(msgs, createdDir);
  } else {
    p.log.info(msgs.dryRun.skipProject);
    p.log.success(msgs.dryRun.complete);
  }

  p.outro(msgs.status.happyBuilding + " 🚀");
}

main().catch((err) => {
  if (err instanceof UserCancelledError) {
    p.cancel(err.message);
    process.exit(0);
  }
  if (err instanceof FatalError) {
    p.log.error(err.message);
    process.exit(1);
  }
  console.error("An unexpected error occurred:", err);
  process.exit(1);
});
