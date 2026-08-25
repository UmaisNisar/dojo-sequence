import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildLadder, slotForKey, MAX_LADDER_KEYS } from "@/lib/punish-ladder";
import { kazuya } from "@/data/characters/kazuya";
import { lars } from "@/data/characters/lars";
import { bryan } from "@/data/characters/bryan";
import { jin } from "@/data/characters/jin";
import { king } from "@/data/characters/king";
import { dragunov } from "@/data/characters/dragunov";
import { steve } from "@/data/characters/steve";
import { hwoarang } from "@/data/characters/hwoarang";

const characters = [kazuya, lars, bryan, jin, king, dragunov, steve, hwoarang];

/**
 * The drill resolves a question's answer with `ladder.indexOf(...)`. If the
 * answer is not in the ladder that returns -1, no button matches, and every
 * answer is silently wrong — nothing throws and nothing looks broken. These
 * run against the real curricula because that is where the data can drift.
 */
describe("punish ladder", () => {
  test("is derived in first-seen order, without duplicates", () => {
    const ladder = buildLadder([
      { id: "a", prompt: "-10", situation: "", options: ["1,2", "4"], correctIndex: 0, explain: "" },
      { id: "b", prompt: "-12", situation: "", options: ["b+2", "4"], correctIndex: 1, explain: "" },
      { id: "c", prompt: "-14", situation: "", options: ["1,2", "x"], correctIndex: 0, explain: "" },
    ]);
    assert.deepEqual(ladder, ["1,2", "4"], "the repeat of 1,2 must not add an entry");
  });

  test("an empty question set yields an empty ladder", () => {
    assert.deepEqual(buildLadder([]), []);
  });

  for (const character of characters) {
    describe(character.name, () => {
      const questions = character.punishQuiz ?? [];
      const ladder = buildLadder(questions);

      test("has a punish quiz", () => {
        assert.ok(questions.length > 0, "every shipped character needs one");
      });

      test("every answer is reachable on the ladder", () => {
        for (const q of questions) {
          const answer = q.options[q.correctIndex];
          assert.ok(
            ladder.includes(answer),
            `${q.id}: answer ${JSON.stringify(answer)} is not on the ladder`,
          );
          assert.notEqual(ladder.indexOf(answer), -1);
        }
      });

      /**
       * Ten digit keys, so ten entries is the ceiling. Go past it and the
       * extra entries are tappable but not typeable — invisible to anyone
       * testing with a mouse.
       */
      test(`fits the ${MAX_LADDER_KEYS} digit keys`, () => {
        assert.ok(
          ladder.length <= MAX_LADDER_KEYS,
          `ladder is ${ladder.length}; entries past ${MAX_LADDER_KEYS} cannot be typed`,
        );
      });

      test("every ladder entry is reachable by a key", () => {
        for (let slot = 0; slot < ladder.length; slot++) {
          const key = slot === 9 ? "0" : String(slot + 1);
          assert.equal(
            slotForKey(key, ladder.length),
            slot,
            `entry ${slot} (${ladder[slot]}) should answer to "${key}"`,
          );
        }
      });

      test("questions are well formed", () => {
        for (const q of questions) {
          assert.ok(q.options.length >= 2, `${q.id}: needs options`);
          assert.ok(
            q.correctIndex >= 0 && q.correctIndex < q.options.length,
            `${q.id}: correctIndex out of range`,
          );
          assert.equal(
            new Set(q.options).size,
            q.options.length,
            `${q.id}: duplicate options make two buttons correct`,
          );
          assert.ok(q.prompt.trim(), `${q.id}: needs a prompt`);
          assert.ok(q.explain.trim(), `${q.id}: needs an explanation`);
        }
      });

      /**
       * The reason the ladder exists: the drill was measuring reading speed.
       * Long entries put that back.
       */
      test("entries stay short enough to scan", () => {
        for (const entry of ladder) {
          assert.ok(
            entry.length <= 20,
            `${JSON.stringify(entry)} is ${entry.length} chars — too long to read under a timer`,
          );
        }
      });
    });
  }
});

describe("slotForKey", () => {
  test("maps 1-9 to the first nine entries", () => {
    for (let n = 1; n <= 9; n++) {
      assert.equal(slotForKey(String(n), 10), n - 1);
    }
  });

  test("maps 0 to the tenth entry", () => {
    assert.equal(slotForKey("0", 10), 9);
  });

  test("ignores digits past the end of the ladder", () => {
    assert.equal(slotForKey("9", 4), null);
    assert.equal(slotForKey("0", 4), null);
    assert.equal(slotForKey("5", 5), 4);
    assert.equal(slotForKey("6", 5), null);
  });

  test("ignores everything that is not a digit", () => {
    for (const key of ["a", "Enter", " ", "F1", "", "-", "10"]) {
      assert.equal(slotForKey(key, 10), null, `${JSON.stringify(key)} should be ignored`);
    }
  });
});
