use serde::{Deserialize, Serialize};
use std::process::Command;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/// Run a shell command and return (stdout, stderr, success).
fn run_cmd(program: &str, args: &[&str]) -> (String, String, bool) {
    match Command::new(program).args(args).output() {
        Ok(out) => {
            let stdout = String::from_utf8_lossy(&out.stdout).to_string();
            let stderr = String::from_utf8_lossy(&out.stderr).to_string();
            (stdout, stderr, out.status.success())
        }
        Err(e) => (String::new(), e.to_string(), false),
    }
}

/// Run an inline Node.js script and return parsed JSON output.
fn run_node_script(script: &str) -> Result<String, String> {
    let (stdout, stderr, ok) = run_cmd("node", &["--input-type=module", "--eval", script]);
    if ok {
        Ok(stdout.trim().to_string())
    } else {
        Err(if stderr.is_empty() { stdout } else { stderr })
    }
}

// ---------------------------------------------------------------------------
// check_environment
// ---------------------------------------------------------------------------

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnvCheckResult {
    pub is_mac_os: bool,
    pub is_windows: bool,
    pub is_linux: bool,
    pub node_version: String,
    pub is_node_version_supported: bool,
    pub is_claude_code_installed: bool,
    pub system_locale: String,
    pub ok: bool,
}

#[tauri::command]
fn check_environment() -> Result<EnvCheckResult, String> {
    let script = r#"
import { checkEnvironment } from '@claude-ready/shared';
const result = checkEnvironment();
const ok = result.isNodeVersionSupported;
console.log(JSON.stringify({ ...result, ok }));
"#;
    let json = run_node_script(script)?;
    serde_json::from_str::<EnvCheckResult>(&json).map_err(|e| e.to_string())
}

// ---------------------------------------------------------------------------
// install_claude_code
// ---------------------------------------------------------------------------

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InstallResult {
    pub success: bool,
    pub already_installed: bool,
    pub error: Option<String>,
}

#[tauri::command]
fn install_claude_code() -> InstallResult {
    // Check if already installed
    let (_, _, already) = run_cmd("claude", &["--version"]);
    if already {
        return InstallResult {
            success: true,
            already_installed: true,
            error: None,
        };
    }
    let (_, stderr, ok) = run_cmd("npm", &["install", "-g", "@anthropic-ai/claude-code"]);
    InstallResult {
        success: ok,
        already_installed: false,
        error: if ok { None } else { Some(stderr) },
    }
}

// ---------------------------------------------------------------------------
// save_api_key
// ---------------------------------------------------------------------------

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveApiKeyResult {
    pub success: bool,
    pub error: Option<String>,
}

#[tauri::command]
fn save_api_key(api_key: String) -> SaveApiKeyResult {
    use std::fs;
    use std::path::PathBuf;

    // Validate key format
    if !api_key.starts_with("sk-ant-") || api_key.len() < 20 {
        return SaveApiKeyResult {
            success: false,
            error: Some("Invalid API key format".to_string()),
        };
    }

    // Write to ~/.env or append to ~/.zshrc
    let home = match dirs_next::home_dir() {
        Some(h) => h,
        None => {
            return SaveApiKeyResult {
                success: false,
                error: Some("Cannot determine home directory".to_string()),
            }
        }
    };

    let env_path: PathBuf = home.join(".claude-ready.env");
    let content = format!("ANTHROPIC_API_KEY={}\n", api_key);
    match fs::write(&env_path, &content) {
        Ok(_) => SaveApiKeyResult {
            success: true,
            error: None,
        },
        Err(e) => SaveApiKeyResult {
            success: false,
            error: Some(e.to_string()),
        },
    }
}

// ---------------------------------------------------------------------------
// apply_settings
// ---------------------------------------------------------------------------

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ApplySettingsResult {
    pub success: bool,
    pub settings_path: String,
    pub error: Option<String>,
}

#[tauri::command]
fn apply_settings(project_dir: String, settings: String) -> ApplySettingsResult {
    let settings_path = format!("{}/.claude/settings.json", project_dir);
    let script = format!(
        r#"
import {{ applySecuritySettings }} from '@claude-ready/shared';
try {{
    const settings = JSON.parse({settings_json});
    applySecuritySettings({dir_json}, settings.hooks);
    console.log(JSON.stringify({{ success: true, settingsPath: {path_json} }}));
}} catch (e) {{
    console.log(JSON.stringify({{ success: false, settingsPath: {path_json}, error: e.message }}));
}}
"#,
        settings_json = serde_json::to_string(&settings).unwrap_or_default(),
        dir_json = serde_json::to_string(&project_dir).unwrap_or_default(),
        path_json = serde_json::to_string(&settings_path).unwrap_or_default(),
    );

    match run_node_script(&script) {
        Ok(json) => serde_json::from_str(&json).unwrap_or(ApplySettingsResult {
            success: false,
            settings_path: settings_path.clone(),
            error: Some("Failed to parse result".to_string()),
        }),
        Err(e) => ApplySettingsResult {
            success: false,
            settings_path,
            error: Some(e),
        },
    }
}

