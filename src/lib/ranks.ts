/**
 * Dojo ranks — flavor for progression, modeled on Tekken's ranked ladder
 * naming. Driven purely by learned-item fraction; no points, no decay.
 */

export interface Rank {
  name: string;
  /** Minimum completion fraction (0..1) to hold this rank. */
  at: number;
}

export const RANKS: Rank[] = [
  { name: "Beginner", at: 0 },
  { name: "1st Dan", at: 0.03 },
  { name: "Fighter", at: 0.1 },
  { name: "Brawler", at: 0.2 },
  { name: "Warrior", at: 0.3 },
  { name: "Garyu", at: 0.42 },
  { name: "Shinryu", at: 0.53 },
  { name: "Tenryu", at: 0.64 },
  { name: "Mighty Ruler", at: 0.75 },
  { name: "Fujin", at: 0.85 },
  { name: "Raijin", at: 0.93 },
  { name: "Tekken King", at: 0.99 },
];

export function rankFor(learned: number, total: number): Rank {
  const fraction = total > 0 ? learned / total : 0;
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (fraction >= rank.at) current = rank;
  }
  return current;
}

/** The next rank up, and how many more items it takes. Null at the top. */
export function nextRank(
  learned: number,
  total: number,
): { rank: Rank; itemsToGo: number } | null {
  const fraction = total > 0 ? learned / total : 0;
  const next = RANKS.find((r) => r.at > fraction);
  if (!next) return null;
  const itemsNeeded = Math.ceil(next.at * total);
  return { rank: next, itemsToGo: Math.max(1, itemsNeeded - learned) };
}
