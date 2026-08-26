import type { FrameDataSet, MoveFrames, PunishEntry, PunishSet } from "@/types";
import { enemyFrames } from "@/data/punishers";
import { advantage, heightOf, startupFrames, traitsOf } from "./move-traits";

/**
 * The other half of the game: what the opponent is doing to you.
 *
 * Every curriculum in the app teaches your own character. Nothing told you
 * what to expect from the fighter across from you — which low you have to
 * respect, when it is genuinely their turn, and what you get for blocking.
 *
 * All of it is derived from the same verified frame tables the lessons use,
 * so a matchup sheet cannot say something the move rows do not.
 */

export type ThreatKind =
  | "fast-low"
  | "their-turn"
  | "free-launch"
  | "homing"
  | "heat-engager"
  | "throw";

export interface ThreatGroup {
  kind: ThreatKind;
  title: string;
  /** What this group means for the person on the receiving end. */
  advice: string;
  moves: { key: string; move: MoveFrames }[];
}

/** A low fast enough that you cannot react to it — you guess or you eat it. */
const FAST_LOW_STARTUP = 20;

/** -15 is where a launch becomes available for most of the cast. */
const LAUNCH_PUNISHABLE = -15;

export function buildThreatSheet(set: FrameDataSet): ThreatGroup[] {
  const entries = Object.entries(set.moves).map(([key, move]) => ({ key, move }));

  const bySpeed = (a: { move: MoveFrames }, b: { move: MoveFrames }) =>
    (startupFrames(a.move) ?? 99) - (startupFrames(b.move) ?? 99);

  const fastLows = entries
    .filter(({ move }) => {
      const startup = startupFrames(move);
      return (
        heightOf(move) === "low" && startup !== null && startup <= FAST_LOW_STARTUP
      );
    })
    .sort(bySpeed);

  const theirTurn = entries
    .filter(({ move }) => (advantage(move.block) ?? -99) > 0)
    .sort((a, b) => (advantage(b.move.block) ?? 0) - (advantage(a.move.block) ?? 0));

  const freeLaunch = entries
    .filter(({ move }) => {
      const block = advantage(move.block);
      // Throws and unblockables have no meaningful block value to punish.
      return (
        block !== null && block <= LAUNCH_PUNISHABLE && heightOf(move) !== "throw"
      );
    })
    .sort((a, b) => (advantage(a.move.block) ?? 0) - (advantage(b.move.block) ?? 0));

  const homing = entries
    .filter(({ move }) => traitsOf(move).includes("homing"))
    .sort(bySpeed);

  const heatEngagers = entries
    .filter(({ move }) => traitsOf(move).includes("heat-engager"))
    .sort(bySpeed);

  const throws = entries
    .filter(({ move }) => heightOf(move) === "throw")
    .sort(bySpeed);

  const groups: ThreatGroup[] = [
    {
      kind: "fast-low",
      title: "Lows you cannot react to",
      advice:
        "Too fast to see coming. You block these by reading the situation, or you low parry — and the block value is what you get for guessing right.",
      moves: fastLows,
    },
    {
      kind: "their-turn",
      title: "It is genuinely their turn",
      advice:
        "Plus on block. Pressing a button here loses to anything they do next — block, or use a move fast enough to beat the frame gap.",
      moves: theirTurn,
    },
    {
      kind: "free-launch",
      title: "Block this and launch them",
      advice:
        "Launch-punishable on block. This is your whole reward for defending, so know these on sight.",
      moves: freeLaunch,
    },
    {
      kind: "homing",
      title: "Beats your sidestep",
      advice:
        "Homing moves track a step in both directions. If you are being caught while stepping, this is what is catching you.",
      moves: homing,
    },
    {
      kind: "heat-engager",
      title: "Gets them into Heat",
      advice:
        "Blocking these still gives them Heat. Whiffing them does not — sidestep and whiff punish rather than block if you can.",
      moves: heatEngagers,
    },
    {
      kind: "throw",
      title: "Throws",
      advice:
        "Break by the hand that grabs you. The notes carry the break for the ones that are not standard.",
      moves: throws,
    },
  ];

  return groups.filter((g) => g.moves.length > 0);
}

/**
 * Your best answer to a move you just blocked.
 *
 * Picks from YOUR curated punisher list — the largest disadvantage that is
 * still within what they gave you, since a -12 punisher is the right tool for
 * a -13 gap and a -15 launcher simply would not come out in time.
 */
export function punishFor(
  punishers: PunishSet | undefined,
  blockValue: string | null,
): PunishEntry | null {
  const disadvantage = advantage(blockValue);
  if (!punishers || disadvantage === null || disadvantage > -10) return null;
  const gap = Math.abs(disadvantage);

  let best: PunishEntry | null = null;
  let bestFrames = -1;
  for (const entry of punishers.sections.standing ?? []) {
    const frames = enemyFrames(entry.enemy);
    if (!Number.isFinite(frames) || frames > gap) continue;
    if (frames > bestFrames) {
      bestFrames = frames;
      best = entry;
    }
  }
  return best;
}