// ---------------------------------------------------------------------------
// apply_hooks
// ---------------------------------------------------------------------------

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ApplyHooksResult {
    pub success: bool,
    pub hooks_config: serde_json::Value,
    pub error: Option<String>,
}

#[tauri::command]
fn apply_hooks(project_dir: String, preset_ids: Vec<String>) -> ApplyHooksResult {
    let preset_ids_json = serde_json::to_string(&preset_ids).unwrap_or_default();
    let dir_json = serde_json::to_string(&project_dir).unwrap_or_default();
    let script = format!(
        r#"
import {{ generateHooksConfig, applySecuritySettings }} from '@claude-ready/shared';
try {{
    const presetIds = {preset_ids_json};
    const hooksConfig = generateHooksConfig(presetIds);
    applySecuritySettings({dir_json}, hooksConfig);
    console.log(JSON.stringify({{ success: true, hooksConfig }}));
}} catch (e) {{
    console.log(JSON.stringify({{ success: false, hooksConfig: {{}}, error: e.message }}));
}}
"#,
        preset_ids_json = preset_ids_json,
        dir_json = dir_json,
    );

    match run_node_script(&script) {
        Ok(json) => serde_json::from_str(&json).unwrap_or(ApplyHooksResult {
            success: false,
            hooks_config: serde_json::Value::Object(Default::default()),
            error: Some("Failed to parse result".to_string()),
        }),
        Err(e) => ApplyHooksResult {
            success: false,
            hooks_config: serde_json::Value::Object(Default::default()),
            error: Some(e),
        },
    }
}

// ---------------------------------------------------------------------------
// apply_template
// ---------------------------------------------------------------------------

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ApplyTemplateResult {
    pub success: bool,
    pub claude_md_path: String,
    pub error: Option<String>,
}

#[tauri::command]
fn apply_template(
    project_dir: String,
    project_type: String,
    project_name: String,
) -> ApplyTemplateResult {
    let claude_md_path = format!("{}/CLAUDE.md", project_dir);
    let dir_json = serde_json::to_string(&project_dir).unwrap_or_default();
    let type_json = serde_json::to_string(&project_type).unwrap_or_default();
    let name_json = serde_json::to_string(&project_name).unwrap_or_default();
    let path_json = serde_json::to_string(&claude_md_path).unwrap_or_default();
    let script = format!(
        r#"
import {{ generateClaudeMd }} from '@claude-ready/shared';
import {{ writeFileSync, mkdirSync }} from 'fs';
import {{ join }} from 'path';
try {{
    const dir = {dir_json};
    const type_ = {type_json};
    const name = {name_json};
    mkdirSync(dir, {{ recursive: true }});
    const content = generateClaudeMd(type_, name);
    writeFileSync(join(dir, 'CLAUDE.md'), content, 'utf-8');
    console.log(JSON.stringify({{ success: true, claudeMdPath: {path_json} }}));
}} catch (e) {{
    console.log(JSON.stringify({{ success: false, claudeMdPath: {path_json}, error: e.message }}));
}}
"#,
        dir_json = dir_json,
        type_json = type_json,
        name_json = name_json,
        path_json = path_json,
    );

    match run_node_script(&script) {
        Ok(json) => serde_json::from_str(&json).unwrap_or(ApplyTemplateResult {
            success: false,
            claude_md_path: claude_md_path.clone(),
            error: Some("Failed to parse result".to_string()),
        }),
        Err(e) => ApplyTemplateResult {
            success: false,
            claude_md_path,
            error: Some(e),
        },
    }
}

// ---------------------------------------------------------------------------
// apply_mcp_config
// ---------------------------------------------------------------------------

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ApplyMcpResult {
    pub success: bool,
    pub mcp_config: serde_json::Value,
    pub mcp_json_path: String,
    pub error: Option<String>,
}

