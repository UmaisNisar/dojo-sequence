import type { MoveFrames } from "@/types";

/**
 * Reading a frame row the way a player does.
 *
 * The frame tables store Wavu's exact strings — "i15~16", "+34a (+24)",
 * ",i13" — because anything else would stop being verifiable against the
 * source. Everything that wants to *filter* or *sort* by those values needs
 * numbers and categories, and that translation lives here so it is done once
 * and the same way everywhere.
 *
 * Every function tolerates the strings being absent or unparseable: a move
 * with no startup is not a fast move, it is a move with no startup.
 */

export type MoveHeight = "high" | "mid" | "low" | "throw" | "special";

export const HEIGHT_LABEL: Record<MoveHeight, string> = {
  high: "High",
  mid: "Mid",
  low: "Low",
  throw: "Throw",
  special: "Special",
};

/**
 * The height a move must be BLOCKED at — which is its first hit, not its last.
 * "m,h" is a mid: you block it standing or you get hit by the mid.
 */
export function heightOf(move: MoveFrames): MoveHeight {
  const level = (move.level ?? "").trim().toLowerCase();
  if (!level) return "special";
  if (level.startsWith("th") || level.includes("(h)")) return "throw";
  /* Take the first segment that says anything. A handful of Wavu rows list no
     target on the parent of a string, which leaves a leading empty segment —
     reading that literally files the move under "special" and hides it from
     every height filter. */
  const first = level.split(",").map((s) => s.trim()).find(Boolean) ?? "";
  if (first.startsWith("t")) return "throw";
  if (first.startsWith("sp")) return "special";
  // Wavu writes lows as "l" and unblockable-while-standing lows as "L";
  // "sl" is a special low (crouch jab). All three are ducked the same way.
  if (first === "l" || first === "sl") return "low";
  if (first === "m") return "mid";
  if (first === "h") return "high";
  return "special";
}

/**
 * Startup in frames, as a number. Ranges take the FIRST value ("i15~16" -> 15)
 * because that is when the move can first hit — the figure a punish decision
 * is made on.
 *
 * Returns null for string continuations (Wavu marks them with a leading comma)
 * — the row stores that hit's own startup, which is not when the move began.
 */
export function startupFrames(move: MoveFrames): number | null {
  const raw = move.startup;
  if (!raw) return null;
  const source = raw.trim().startsWith(",")
    ? (move.displayStartup ?? "")
    : raw;
  const match = /i?(\d+)/.exec(source);
  return match ? Number(match[1]) : null;
}

/** The leading signed number of a frame value: "+34a (+24)" -> 34, "-13" -> -13. */
export function advantage(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = /^\s*([+-]\d+)/.exec(value);
  return match ? Number(match[1]) : null;
}

/** A launch: Wavu suffixes the aerial state with `a`, as in "+59a". */
export function isLaunch(value: string | null | undefined): boolean {
  return !!value && /[+-]?\d+a\b/.test(value);
}

export type MoveTrait =
  | "launcher"
  | "ch-launcher"
  | "homing"
  | "heat-engager"
  | "tornado"
  | "power-crush"
  | "plus-on-block"
  | "safe"
  | "launch-punishable";

export const TRAIT_LABEL: Record<MoveTrait, string> = {
  launcher: "Launcher",
  "ch-launcher": "CH launcher",
  homing: "Homing",
  "heat-engager": "Heat engager",
  tornado: "Tornado",
  "power-crush": "Power crush",
  "plus-on-block": "Plus on block",
  safe: "Safe",
  "launch-punishable": "Launch punishable",
};

/** A note matches loosely — Wavu writes "Heat Engager", the app wrote "heat engager". */
const hasNote = (move: MoveFrames, needle: string) =>
  move.notes.some((n) => n.toLowerCase().includes(needle));

export function traitsOf(move: MoveFrames): MoveTrait[] {
  const traits: MoveTrait[] = [];
  const block = advantage(move.block);

  if (isLaunch(move.hit)) traits.push("launcher");
  else if (isLaunch(move.ch)) traits.push("ch-launcher");
  if (hasNote(move, "homing")) traits.push("homing");
  if (hasNote(move, "heat engager")) traits.push("heat-engager");
  if (hasNote(move, "tornado")) traits.push("tornado");
  if (hasNote(move, "power crush")) traits.push("power-crush");

  if (block !== null) {
    if (block > 0) traits.push("plus-on-block");
    // -9 is the floor for safety: nobody punishes faster than i10.
    else if (block >= -9) traits.push("safe");
    else if (block <= -15) traits.push("launch-punishable");
  }
  return traits;
}

/**
 * Free-text match over the fields a player would actually type: the notation,
 * the move's name, and its properties. Deliberately punctuation-insensitive on
 * the input side so "df1" finds "df+1" — nobody types the plus.
 */
export function matchesQuery(move: MoveFrames, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const loose = (s: string) => s.toLowerCase().replace(/[^a-z0-9~]/g, "");
  const looseQuery = loose(q);
  return (
    move.name.toLowerCase().includes(q) ||
    move.input.toLowerCase().includes(q) ||
    (looseQuery.length > 0 && loose(move.input).includes(looseQuery)) ||
    move.notes.some((n) => n.toLowerCase().includes(q))
  );
}

export type MoveSort = "movelist" | "startup" | "block" | "damage";

/** Highest damage first. The table carries the summed total for strings. */
function damageOf(move: MoveFrames): number {
  return move.damageTotal ?? 0;
}

/**
 * Sorting has to be stable and total: moves with no value for the active sort
 * key sink to the bottom rather than scattering through the list.
 */
export function sortMoves(
  entries: [string, MoveFrames][],
  sort: MoveSort,
): [string, MoveFrames][] {
  if (sort === "movelist") return entries;
  const sorted = [...entries];
  const rank = (m: MoveFrames): number => {
    switch (sort) {
      case "startup":
        return startupFrames(m) ?? Number.POSITIVE_INFINITY;
      case "block":
        return -(advantage(m.block) ?? Number.NEGATIVE_INFINITY);
      case "damage":
        return -damageOf(m);
    }
  };
  sorted.sort((a, b) => rank(a[1]) - rank(b[1]));
  return sorted;
}
