import type { PunishSet } from "@/types";
import kazuyaPunishers from "./characters/kazuya.punishers.json";
import larsPunishers from "./characters/lars.punishers.json";
import bryanPunishers from "./characters/bryan.punishers.json";
import jinPunishers from "./characters/jin.punishers.json";
import kingPunishers from "./characters/king.punishers.json";
import dragunovPunishers from "./characters/dragunov.punishers.json";
import stevePunishers from "./characters/steve.punishers.json";
import hwoarangPunishers from "./characters/hwoarang.punishers.json";
import yoshimitsuPunishers from "./characters/yoshimitsu.punishers.json";

/**
 * Punish-sheet registry. Each file is Wavu Wiki's curated punisher table for
 * that character, baked at authoring time by `scripts/fetch-punishers.mjs`
 * and diffable against the live wiki via `npm run verify:punishers`.
 *
 * These deliberately store only what the punisher page adds on top of the
 * move — which disadvantage it answers, the combo, the footnotes. Damage and
 * frames come from the frame table, so there is still one source of truth per
 * number and a patch updates both surfaces at once.
 */
const punishers: Record<string, PunishSet> = {
  kazuya: kazuyaPunishers as PunishSet,
  lars: larsPunishers as PunishSet,
  bryan: bryanPunishers as PunishSet,
  jin: jinPunishers as PunishSet,
  king: kingPunishers as PunishSet,
  dragunov: dragunovPunishers as PunishSet,
  steve: stevePunishers as PunishSet,
  hwoarang: hwoarangPunishers as PunishSet,
  yoshimitsu: yoshimitsuPunishers as PunishSet,
};

export function getPunishers(characterId: string): PunishSet | undefined {
  return punishers[characterId];
}

/** Frames of disadvantage as a number, for sorting. "-25+ (stagger)" -> 25. */
export function enemyFrames(enemy: string | null): number {
  if (!enemy) return Number.POSITIVE_INFINITY;
  const match = /(\d+)/.exec(enemy);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}
