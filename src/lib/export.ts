import type { CharacterProgress, ExportedProgress, PersistedState } from "@/types";
import { SCHEMA_VERSION, sanitizeCharacterProgress } from "./store";

export function buildExport(state: PersistedState): ExportedProgress {
  return {
    app: "dojo-sequence",
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    characters: state.characters,
  };
}

export type ImportResult =
  | { ok: true; characters: Record<string, CharacterProgress>; itemCount: number }
  | { ok: false; error: string };

/**
 * Validate an imported JSON string. Never trusts the payload:
 * unknown fields are dropped, malformed entries are discarded,
 * wrong schema/app is rejected outright.
 */
export function parseImport(json: string): ImportResult {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return { ok: false, error: "That file isn't valid JSON." };
  }

  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { ok: false, error: "That file doesn't look like a Dojo Sequence export." };
  }

  const obj = raw as Record<string, unknown>;

  if (obj.app !== "dojo-sequence") {
    return { ok: false, error: "That file wasn't exported from Dojo Sequence." };
  }

  if (typeof obj.schemaVersion !== "number") {
    return { ok: false, error: "The export is missing its schema version." };
  }

  if (obj.schemaVersion > SCHEMA_VERSION) {
    return {
      ok: false,
      error: `This export uses schema v${obj.schemaVersion}, which is newer than this app supports (v${SCHEMA_VERSION}).`,
    };
  }

  if (
    typeof obj.characters !== "object" ||
    obj.characters === null ||
    Array.isArray(obj.characters)
  ) {
    return { ok: false, error: "The export contains no progress data." };
  }

  const characters: Record<string, CharacterProgress> = {};
  let itemCount = 0;
  for (const [id, cp] of Object.entries(obj.characters as Record<string, unknown>)) {
    const clean = sanitizeCharacterProgress(id, cp);
    characters[id] = clean;
    itemCount += Object.keys(clean.items).length;
  }

  if (itemCount === 0) {
    return { ok: false, error: "The export contains no training progress." };
  }

  return { ok: true, characters, itemCount };
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
