import { test, describe } from "node:test";
import assert from "node:assert/strict";
import type { Character, CharacterProgress, Stage, TrainingItem } from "@/types";
import {
  allItems,
  findItem,
  getNextItem,
  getStageStatus,
  isItemUnlocked,
  isStageComplete,
  summarizeCharacter,
} from "@/lib/progression";

/**
 * Progression is the engine every screen reads from, and its bugs do not look
 * like bugs — the Complete button simply goes nowhere, or a stage stays locked
 * that should not. Both of those actually shipped.
 *
 * A synthetic curriculum is used rather than a real character so these tests
 * describe the rules, and do not start failing because King gained an item.
 */
function item(stageId: string, id: string): TrainingItem {
  return {
    id,
    stageId,
    name: id,
    notation: "1",
    purpose: "p",
    whenToUse: "w",
    leverlessTip: "l",
    drill: { type: "total-reps", target: 5, rep: "r" },
  };
}

function stage(number: number, id: string, itemIds: string[]): Stage {
  return {
    id,
    number,
    name: id,
    focus: "f",
    description: "d",
    items: itemIds.map((i) => item(id, i)),
  };
}

const character: Character = {
  id: "test",
  name: "Test",
  style: "s",
  tagline: "t",
  available: true,
  stages: [
    stage(1, "one", ["a1", "a2"]),
    stage(2, "two", ["b1", "b2"]),
  ],
};

const learned = (...ids: string[]): CharacterProgress => ({
  characterId: "test",
  items: Object.fromEntries(
    ids.map((id) => [
      id,
      { status: "learned" as const, lastPracticedAt: 1, lastReviewedAt: 1, learnedAt: 1 },
    ]),
  ),
});

const NOTHING = undefined;

describe("unlock rules", () => {
  test("a fresh save opens the first item and nothing else", () => {
    assert.equal(isItemUnlocked(character, NOTHING, "a1"), true);
    assert.equal(isItemUnlocked(character, NOTHING, "a2"), false);
    assert.equal(isItemUnlocked(character, NOTHING, "b1"), false);
  });

  test("items unlock one at a time inside a stage", () => {
    const p = learned("a1");
    assert.equal(isItemUnlocked(character, p, "a2"), true);
    assert.equal(isItemUnlocked(character, p, "b1"), false, "stage 2 needs stage 1 finished");
  });

  test("finishing a stage opens the next one", () => {
    const p = learned("a1", "a2");
    assert.equal(isStageComplete(character.stages[0], p), true);
    assert.equal(getStageStatus(character, p, "two"), "unlocked");
    assert.equal(isItemUnlocked(character, p, "b1"), true);
    assert.equal(isItemUnlocked(character, p, "b2"), false);
  });

  /**
   * Learning a later item without its predecessors should not open the gate —
   * otherwise an imported or hand-edited save could skip the curriculum.
   */
  test("a later item learned out of order does not unlock the stage", () => {
    const p = learned("a2");
    assert.equal(isStageComplete(character.stages[0], p), false);
    assert.equal(getStageStatus(character, p, "two"), "locked");
    assert.equal(isItemUnlocked(character, p, "b1"), false);
  });

  test("stage status reports complete once every item is learned", () => {
    assert.equal(getStageStatus(character, NOTHING, "one"), "unlocked");
    assert.equal(getStageStatus(character, NOTHING, "two"), "locked");
    assert.equal(getStageStatus(character, learned("a1", "a2"), "one"), "complete");
  });

  test("an unknown item or stage is locked, not crashed on", () => {
    assert.equal(isItemUnlocked(character, NOTHING, "nope"), false);
    assert.equal(getStageStatus(character, NOTHING, "nope"), "locked");
  });
});

describe("getNextItem", () => {
  test("walks the curriculum in order", () => {
    assert.equal(getNextItem(character, NOTHING)?.id, "a1");
    assert.equal(getNextItem(character, learned("a1"))?.id, "a2");
    assert.equal(getNextItem(character, learned("a1", "a2"))?.id, "b1");
  });

  test("returns null when everything is learned", () => {
    assert.equal(getNextItem(character, learned("a1", "a2", "b1", "b2")), null);
  });

  /**
   * This is the trap that broke the Complete button. getNextItem returns the
   * next UNLEARNED item — so while you are sitting on an unlearned item, it
   * returns the one you are already on, and "next" goes nowhere. The item page
   * has to use a positional lookup instead, and this test exists so nobody
   * "simplifies" it back.
   */
  test("returns the item you are on when that item is unlearned", () => {
    const onA1 = getNextItem(character, NOTHING);
    assert.equal(onA1?.id, "a1", "not a bug — but it is why ItemDetailView is positional");
  });
});

describe("lookup helpers", () => {
  test("allItems flattens in curriculum order", () => {
    assert.deepEqual(allItems(character).map((i) => i.id), ["a1", "a2", "b1", "b2"]);
  });

  test("findItem returns the item with its stage", () => {
    const found = findItem(character, "b2");
    assert.equal(found?.item.id, "b2");
    assert.equal(found?.stage.number, 2);
    assert.equal(findItem(character, "nope"), null);
  });
});

describe("summarizeCharacter", () => {
  test("counts learned against the total", () => {
    const s = summarizeCharacter(character, learned("a1", "a2", "b1"));
    assert.equal(s.totalCount, 4);
    assert.equal(s.learnedCount, 3);
  });

  test("a fresh save summarises as nothing learned", () => {
    const s = summarizeCharacter(character, NOTHING);
    assert.equal(s.learnedCount, 0);
    assert.equal(s.totalCount, 4);
  });

  test("per-stage counts add up to the totals", () => {
    const s = summarizeCharacter(character, learned("a1", "a2", "b1"));
    assert.deepEqual(
      s.stages.map((x) => [x.learnedCount, x.totalCount]),
      [[2, 2], [1, 2]],
    );
    assert.equal(
      s.stages.reduce((n, x) => n + x.learnedCount, 0),
      s.learnedCount,
    );
  });

  test("reports a status for every stage", () => {
    const s = summarizeCharacter(character, learned("a1", "a2"));
    assert.equal(s.stages.length, 2);
    assert.equal(s.stages[0].status, "complete");
    assert.equal(s.stages[1].status, "unlocked");
  });

  /** Drives the "Stage 03 / 08" readout, so an off-by-one here is visible. */
  test("current stage is the furthest unlocked one", () => {
    assert.equal(summarizeCharacter(character, NOTHING).currentStageNumber, 1);
    assert.equal(summarizeCharacter(character, learned("a1", "a2")).currentStageNumber, 2);
  });

  test("a finished curriculum reports the last stage, not zero", () => {
    const s = summarizeCharacter(character, learned("a1", "a2", "b1", "b2"));
    assert.equal(s.learnedCount, s.totalCount);
    assert.equal(s.currentStageNumber, 2);
  });
});