#[tauri::command]
fn apply_mcp_config(project_dir: String, preset_ids: Vec<String>) -> ApplyMcpResult {
    let mcp_json_path = format!("{}/.mcp.json", project_dir);
    let preset_ids_json = serde_json::to_string(&preset_ids).unwrap_or_default();
    let dir_json = serde_json::to_string(&project_dir).unwrap_or_default();
    let path_json = serde_json::to_string(&mcp_json_path).unwrap_or_default();
    let script = format!(
        r#"
import {{ generateMcpConfig, applyMcpConfig }} from '@claude-ready/shared';
try {{
    const dir = {dir_json};
    const presetIds = {preset_ids_json};
    const mcpConfig = generateMcpConfig(presetIds, dir);
    applyMcpConfig(dir, presetIds);
    console.log(JSON.stringify({{ success: true, mcpConfig, mcpJsonPath: {path_json} }}));
}} catch (e) {{
    console.log(JSON.stringify({{ success: false, mcpConfig: {{ mcpServers: {{}} }}, mcpJsonPath: {path_json}, error: e.message }}));
}}
"#,
        dir_json = dir_json,
        preset_ids_json = preset_ids_json,
        path_json = path_json,
    );

    match run_node_script(&script) {
        Ok(json) => serde_json::from_str(&json).unwrap_or(ApplyMcpResult {
            success: false,
            mcp_config: serde_json::json!({ "mcpServers": {} }),
            mcp_json_path: mcp_json_path.clone(),
            error: Some("Failed to parse result".to_string()),
        }),
        Err(e) => ApplyMcpResult {
            success: false,
            mcp_config: serde_json::json!({ "mcpServers": {} }),
            mcp_json_path,
            error: Some(e),
        },
    }
}

// ---------------------------------------------------------------------------
// create_project  (orchestrates all steps)
// ---------------------------------------------------------------------------

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateProjectOptions {
    pub project_dir: String,
    pub project_name: String,
    pub project_type: String,
    pub security_level: String,
    pub hooks_enabled: bool,
    pub hook_presets: Vec<String>,
    pub mcp_presets: Vec<String>,
    pub locale: String,
}

#[derive(Serialize, Deserialize)]
pub struct CreateProjectSteps {
    pub security: bool,
    pub hooks: bool,
    pub template: bool,
    pub mcp: bool,
}

#[derive(Serialize, Deserialize)]
pub struct CreateProjectResult {
    pub success: bool,
    pub steps: CreateProjectSteps,
    pub errors: Vec<String>,
}

#[tauri::command]
fn create_project(options: String) -> CreateProjectResult {
    let opts: CreateProjectOptions = match serde_json::from_str(&options) {
        Ok(o) => o,
        Err(e) => {
            return CreateProjectResult {
                success: false,
                steps: CreateProjectSteps {
                    security: false,
                    hooks: false,
                    template: false,
                    mcp: false,
                },
                errors: vec![format!("Invalid options: {}", e)],
            }
        }
    };

    let mut errors: Vec<String> = Vec::new();
    let mut steps = CreateProjectSteps {
        security: false,
        hooks: false,
        template: false,
        mcp: false,
    };

    // Security
    let sec = apply_settings(
        opts.project_dir.clone(),
        r#"{"permissions":{"deny":[]}}"#.to_string(),
    );
    steps.security = sec.success;
    if !sec.success {
        if let Some(e) = sec.error {
            errors.push(format!("security: {}", e));
        }
    }

    // Hooks
    if opts.hooks_enabled && !opts.hook_presets.is_empty() {
        let h = apply_hooks(opts.project_dir.clone(), opts.hook_presets.clone());
        steps.hooks = h.success;
        if !h.success {
            if let Some(e) = h.error {
                errors.push(format!("hooks: {}", e));
            }
        }
    } else {
        steps.hooks = true;
    }

    // Template
    let t = apply_template(
        opts.project_dir.clone(),
        opts.project_type.clone(),
        opts.project_name.clone(),
    );
    steps.template = t.success;
    if !t.success {
        if let Some(e) = t.error {
            errors.push(format!("template: {}", e));
        }
    }

    // MCP
    if !opts.mcp_presets.is_empty() {
        let m = apply_mcp_config(opts.project_dir.clone(), opts.mcp_presets.clone());
        steps.mcp = m.success;
        if !m.success {
            if let Some(e) = m.error {
                errors.push(format!("mcp: {}", e));
            }
        }
    } else {
        steps.mcp = true;
    }

    CreateProjectResult {
        success: errors.is_empty(),
        steps,
        errors,
    }
}

// ---------------------------------------------------------------------------
// Tauri entry point
// ---------------------------------------------------------------------------

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            check_environment,
            install_claude_code,
            save_api_key,
            apply_settings,
            apply_hooks,
            apply_template,
            apply_mcp_config,
            create_project,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
