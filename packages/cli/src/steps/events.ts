import * as p from "@clack/prompts";
import { fetchMeetupInfo, type I18nMessages } from "@claude-ready/shared";
import { brandText, bold, dim } from "../ui/theme.js";

export async function eventsStep(msgs: I18nMessages): Promise<void> {
  const s = p.spinner();
  s.start(msgs.events.upcoming + "...");

  const events = await fetchMeetupInfo();

  s.stop(msgs.events.title);

  if (events.length === 0) {
    p.log.info(msgs.events.noEvents);
    return;
  }

  const lines: string[] = ["", brandText(bold(msgs.events.title)), ""];

  for (const event of events) {
    lines.push(`  ${bold(event.name)}`);
    lines.push(`  ${dim(msgs.events.dateLabel)}     ${event.date}`);
    lines.push(`  ${dim(msgs.events.locationLabel)} ${event.location}`);
    lines.push(`  ${dim(msgs.events.urlLabel)}      ${event.url}`);
    if (event.description) {
      lines.push(`  ${dim(event.description)}`);
    }
    lines.push("");
  }

  p.note(lines.join("\n"), msgs.events.title);
  console.log();
}
