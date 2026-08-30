import type { ComboSet } from "@/types";
import kazuyaCombos from "./characters/kazuya.combos.json";
import larsCombos from "./characters/lars.combos.json";
import bryanCombos from "./characters/bryan.combos.json";
import jinCombos from "./characters/jin.combos.json";
import kingCombos from "./characters/king.combos.json";
import dragunovCombos from "./characters/dragunov.combos.json";
import steveCombos from "./characters/steve.combos.json";
import hwoarangCombos from "./characters/hwoarang.combos.json";
import yoshimitsuCombos from "./characters/yoshimitsu.combos.json";
import devilJinCombos from "./characters/devil-jin.combos.json";
import victorCombos from "./characters/victor.combos.json";

/**
 * Combo registry. Baked from Wavu's combo pages by
 * `scripts/fetch-combos.mjs`, diffable via `npm run verify:combos`.
 */
const combos: Record<string, ComboSet> = {
  kazuya: kazuyaCombos as ComboSet,
  lars: larsCombos as ComboSet,
  bryan: bryanCombos as ComboSet,
  jin: jinCombos as ComboSet,
  king: kingCombos as ComboSet,
  dragunov: dragunovCombos as ComboSet,
  steve: steveCombos as ComboSet,
  hwoarang: hwoarangCombos as ComboSet,
  yoshimitsu: yoshimitsuCombos as ComboSet,
  "devil-jin": devilJinCombos as ComboSet,
  victor: victorCombos as ComboSet,
};

export function getCombos(characterId: string): ComboSet | undefined {
  return combos[characterId];
}

/**
 * Markers that are events in a combo rather than inputs. Taken from Wavu's
 * own combo-notation legend (Template:Combo notation) — undocumented markers
 * that appear in routes are deliberately left as plain notation rather than
 * given a label this app invented.
 */
export const COMBO_MARKERS: Record<string, string> = {
  "T!": "Tornado",
  "W!": "Wall splat",
  "WB!": "Wall break",
  "F!": "Floor break",
  "BB!": "Balcony break",
};

export function isComboMarker(token: string): boolean {
  return token in COMBO_MARKERS;
}

/** Just the markers a given set of routes actually uses, for the legend. */
export function markersUsed(set: ComboSet): [string, string][] {
  const seen = new Set<string>();
  for (const section of set.sections) {
    for (const group of section.groups) {
      for (const route of group.routes) {
        for (const token of route.notation.split(/\s+/)) {
          if (isComboMarker(token)) seen.add(token);
        }
      }
    }
  }
  return Object.entries(COMBO_MARKERS).filter(([token]) => seen.has(token));
}
