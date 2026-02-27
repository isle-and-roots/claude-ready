/**
 * Tauri bridge — thin wrappers around Tauri's invoke() API.
 *
 * Each function maps to a Rust command defined in src-tauri/src/lib.rs.
 * In dev (Vite-only, no Rust), calls fall back to mock implementations
 * so the React frontend can be developed without a compiled Rust binary.
 */
import type {
  EnvironmentStatus,
  ClaudeSettings,
  HooksConfig,
  HookPresetId,
  McpPresetId,
  McpConfig,
  ProjectType,
} from "@claude-ready/shared";

// ---------------------------------------------------------------------------
// Tauri invoke shim
// ---------------------------------------------------------------------------

/**
 * Tries to use the real Tauri invoke() when available (app context).
 * Falls back to a no-op stub in plain browser/Vite dev mode.
 */
async function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  // @ts-expect-error — __TAURI_INTERNALS__ is injected by Tauri at runtime
  if (typeof window !== "undefined" && window.__TAURI_INTERNALS__) {
    const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
    return tauriInvoke<T>(cmd, args);
  }
  // Dev fallback — individual bridge functions provide their own mock logic
  throw new Error(`Tauri not available: cmd=${cmd} (running in browser/Vite dev mode)`);
}

// ---------------------------------------------------------------------------
// Environment check
// ---------------------------------------------------------------------------

export interface EnvCheckResult extends EnvironmentStatus {
  ok: boolean;
}

/**
 * Runs environment checks via the Rust backend.
 * Falls back to browser-based detection in Vite dev mode.
 */
export async function checkEnvironment(): Promise<EnvCheckResult> {
  try {
    return await invoke<EnvCheckResult>("check_environment");
  } catch {
    // Dev-mode fallback using browser APIs
    const ua = navigator.userAgent;
    const isMacOS = /Mac/.test(ua) && !/iPhone|iPad/.test(ua);
    const isWindows = /Windows/.test(ua);
    const isLinux = /Linux/.test(ua) && !isMacOS && !isWindows;
    const nodeVersion = "unknown (browser)";
    const isNodeVersionSupported = true; // assume OK in dev
    const isClaudeCodeInstalled = false; // can't check from browser
    const systemLocale =
      navigator.language || Intl.DateTimeFormat().resolvedOptions().locale;

    return {
      isMacOS,
      isWindows,
      isLinux,
      nodeVersion,
      isNodeVersionSupported,
      isClaudeCodeInstalled,
      systemLocale,
      ok: isNodeVersionSupported,
    };
  }
}

// ---------------------------------------------------------------------------
// Claude Code installation
// ---------------------------------------------------------------------------

export interface InstallResult {
  success: boolean;
  alreadyInstalled: boolean;
  error?: string;
}

/**
 * Installs Claude Code via `npm install -g @anthropic-ai/claude-code`.
 * Delegates to the Tauri shell plugin.
 */
