import type { QuizQuestion } from "@/types";

/**
 * The punish ladder — every answer a character's drill can have, in a fixed
 * order, shown for the whole run.
 *
 * Pure and free of runtime imports so it can be tested directly. The invariant
 * that matters is quiet when it breaks: the drill finds a question's answer
 * with `ladder.indexOf(...)`, so an answer missing from the ladder yields -1
 * and no button on screen is ever correct. Nothing throws; every answer is
 * simply wrong.
 */
export function buildLadder(questions: QuizQuestion[]): string[] {
  const seen = new Set<string>();
  const ladder: string[] = [];
  for (const q of questions) {
    const answer = q.options[q.correctIndex];
    if (answer && !seen.has(answer)) {
      seen.add(answer);
      ladder.push(answer);
    }
  }
  return ladder;
}

/**
 * Digit keys answer the drill. There are ten of them, so 1-9 map to the first
 * nine entries and 0 maps to the tenth — without that, a tenth ladder entry
 * is reachable by tap but not by keyboard, which is exactly the sort of gap
 * nobody notices on a desktop with a mouse.
 */
export const MAX_LADDER_KEYS = 10;

/** Ladder index for a pressed key, or null when the key means nothing here. */
export function slotForKey(key: string, ladderLength: number): number | null {
  if (!/^[0-9]$/.test(key)) return null;
  const slot = key === "0" ? 9 : Number(key) - 1;
  return slot < ladderLength ? slot : null;
}
