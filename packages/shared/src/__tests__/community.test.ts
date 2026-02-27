import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { generateShareText, getMeetupInfo, fetchMeetupInfo, clearEventsCache, type SetupStats } from '../community.js';

const sampleStats: SetupStats = {
  os: 'macOS',
  nodeVersion: '20.0.0',
  projectType: 'Simple Website',
  duration: '2 min 30 sec',
};

describe('generateShareText', () => {
  it('contains #ClaudeReady', () => {
    const text = generateShareText(sampleStats);
    expect(text).toContain('#ClaudeReady');
  });

  it('contains the OS', () => {
    const text = generateShareText(sampleStats);
    expect(text).toContain('macOS');
  });

  it('contains the node version', () => {
    const text = generateShareText(sampleStats);
    expect(text).toContain('20.0.0');
  });

  it('contains the project type', () => {
    const text = generateShareText(sampleStats);
    expect(text).toContain('Simple Website');
  });
});

describe('getMeetupInfo', () => {
  it('returns an object with name field', () => {
    const info = getMeetupInfo();
    expect(info).toHaveProperty('name');
    expect(typeof info.name).toBe('string');
  });

  it('returns an object with date field', () => {
    const info = getMeetupInfo();
    expect(info).toHaveProperty('date');
    expect(typeof info.date).toBe('string');
  });

  it('returns an object with location field', () => {
    const info = getMeetupInfo();
    expect(info).toHaveProperty('location');
    expect(typeof info.location).toBe('string');
  });

  it('returns an object with url field', () => {
    const info = getMeetupInfo();
    expect(info).toHaveProperty('url');
    expect(typeof info.url).toBe('string');
  });

  it('returns an object with description field', () => {
    const info = getMeetupInfo();
    expect(info).toHaveProperty('description');
    expect(typeof info.description).toBe('string');
  });
});

describe('fetchMeetupInfo', () => {
  beforeEach(() => {
    clearEventsCache();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    clearEventsCache();
  });

  it('returns fallback data when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
    const events = await fetchMeetupInfo();
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);
    expect(events[0]).toHaveProperty('name');
    expect(events[0]).toHaveProperty('date');
  });

  it('returns fallback data when fetch returns non-ok status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => [],
    }));
    const events = await fetchMeetupInfo();
    expect(events.length).toBeGreaterThan(0);
  });

  it('returns fallback data when response is not an array', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ invalid: 'data' }),
    }));
    const events = await fetchMeetupInfo();
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);
  });

  it('returns fetched events when fetch succeeds', async () => {
    const mockEvents = [
      {
        name: 'Test Meetup',
        date: '2026-04-01',
        location: 'Tokyo',
        url: 'https://example.com',
        description: 'Test event',
      },
    ];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockEvents,
    }));
    const events = await fetchMeetupInfo();
    expect(events).toEqual(mockEvents);
  });
});

describe('fetchMeetupInfo validation', () => {
  beforeEach(() => {
    clearEventsCache();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    clearEventsCache();
  });

  it('returns fallback for empty response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => '2' },
      json: () => Promise.resolve([]),
    }));
    const result = await fetchMeetupInfo();
    expect(result.length).toBeGreaterThan(0);
  });

  it('rejects objects missing required fields', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => '100' },
      json: () => Promise.resolve([{ name: 'Test' }]), // missing other fields
    }));
    const result = await fetchMeetupInfo();
    expect(result[0].name).toBe('Claude Code Meetup Japan #3'); // fallback
  });

  it('rejects strings with control characters', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => '200' },
      json: () => Promise.resolve([{
        name: 'Test\x00Event',
        date: '2026-01-01',
        location: 'Tokyo',
        url: 'https://example.com',
        description: 'Test',
      }]),
    }));
    const result = await fetchMeetupInfo();
    expect(result[0].name).toBe('Claude Code Meetup Japan #3'); // fallback due to control chars
  });

  it('rejects oversized responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => '2000000' }, // 2MB
      json: () => Promise.resolve([]),
    }));
    const result = await fetchMeetupInfo();
    expect(result[0].name).toBe('Claude Code Meetup Japan #3'); // fallback
  });

  it('returns fallback on fetch timeout (AbortError)', async () => {
    const abortError = new DOMException('The operation was aborted', 'AbortError');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortError));
    const result = await fetchMeetupInfo();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('name');
  });

  it('returns fallback when json() throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => '100' },
      json: () => Promise.reject(new SyntaxError('Unexpected token')),
    }));
    const result = await fetchMeetupInfo();
    expect(result[0].name).toBe('Claude Code Meetup Japan #3');
  });
});