export async function installClaudeCode(): Promise<InstallResult> {
  try {
    return await invoke<InstallResult>("install_claude_code");
  } catch (err) {
    return {
      success: false,
      alreadyInstalled: false,
      error: String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// API key
// ---------------------------------------------------------------------------

export interface SaveApiKeyResult {
  success: boolean;
  error?: string;
}

/**
 * Persists the Anthropic API key to the user's shell profile (~/.zshrc / ~/.bashrc).
 */
export async function saveApiKey(apiKey: string): Promise<SaveApiKeyResult> {
  try {
    return await invoke<SaveApiKeyResult>("save_api_key", { api_key: apiKey });
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ---------------------------------------------------------------------------
// Security settings
// ---------------------------------------------------------------------------

export interface ApplySettingsResult {
  success: boolean;
  settingsPath: string;
  error?: string;
}

/**
 * Writes `.claude/settings.json` with security deny rules.
 * Optionally merges hook configurations from the selected presets.
 */
export async function applySettings(
  projectDir: string,
  settings: ClaudeSettings,
): Promise<ApplySettingsResult> {
  try {
    return await invoke<ApplySettingsResult>("apply_settings", {
      project_dir: projectDir,
      settings: JSON.stringify(settings),
    });
  } catch (err) {
    return {
      success: false,
      settingsPath: `${projectDir}/.claude/settings.json`,
      error: String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export interface ApplyHooksResult {
  success: boolean;
  hooksConfig: HooksConfig;
  error?: string;
}

/**
 * Generates and writes hooks configuration from selected preset IDs.
 */
export async function applyHooks(
  projectDir: string,
  presetIds: HookPresetId[],
): Promise<ApplyHooksResult> {
  try {
    return await invoke<ApplyHooksResult>("apply_hooks", {
      project_dir: projectDir,
      preset_ids: presetIds,
    });
  } catch (err) {
    return {
      success: false,
      hooksConfig: {},
      error: String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// Templates (CLAUDE.md)
// ---------------------------------------------------------------------------

export interface ApplyTemplateResult {
  success: boolean;
  claudeMdPath: string;
  error?: string;
}

/**
 * Generates a CLAUDE.md file from the selected template type.
 */
export async function applyTemplate(
  projectDir: string,
  projectType: ProjectType,
  projectName: string,
): Promise<ApplyTemplateResult> {
  try {
    return await invoke<ApplyTemplateResult>("apply_template", {
      project_dir: projectDir,
      project_type: projectType,
      project_name: projectName,
    });
  } catch (err) {
    return {
      success: false,
      claudeMdPath: `${projectDir}/CLAUDE.md`,
      error: String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// MCP configuration
// ---------------------------------------------------------------------------

export interface ApplyMcpResult {
  success: boolean;
  mcpConfig: McpConfig;
  mcpJsonPath: string;
  error?: string;
}

/**
 * Generates and writes `.mcp.json` from selected MCP preset IDs.
 */
export async function applyMcpConfig(
  projectDir: string,
  presetIds: McpPresetId[],
): Promise<ApplyMcpResult> {
  try {
    return await invoke<ApplyMcpResult>("apply_mcp_config", {
      project_dir: projectDir,
      preset_ids: presetIds,
    });
  } catch (err) {
    return {
      success: false,
      mcpConfig: { mcpServers: {} },
      mcpJsonPath: `${projectDir}/.mcp.json`,
      error: String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// Project creation (orchestrates all previous steps)
// ---------------------------------------------------------------------------

export interface CreateProjectOptions {
  projectDir: string;
  projectName: string;
  projectType: ProjectType;
  securityLevel: "standard" | "strict";
  hooksEnabled: boolean;
  hookPresets: HookPresetId[];
  mcpPresets: McpPresetId[];
  locale: string;
}

export interface CreateProjectResult {
  success: boolean;
  steps: {
    security: boolean;
    hooks: boolean;
    template: boolean;
    mcp: boolean;
  };
  errors: string[];
}

/**
 * Orchestrates the full project setup: security, hooks, CLAUDE.md, MCP.
 * Falls back to sequential individual calls if the bulk Rust command is unavailable.
 */
export async function createProject(
  options: CreateProjectOptions,
): Promise<CreateProjectResult> {
  const errors: string[] = [];
  const steps = { security: false, hooks: false, template: false, mcp: false };

  try {
    // Attempt the single bulk Rust command first
    return await invoke<CreateProjectResult>("create_project", {
      options: JSON.stringify(options),
    });
  } catch {
    // Fall back to individual bridge calls (also works in dev mode via
    // further per-call fallbacks, though those will return errors without Rust)
  }

  // Security settings
  try {
    const r = await applySettings(options.projectDir, {
      permissions: { deny: [] },
    });
    steps.security = r.success;
    if (!r.success && r.error) errors.push(`security: ${r.error}`);
  } catch (err) {
    errors.push(`security: ${String(err)}`);
  }

  // Hooks
  if (options.hooksEnabled && options.hookPresets.length > 0) {
    try {
      const r = await applyHooks(options.projectDir, options.hookPresets);
      steps.hooks = r.success;
      if (!r.success && r.error) errors.push(`hooks: ${r.error}`);
    } catch (err) {
      errors.push(`hooks: ${String(err)}`);
    }
  } else {
    steps.hooks = true; // no-op — counts as success
  }

  // Template (CLAUDE.md)
  try {
    const r = await applyTemplate(
      options.projectDir,
      options.projectType,
      options.projectName,
    );
    steps.template = r.success;
    if (!r.success && r.error) errors.push(`template: ${r.error}`);
  } catch (err) {
    errors.push(`template: ${String(err)}`);
  }

  // MCP config
  if (options.mcpPresets.length > 0) {
    try {
      const r = await applyMcpConfig(options.projectDir, options.mcpPresets);
      steps.mcp = r.success;
      if (!r.success && r.error) errors.push(`mcp: ${r.error}`);
    } catch (err) {
      errors.push(`mcp: ${String(err)}`);
    }
  } else {
    steps.mcp = true; // no-op
  }

  return {
    success: errors.length === 0,
    steps,
    errors,
  };
}
