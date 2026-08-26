/**
 * The progression engine. Every unlock / completion / "what's next"
 * question is answered here — components never re-implement these rules.
 *
 * Rules:
 * - Stages unlock sequentially: stage N is unlocked when every item in
 *   stage N-1 is learned. Stage 1 is always unlocked.
 * - Items unlock sequentially within an unlocked stage.
 * - An item can only become learned when its drill pass condition is met.
 */

import type {
  Character,
  CharacterProgress,
  CharacterSummary,
  Drill,
  DrillProgress,
  SessionItem,
  Stage,
  StageStatus,
  StageSummary,
  TodayPlan,
  TrainingItem,
} from "@/types";
import { emptyDrillProgress } from "./store";

export function getItemProgress(
  progress: CharacterProgress | undefined,
  itemId: string,
): DrillProgress {
  return progress?.items[itemId] ?? emptyDrillProgress();
}

export function isItemLearned(
  progress: CharacterProgress | undefined,
  itemId: string,
): boolean {
  return getItemProgress(progress, itemId).status === "learned";
}

/* ------------------------------------------------------------------ */
/* Drill pass condition                                                */
/* ------------------------------------------------------------------ */

/** Is the drill's machine-readable pass condition currently satisfied? */

/** 0..1 completion fraction for progress bars. */

/** Human-readable target, e.g. "10 in a row" / "8 of 10". */
export function drillTargetLabel(drill: Drill): string {
  switch (drill.type) {
    case "consecutive-reps":
      return `${drill.target} in a row`;
    case "total-reps":
      return `${drill.target} total reps`;
    case "accuracy":
      return `${drill.required} of ${drill.attempts} attempts`;
    case "manual":
      return `${drill.checklist.length} points internalized`;
    case "timed":
      return `${drill.durationSeconds}s sustained`;
  }
}

/* ------------------------------------------------------------------ */
/* Unlock rules                                                        */
/* ------------------------------------------------------------------ */

export function isStageComplete(
  stage: Stage,
  progress: CharacterProgress | undefined,
): boolean {
  return stage.items.every((item) => isItemLearned(progress, item.id));
}

export function getStageStatus(
  character: Character,
  progress: CharacterProgress | undefined,
  stageId: string,
): StageStatus {
  const index = character.stages.findIndex((s) => s.id === stageId);
  if (index === -1) return "locked";
  const stage = character.stages[index];
  if (isStageComplete(stage, progress)) return "complete";
  if (index === 0) return "unlocked";
  const previous = character.stages[index - 1];
  return isStageComplete(previous, progress) ? "unlocked" : "locked";
}

export function isItemUnlocked(
  character: Character,
  progress: CharacterProgress | undefined,
  itemId: string,
): boolean {
  const stage = character.stages.find((s) =>
    s.items.some((i) => i.id === itemId),
  );
  if (!stage) return false;
  const status = getStageStatus(character, progress, stage.id);
  if (status === "locked") return false;
  const index = stage.items.findIndex((i) => i.id === itemId);
  // Sequential within the stage: everything before it must be learned.
  return stage.items
    .slice(0, index)
    .every((item) => isItemLearned(progress, item.id));
}

/* ------------------------------------------------------------------ */
/* Lookup helpers                                                      */
/* ------------------------------------------------------------------ */

export function allItems(character: Character): TrainingItem[] {
  return character.stages.flatMap((s) => s.items);
}

export function findItem(
  character: Character,
  itemId: string,
): { item: TrainingItem; stage: Stage } | null {
  for (const stage of character.stages) {
    const item = stage.items.find((i) => i.id === itemId);
    if (item) return { item, stage };
  }
  return null;
}

/**
 * The lesson that teaches a given frame-table move, if any.
 *
 * The reference screens (movelist, punishers, combos) all want to link a move
 * back to where it is taught, and each of them walking the curriculum itself
 * is how three copies of the same rule end up disagreeing.
 */
