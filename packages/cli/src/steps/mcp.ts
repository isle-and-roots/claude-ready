import * as p from "@clack/prompts";
import {
  type I18nMessages,
  type McpPresetId,
  type McpConfig,
  getMcpPresets,
  generateMcpConfig,
  applyMcpConfig,
  getGithubTokenGuide,
} from "@claude-ready/shared";
import type { ExperienceLevel } from "./welcome.js";
import { success, dim } from "../ui/theme.js";
import { UserCancelledError } from "../errors.js";

export async function mcpStep(
  msgs: I18nMessages,
  level: ExperienceLevel,
  projectDir: string,
): Promise<McpConfig | undefined> {
  const presets = getMcpPresets();

  const presetLabels: Record<McpPresetId, { name: string; desc: string }> = {
    'filesystem': { name: msgs.mcp.filesystem, desc: msgs.mcp.filesystemDesc },
    'github': { name: msgs.mcp.github, desc: msgs.mcp.githubDesc },
    'postgres': { name: msgs.mcp.postgres, desc: msgs.mcp.postgresDesc },
    'puppeteer': { name: msgs.mcp.puppeteer, desc: msgs.mcp.puppeteerDesc },
    'brave-search': { name: msgs.mcp.braveSearch, desc: msgs.mcp.braveSearchDesc },
  };

  const recommended: McpPresetId[] = ['filesystem'];

  if (level === 'advanced') {
    const enable = await p.confirm({
      message: msgs.mcp.question,
    });

    if (p.isCancel(enable)) {
      throw new UserCancelledError(msgs.cancel);
    }

    if (!enable) {
      p.log.info(dim(msgs.mcp.skipped));
      return undefined;
    }

    const config = generateMcpConfig(recommended, projectDir);
    applyMcpConfig(projectDir, recommended);
    p.log.success(success("✓") + " " + msgs.mcp.enabled + " " + dim(`(${recommended.length} servers)`));
    return config;
  }

  // Beginner / Intermediate: multiselect with descriptions
  const selected = await p.multiselect({
    message: msgs.mcp.question,
    options: presets.map((preset) => ({
      value: preset.id,
      label: presetLabels[preset.id].name,
      hint: presetLabels[preset.id].desc,
    })),
    initialValues: recommended as McpPresetId[],
    required: false,
  });

  if (p.isCancel(selected)) {
    throw new UserCancelledError(msgs.cancel);
  }

  const selectedIds = selected as McpPresetId[];
  if (selectedIds.length === 0) {
    p.log.info(dim(msgs.mcp.skipped));
    return undefined;
  }

  // Show GitHub token guide if github is selected and token is not set
  if (selectedIds.includes('github') && !process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
    p.log.warn(getGithubTokenGuide());
  }

  const config = generateMcpConfig(selectedIds, projectDir);
  applyMcpConfig(projectDir, selectedIds);
  p.log.success(success("✓") + " " + msgs.mcp.enabled + " " + dim(`(${selectedIds.length} servers)`));

  const hasEnvDeps = selectedIds.some((id) =>
    presets.find((p) => p.id === id)?.requiresEnv?.length,
  );
  if (hasEnvDeps) {
    p.log.info(dim(msgs.mcp.envNote));
  }

  return config;
}
