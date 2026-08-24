import type {
  CharacterProgress,
  DrillProgress,
  PersistedState,
} from "@/types";

export const SCHEMA_VERSION = 2;

/** Fallback fighter when no selection has been made yet. */
const DEFAULT_CHARACTER_ID = "kazuya";

const STORAGE_KEY = "dojo-sequence:state";

export function emptyDrillProgress(): DrillProgress {
  return {
    status: "not-started",
    lastPracticedAt: null,
    lastReviewedAt: null,
    learnedAt: null,
  };
}

export function emptyState(): PersistedState {
  return {
    schemaVersion: SCHEMA_VERSION,
    activeCharacterId: DEFAULT_CHARACTER_ID,
    characters: {},
    activeSession: null,
    lastSessionResult: null,
    quizStats: {},
    settings: { reducedMotion: false },
  };
}

/* ------------------------------------------------------------------ */
/* Validation — never blindly deserialize                              */
/* ------------------------------------------------------------------ */

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

const ITEM_STATUSES = ["not-started", "learned"] as const;

function sanitizeNumber(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : fallback;
}

function sanitizeTimestamp(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) && v > 0 ? v : null;
}

export function sanitizeDrillProgress(v: unknown): DrillProgress | null {
  if (!isRecord(v)) return null;
  const status = ITEM_STATUSES.includes(v.status as (typeof ITEM_STATUSES)[number])
    ? (v.status as DrillProgress["status"])
    : "not-started";
  return {
    status,
    lastPracticedAt: sanitizeTimestamp(v.lastPracticedAt),
    lastReviewedAt: sanitizeTimestamp(v.lastReviewedAt),
    learnedAt: sanitizeTimestamp(v.learnedAt),
  };
}

export function sanitizeCharacterProgress(
  characterId: string,
  v: unknown,
): CharacterProgress {
  const items: Record<string, DrillProgress> = {};
  if (isRecord(v) && isRecord(v.items)) {
    for (const [itemId, raw] of Object.entries(v.items)) {
      const clean = sanitizeDrillProgress(raw);
      if (clean) items[itemId] = clean;
    }
  }
  return { characterId, items };
}

/** Parse an unknown blob into a valid PersistedState, dropping anything malformed. */
export function sanitizeState(raw: unknown): PersistedState {
  const state = emptyState();
  if (!isRecord(raw)) return state;

  if (isRecord(raw.characters)) {
    for (const [id, cp] of Object.entries(raw.characters)) {
      state.characters[id] = sanitizeCharacterProgress(id, cp);
    }
  }

  if (isRecord(raw.activeSession)) {
    const s = raw.activeSession;
    const items = Array.isArray(s.items)
      ? s.items
          .filter(isRecord)
          .filter((i) => typeof i.itemId === "string")
          .map((i) => ({
            itemId: i.itemId as string,
            kind: i.kind === "retention" ? ("retention" as const) : ("learn" as const),
            completed: Boolean(i.completed),
            skipped: Boolean(i.skipped),
          }))
      : [];
    if (typeof s.characterId === "string" && items.length > 0) {
      state.activeSession = {
        characterId: s.characterId,
        items,
        currentIndex: Math.min(
          Math.max(0, Math.trunc(sanitizeNumber(s.currentIndex))),
          items.length - 1,
        ),
        startedAt: sanitizeTimestamp(s.startedAt) ?? Date.now(),
      };
    }
  }

  if (isRecord(raw.lastSessionResult)) {
    const r = raw.lastSessionResult;
    const items = Array.isArray(r.items)
      ? r.items
          .filter(isRecord)
          .filter((i) => typeof i.itemId === "string")
          .map((i) => ({
            itemId: i.itemId as string,
            kind: i.kind === "retention" ? ("retention" as const) : ("learn" as const),
            completed: Boolean(i.completed),
            skipped: Boolean(i.skipped),
          }))
      : [];
    if (typeof r.characterId === "string" && items.length > 0) {
      state.lastSessionResult = {
        characterId: r.characterId,
        items,
        startedAt: sanitizeTimestamp(r.startedAt) ?? Date.now(),
        finishedAt: sanitizeTimestamp(r.finishedAt) ?? Date.now(),
      };
    }
  }

  if (isRecord(raw.quizStats)) {
    for (const [id, s] of Object.entries(raw.quizStats)) {
      if (!isRecord(s)) continue;
      state.quizStats[id] = {
        runs: sanitizeNumber(s.runs),
        bestScore: sanitizeNumber(s.bestScore),
        bestAvgMs:
          typeof s.bestAvgMs === "number" && Number.isFinite(s.bestAvgMs) && s.bestAvgMs > 0
            ? s.bestAvgMs
            : null,
      };
    }
  }

  if (typeof raw.activeCharacterId === "string" && raw.activeCharacterId) {
    state.activeCharacterId = raw.activeCharacterId;
  }

  if (isRecord(raw.settings)) {
    state.settings.reducedMotion = Boolean(raw.settings.reducedMotion);
  }

  return state;
}

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

export interface ProgressStore {
  load(): PersistedState;
  save(state: PersistedState): void;
  clear(): void;
}

export class LocalStorageProgressStore implements ProgressStore {
  load(): PersistedState {
    if (typeof window === "undefined") return emptyState();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyState();
      return sanitizeState(JSON.parse(raw));
    } catch {
      // Corrupt JSON or storage unavailable — start clean rather than crash.
      return emptyState();
    }
  }

  save(state: PersistedState): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full/unavailable — progress simply won't persist this write.
    }
  }

  clear(): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}

export const progressStore: ProgressStore = new LocalStorageProgressStore();