export function findLessonForMove(
  character: Character,
  moveKey: string | null,
): { item: TrainingItem; stage: Stage } | null {
  if (!moveKey) return null;
  for (const stage of character.stages) {
    for (const item of stage.items) {
      if (item.moveKeys?.includes(moveKey)) return { item, stage };
    }
  }
  return null;
}

/** Its URL, or null when nothing teaches it. */
export function lessonHref(
  character: Character,
  moveKey: string | null,
): string | null {
  const found = findLessonForMove(character, moveKey);
  return found
    ? `/training/${character.id}/stage/${found.stage.number}/item/${found.item.id}`
    : null;
}

/** The single next item the player should work on, in curriculum order. */
export function getNextItem(
  character: Character,
  progress: CharacterProgress | undefined,
): TrainingItem | null {
  for (const item of allItems(character)) {
    if (!isItemLearned(progress, item.id)) return item;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Summaries                                                           */
/* ------------------------------------------------------------------ */

export function summarizeCharacter(
  character: Character,
  progress: CharacterProgress | undefined,
): CharacterSummary {
  const stages: StageSummary[] = character.stages.map((stage) => ({
    stage,
    status: getStageStatus(character, progress, stage.id),
    learnedCount: stage.items.filter((i) => isItemLearned(progress, i.id)).length,
    totalCount: stage.items.length,
  }));

  const learnedCount = stages.reduce((n, s) => n + s.learnedCount, 0);
  const totalCount = stages.reduce((n, s) => n + s.totalCount, 0);

  const active = stages.find((s) => s.status === "unlocked");
  const currentStageNumber = active
    ? active.stage.number
    : character.stages.length > 0
      ? character.stages[character.stages.length - 1].number
      : 0;

  return { learnedCount, totalCount, currentStageNumber, stages };
}

/* ------------------------------------------------------------------ */
/* Today / retention                                                   */
/* ------------------------------------------------------------------ */

/**
 * Pick learned items due for review. Prefers items that haven't been
 * practiced or reviewed recently; earlier-stage items break ties so the
 * fundamentals keep getting reps.
 */
export function pickRetentionItems(
  character: Character,
  progress: CharacterProgress | undefined,
  count: number,
  now: number,
): TrainingItem[] {
  const stageIndexOf = new Map<string, number>();
  character.stages.forEach((s, i) => {
    for (const item of s.items) stageIndexOf.set(item.id, i);
  });

  const learned = allItems(character).filter((i) =>
    isItemLearned(progress, i.id),
  );

  const scored = learned.map((item) => {
    const p = getItemProgress(progress, item.id);
    const lastTouched = Math.max(
      p.lastReviewedAt ?? 0,
      p.lastPracticedAt ?? 0,
      p.learnedAt ?? 0,
    );
    const staleness = now - lastTouched; // larger = more overdue
    const stageBonus =
      (character.stages.length - (stageIndexOf.get(item.id) ?? 0)) *
      6 * 60 * 60 * 1000; // earlier stages count as ~6h staler per stage
    return { item, score: staleness + stageBonus };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.item);
}

export function buildTodayPlan(
  character: Character,
  progress: CharacterProgress | undefined,
  now: number,
): TodayPlan {
  const nextUp: TrainingItem[] = [];
  for (const item of allItems(character)) {
    if (!isItemLearned(progress, item.id)) {
      nextUp.push(item);
      if (nextUp.length === 3) break;
    }
  }
  const retention = pickRetentionItems(character, progress, 2, now);
  return { nextUp, retention };
}

export function buildSessionItems(plan: TodayPlan): SessionItem[] {
  return [
    ...plan.nextUp.map((i) => ({
      itemId: i.id,
      kind: "learn" as const,
      completed: false,
      skipped: false,
    })),
    ...plan.retention.map((i) => ({
      itemId: i.id,
      kind: "retention" as const,
      completed: false,
      skipped: false,
    })),
  ];
}
