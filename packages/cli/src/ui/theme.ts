import pc from "picocolors";

export const brand = {
  primary: "#D97757",
  name: "Claude Ready",
};

export function brandText(text: string): string {
  // Use ANSI 256 color closest to Claude amber #D97757
  return `\x1b[38;5;173m${text}\x1b[0m`;
}

export function success(text: string): string {
  return pc.green(text);
}

export function dim(text: string): string {
  return pc.dim(text);
}

export function bold(text: string): string {
  return pc.bold(text);
}

export function box(lines: string[]): string {
  const maxLen = Math.max(...lines.map((l) => stripAnsi(l).length));
  const pad = (s: string) => s + " ".repeat(maxLen - stripAnsi(s).length);
  const top = `  ╭${"─".repeat(maxLen + 4)}╮`;
  const bottom = `  ╰${"─".repeat(maxLen + 4)}╯`;
  const middle = lines.map((l) => `  │  ${pad(l)}  │`).join("\n");
  return `${top}\n${middle}\n${bottom}`;
}

function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\u001b\[[0-9;]*[a-zA-Z]|\u001b\].*?(?:\u0007|\u001b\\)/g, "");
}
