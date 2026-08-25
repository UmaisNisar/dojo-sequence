/**
 * Runtime frame-data freshness — the browser-side counterpart of
 * `npm run verify:frames`.
 *
 * While the app is open it quietly queries Wavu Wiki's public API (CORS is
 * enabled for anonymous requests), diffs the live values against the bundled
 * table, and returns overrides for anything a patch changed. Results are
 * cached in localStorage and refreshed at most once a day, and only for a
 * character actually being viewed — so a visitor costs Wavu a handful of
 * requests a day at most, and nothing at all if they never open a curriculum.
 *
 * Live values are sanitized against a strict whitelist before they can ever
 * render — a vandalized wiki cell becomes a discarded value, not UI content.
 */

import type { FrameDataSet } from "@/types";

export interface LiveFrameOverride {
  startup?: string;
  block?: string;
  hit?: string;
  ch?: string | null;
}

export interface LiveFramesState {
  status: "idle" | "checking" | "ok" | "error";
  /** Epoch ms of the last completed check (success or failure). */
  checkedAt: number | null;
  /** moveKey → changed fields. Empty object = live matches bundled. */
  overrides: Record<string, LiveFrameOverride>;
}

const API = "https://wavu.wiki/w/api.php";
/** Ids per Cargo query. 50 keeps the URL ~1.3 KB and the round trips few. */
const BATCH = 50;
const SUCCESS_TTL = 24 * 60 * 60 * 1000; // re-check daily
const FAILURE_TTL = 2 * 60 * 60 * 1000; // retry sooner after a failure

const cacheKey = (characterId: string) =>
  `dojo-sequence:live-frames:${characterId}`;

/* ------------------------------------------------------------------ */
/* Sanitization                                                        */
/* ------------------------------------------------------------------ */

/** Frame values are short strings of digits, signs, and a few letters. */
const VALUE_RE = /^[0-9+\-iacdgs~(),./?!\s]{1,32}$/i;

/**
 * Exported for tests. This is the boundary that decides whether a value
 * fetched from a wiki anyone can edit is allowed to render, so it is worth
 * pinning down explicitly rather than only exercising through the network.
 */
export function normalize(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const cleaned = String(value)
    .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, "$1")
    .replace(/\[\[([^\]]*)\]\]/g, "$1")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned === "") return null;
  return VALUE_RE.test(cleaned) ? cleaned : null;
}

/* ------------------------------------------------------------------ */
/* Fetch + diff                                                        */
/* ------------------------------------------------------------------ */

interface LiveRow {
  id: string;
  startup?: string | null;
  block?: string | null;
  hit?: string | null;
  ch?: string | null;
}

async function fetchRows(wavuIds: string[]): Promise<Map<string, LiveRow>> {
  const rows = new Map<string, LiveRow>();
  for (let i = 0; i < wavuIds.length; i += BATCH) {
    const batch = wavuIds.slice(i, i + BATCH);
    const where = `id IN (${batch
      .map((id) => `'${id.replace(/'/g, "''")}'`)
      .join(",")})`;
    const url = new URL(API);
    url.searchParams.set("action", "cargoquery");
    url.searchParams.set("tables", "Move");
    url.searchParams.set("fields", "id,startup,block,hit,ch");
    url.searchParams.set("where", where);
    url.searchParams.set("limit", String(BATCH));
    url.searchParams.set("format", "json");
    url.searchParams.set("origin", "*"); // MediaWiki anonymous CORS
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Wavu API ${res.status}`);
    const json: {
      error?: { info?: string };
      cargoquery?: { title: LiveRow }[];
    } = await res.json();
    if (json.error) throw new Error(json.error.info ?? "Wavu API error");
    for (const row of json.cargoquery ?? []) {
      // Wavu can list one id twice: a blank string-header row alongside the real
      // move row (e.g. Bryan-b+3). Always keep the row carrying frame data.
      const existing = rows.get(row.title.id);
      if (existing && existing.startup && !row.title.startup) continue;
      rows.set(row.title.id, row.title);
    }
  }
  return rows;
}

/** Diff the live database against a bundled table. */
export async function checkLiveFrames(
  set: FrameDataSet,
): Promise<Record<string, LiveFrameOverride>> {
  const entries = Object.entries(set.moves);
  const live = await fetchRows(entries.map(([, m]) => m.wavuId));
  const overrides: Record<string, LiveFrameOverride> = {};

  for (const [key, move] of entries) {
    const row = live.get(move.wavuId);
    if (!row) continue; // renamed/removed — needs the full dev-time verifier
    const isString = move.wavuId.split("-").slice(1).join("-").includes(",");
    const diff: LiveFrameOverride = {};

    const block = normalize(row.block);
    if (block !== null && block !== normalize(move.block)) diff.block = block;

    const hit = normalize(row.hit);
    if (hit !== null && hit !== normalize(move.hit)) diff.hit = hit;

    const ch = normalize(row.ch);
    if ((ch ?? null) !== (normalize(move.ch) ?? null) && ch !== null)
      diff.ch = ch;

    // String rows store per-hit startups on Wavu — skip those, same as the
    // dev-time verifier.
    if (!isString) {
      const startup = normalize(row.startup);
      if (startup !== null && startup !== normalize(move.startup))
        diff.startup = startup;
    }

    if (Object.keys(diff).length > 0) overrides[key] = diff;
  }
  return overrides;
}

/* ------------------------------------------------------------------ */
/* Cache                                                               */
/* ------------------------------------------------------------------ */

interface CachedCheck {
  checkedAt: number;
  ok: boolean;
  overrides: Record<string, LiveFrameOverride>;
}

function sanitizeOverrides(
  raw: unknown,
): Record<string, LiveFrameOverride> {
  const out: Record<string, LiveFrameOverride> = {};
  if (typeof raw !== "object" || raw === null) return out;
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value !== "object" || value === null) continue;
    const v = value as Record<string, unknown>;
    const clean: LiveFrameOverride = {};
    for (const field of ["startup", "block", "hit", "ch"] as const) {
      const s = normalize(v[field]);
      if (s !== null) clean[field] = s;
    }
    if (Object.keys(clean).length > 0) out[key] = clean;
  }
  return out;
}

export function loadCachedCheck(characterId: string): CachedCheck | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(cacheKey(characterId));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const p = parsed as Record<string, unknown>;
    if (typeof p.checkedAt !== "number" || !Number.isFinite(p.checkedAt))
      return null;
    return {
      checkedAt: p.checkedAt,
      ok: Boolean(p.ok),
      overrides: sanitizeOverrides(p.overrides),
    };
  } catch {
    return null;
  }
}

export function saveCachedCheck(characterId: string, check: CachedCheck): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(cacheKey(characterId), JSON.stringify(check));
  } catch {
    // Cache is best-effort.
  }
}

/** Is a cached check still fresh enough to skip the network? */
export function isCheckFresh(check: CachedCheck, now: number): boolean {
  return now - check.checkedAt < (check.ok ? SUCCESS_TTL : FAILURE_TTL);
}
