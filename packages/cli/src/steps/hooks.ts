import * as p from "@clack/prompts";
import {
  type I18nMessages,
  type HookPresetId,
  type HooksConfig,
  getHookPresets,
  generateHooksConfig,
} from "@claude-ready/shared";
import type { ExperienceLevel } from "./welcome.js";
import { success, dim } from "../ui/theme.js";
import { UserCancelledError } from "../errors.js";

export async function hooksStep(
  msgs: I18nMessages,
  level: ExperienceLevel,
): Promise<HooksConfig | undefined> {
  const presets = getHookPresets();

  const presetLabels: Record<HookPresetId, { name: string; desc: string }> = {
    'auto-format': { name: msgs.hooks.autoFormat, desc: msgs.hooks.autoFormatDesc },
    'safe-commit': { name: msgs.hooks.safeCommit, desc: msgs.hooks.safeCommitDesc },
    'dangerous-cmd-block': { name: msgs.hooks.dangerousCmdBlock, desc: msgs.hooks.dangerousCmdBlockDesc },
    'cost-tracker': { name: msgs.hooks.costTracker, desc: msgs.hooks.costTrackerDesc },
    'notification': { name: msgs.hooks.notification, desc: msgs.hooks.notificationDesc },
  };

  if (level === 'advanced') {
    const enable = await p.confirm({
      message: msgs.hooks.question,
    });

    if (p.isCancel(enable)) {
      throw new UserCancelledError(msgs.cancel);
    }

    if (!enable) {
      p.log.info(dim(msgs.hooks.skipped));
      return undefined;
    }

    const recommended: HookPresetId[] = ['dangerous-cmd-block', 'notification'];
    const config = generateHooksConfig(recommended);
    p.log.success(success("✓") + " " + msgs.hooks.enabled + " " + dim(`(${recommended.length} hooks)`));
    return config;
  }

  // Beginner / Intermediate: multiselect with descriptions
  const selected = await p.multiselect({
    message: msgs.hooks.question,
    options: presets.map((preset) => ({
      value: preset.id,
      label: presetLabels[preset.id].name,
      hint: presetLabels[preset.id].desc,
    })),
    initialValues: ['dangerous-cmd-block', 'notification'] as HookPresetId[],
    required: false,
  });

  if (p.isCancel(selected)) {
    throw new UserCancelledError(msgs.cancel);
  }

  const selectedIds = selected as HookPresetId[];
  if (selectedIds.length === 0) {
    p.log.info(dim(msgs.hooks.skipped));
    return undefined;
  }

  const config = generateHooksConfig(selectedIds);
  p.log.success(success("✓") + " " + msgs.hooks.enabled + " " + dim(`(${selectedIds.length} hooks)`));
  return config;
}
