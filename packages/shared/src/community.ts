import { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { CONFIG_DIR } from './config.js';

const EVENTS_CACHE_PATH = join(CONFIG_DIR, 'events-cache.json');
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface EventsCache {
  timestamp: number;
  events: MeetupInfo[];
}

function readEventsCache(): MeetupInfo[] | null {
  try {
    if (!existsSync(EVENTS_CACHE_PATH)) return null;
    const raw = readFileSync(EVENTS_CACHE_PATH, 'utf-8');
    const cache: EventsCache = JSON.parse(raw);
    if (Date.now() - cache.timestamp > CACHE_TTL_MS) return null;
    if (!Array.isArray(cache.events) || cache.events.length === 0) return null;
    return cache.events;
  } catch {
    return null;
  }
}

export function clearEventsCache(): void {
  try {
    if (existsSync(EVENTS_CACHE_PATH)) {
      unlinkSync(EVENTS_CACHE_PATH);
    }
  } catch {
    // Best-effort cleanup
  }
}

function writeEventsCache(events: MeetupInfo[]): void {
  try {
    mkdirSync(CONFIG_DIR, { recursive: true });
    const cache: EventsCache = { timestamp: Date.now(), events };
    writeFileSync(EVENTS_CACHE_PATH, JSON.stringify(cache), 'utf-8');
  } catch {
    // Cache write is best-effort
  }
}

export interface SetupStats {
  os: string;
  nodeVersion: string;
  projectType: string;
  duration: string;
}

export function generateShareText(stats: SetupStats): string {
  return `I just set up Claude Code! 🎉

🔧 ${stats.os} + Node ${stats.nodeVersion}
📦 ${stats.projectType}
⏱  Setup: ${stats.duration}

Try it: npx claude-ready

#ClaudeReady #ClaudeCode`;
}

export interface MeetupInfo {
  name: string;
  date: string;
  location: string;
  url: string;
  description: string;
}

const FALLBACK_MEETUPS: MeetupInfo[] = [
  {
    name: 'Claude Code Meetup Japan #3',
    date: '2026-03-12',
    location: 'Tokyo, Japan',
    url: 'https://claude.ai',
    description: 'Community meetup for Claude Code users and enthusiasts in Japan.',
  },
];

export function getMeetupInfo(): MeetupInfo {
  return FALLBACK_MEETUPS[0];
}

function isMeetupInfo(obj: unknown): obj is MeetupInfo {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  const fields: (keyof MeetupInfo)[] = ['name', 'date', 'location', 'url', 'description'];
  for (const field of fields) {
    if (typeof o[field] !== 'string') return false;
    if ((o[field] as string).length > 500) return false;
    if (/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(o[field] as string)) return false;
  }
  return true;
}

export async function fetchMeetupInfo(): Promise<MeetupInfo[]> {
  // Check cache first
  const cached = readEventsCache();
  if (cached) return cached;

  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/naotoshima/claude-ready/main/events.json',
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return FALLBACK_MEETUPS;
    const contentLength = res.headers?.get?.('content-length');
    if (Number(contentLength ?? '0') > 1_048_576) return FALLBACK_MEETUPS;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return FALLBACK_MEETUPS;
    const valid = data.filter(isMeetupInfo);
    const result = valid.length > 0 ? valid : FALLBACK_MEETUPS;
    writeEventsCache(result);
    return result;
  } catch {
    return FALLBACK_MEETUPS;
  }
}
