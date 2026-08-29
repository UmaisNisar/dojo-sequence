import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { characters } from "@/data/characters";
import { getFrameData } from "@/data/frames";
import { getPunishers, enemyFrames } from "@/data/punishers";
import { getCombos } from "@/data/combos";
import { buildThreatSheet, punishFor } from "@/lib/threats";
import { damageOf } from "../scripts/wavu-damage.mjs";

/**
 * The three reference screens — movelist, punishers, combos — and the matchup
 * sheet all render from baked wiki data joined to the frame tables by key.
 * `verify:punishers` and `verify:combos` check that data against the wiki;
 * these check the joins and the derivations, which the wiki cannot know about
 * and which fail silently: a broken `moveKey` renders a row with no numbers,
 * not an error.
 */

const withFrames = characters.filter((c) => getFrameData(c.id));

/**
 * The damage column is written four different ways and only one of them adds
 * up. Summing every digit turned King's Giant Swing — a 45-damage throw —
 * into 170, and it rendered that way on the movelist before anyone noticed.
 */
describe("damageOf", () => {
  test("sums a string's per-hit damage", () => {
    assert.equal(damageOf("5,8,12"), 25);
    assert.equal(damageOf(",15"), 15);
  });

  test("a bracketed perfect-input value is an alternative, not an addition", () => {
    assert.equal(damageOf("45(50)"), 45);
    assert.equal(damageOf("40(45)"), 40);
  });

  test("slash-separated variants take the plain one", () => {
    assert.equal(damageOf("23/27/34"), 23);
    assert.equal(damageOf("40/42/52"), 40);
  });

  test("handles both notations at once", () => {
    // King's Giant Swing: 45 base, 50 on bluespark, 70,5 as a variant.
    assert.equal(damageOf("45(50)/70,5"), 45);
  });

  /**
   * Two notations that both looked like sums and were not. Every character's
   * Heat Burst claimed 24 damage instead of 12 until this was pinned.
   */
  test("a bracketed pair is damage; recoverable, not two hits", () => {
    assert.equal(damageOf("[12;12]"), 12);
  });

  test("a per-hit range takes its low end", () => {
    // Devil Jin's Rage Art scales with health: 10-15, then 3-5, then 42-60.
    assert.equal(damageOf("10-15,3-5,42-60"), 55);
  });

  test("nothing is zero, not NaN", () => {
    assert.equal(damageOf(null), 0);
    assert.equal(damageOf(""), 0);
    assert.equal(damageOf("—"), 0);
  });
});


describe("frame tables", () => {
  test("every shipped character has one", () => {
    assert.equal(withFrames.length, characters.length);
  });

  for (const character of withFrames) {
    describe(character.name, () => {
      const set = getFrameData(character.id)!;

      test("every curriculum moveKey resolves", () => {
        for (const stage of character.stages) {
          for (const item of stage.items) {
            for (const key of item.moveKeys ?? []) {
              assert.ok(
                set.moves[key],
                `${item.id} references "${key}", which is not in the table`,
              );
            }
          }
        }
      });

      test("no two keys are the same move", () => {
        const seen = new Map<string, string>();
        for (const [key, move] of Object.entries(set.moves)) {
          const prev = seen.get(move.wavuId);
          assert.equal(
            prev,
            undefined,
            `${move.wavuId} is in the table twice: "${prev}" and "${key}"`,
          );
          seen.set(move.wavuId, key);
        }
      });

      test("no move claims implausible damage", () => {
        for (const [key, move] of Object.entries(set.moves)) {
          if (move.damageTotal === null) continue;
          // Rage Arts top out around 70; anything past 100 is a parsing bug,
          // which is exactly how Giant Swing came to claim 170.
          assert.ok(
            move.damageTotal <= 100,
            `${key} claims ${move.damageTotal} damage from "${move.damage}"`,
          );
        }
      });

      /**
       * `damage` is that hit's damage and `damageTotal` is the whole move's.
       * Rendering the wrong one under-reports every string in the app, which
       * is exactly the bug the totals were added to fix.
       */
      test("a string's total is at least its last hit", () => {
        for (const [key, move] of Object.entries(set.moves)) {
          if (move.damageTotal === null || !move.damage) continue;
          const last = damageOf(move.damage);
          assert.ok(
            move.damageTotal >= last,
            `${key}: total ${move.damageTotal} is below its own ${last}`,
          );
        }
      });
    });
  }
});

describe("punish sheets", () => {
  for (const character of withFrames) {
    describe(character.name, () => {
      const punishers = getPunishers(character.id);
      const set = getFrameData(character.id)!;

      test("exists and has standing punishers", () => {
        assert.ok(punishers, "every character needs a punish sheet");
        assert.ok((punishers?.sections.standing.length ?? 0) > 0);
      });

      test("every moveKey resolves in the frame table", () => {
        const entries = [
          ...Object.values(punishers!.sections).flat(),
          ...punishers!.whiff,
        ];
        for (const entry of entries) {
          if (!entry.moveKey) continue;
          assert.ok(
            set.moves[entry.moveKey],
            `punisher "${entry.moveKey}" is not in the frame table`,
          );
        }
      });

      /** A row with neither a key nor an input has nothing at all to render. */
      test("every entry can be identified", () => {
        const entries = [
          ...Object.values(punishers!.sections).flat(),
          ...punishers!.whiff,
        ];
        for (const entry of entries) {
          assert.ok(
            entry.moveKey || entry.input,
            "entry has no moveKey and no input",
          );
        }
      });

      test("every block punisher states the disadvantage it answers", () => {
        for (const entry of punishers!.sections.standing) {
          assert.ok(entry.enemy, `${entry.moveKey ?? entry.input}: no enemy value`);
          assert.ok(
            Number.isFinite(enemyFrames(entry.enemy)),
            `${entry.enemy} does not parse to a frame count`,
          );
        }
      });
    });
  }
});

describe("punishFor", () => {
  const king = getPunishers("king")!;

  /**
   * The right punisher is the biggest one that still fits. A -12 tool is the
   * answer to a -13 gap; the -15 launcher would simply not come out in time,
   * and recommending it is worse than recommending nothing.
   */
  test("picks the largest punisher that fits the gap", () => {
    const at12 = punishFor(king, "-12");
    assert.ok(at12);
    assert.equal(enemyFrames(at12.enemy), 12);

    const at13 = punishFor(king, "-13");
    assert.ok(at13);
    assert.equal(enemyFrames(at13.enemy), 12, "no -13 entry, so -12 is the answer");
  });

  test("never recommends a punisher that would not reach", () => {
    for (const block of ["-10", "-11", "-12", "-13", "-14", "-15", "-20"]) {
      const pick = punishFor(king, block);
      if (!pick) continue;
      assert.ok(
        enemyFrames(pick.enemy) <= Math.abs(Number(block)),
        `${block}: recommended a ${pick.enemy} punisher`,
      );
    }
  });

  test("declines when there is nothing to punish", () => {
    assert.equal(punishFor(king, "-9"), null, "safe is safe");
    assert.equal(punishFor(king, "+5"), null);
    assert.equal(punishFor(king, null), null);
    assert.equal(punishFor(king, "KND"), null, "unparseable is not a gap");
    assert.equal(punishFor(undefined, "-15"), null);
  });
});

describe("threat sheets", () => {
  for (const character of withFrames) {
    describe(character.name, () => {
      const groups = buildThreatSheet(getFrameData(character.id)!);

      test("has something to say", () => {
        assert.ok(groups.length > 0);
      });

      test("no group is rendered empty", () => {
        for (const group of groups) {
          assert.ok(group.moves.length > 0, `${group.kind} is empty but present`);
        }
      });

      test("fast lows are lows, and are fast", () => {
        const lows = groups.find((g) => g.kind === "fast-low");
        for (const { move } of lows?.moves ?? []) {
          const level = move.level.split(",")[0].toLowerCase();
          assert.ok(
            level === "l" || level === "sl",
            `${move.input} is "${move.level}", not a low`,
          );
        }
      });

      /** The whole promise of the group: block it and you get a launch. */
      test("free launches really are launch-punishable", () => {
        const launches = groups.find((g) => g.kind === "free-launch");
        for (const { move } of launches?.moves ?? []) {
          const block = Number(/^([+-]\d+)/.exec(move.block ?? "")?.[1]);
          assert.ok(block <= -15, `${move.input} is ${move.block} on block`);
        }
      });

      test("their turn means genuinely plus", () => {
        const plus = groups.find((g) => g.kind === "their-turn");
        for (const { move } of plus?.moves ?? []) {
          const block = Number(/^([+-]\d+)/.exec(move.block ?? "")?.[1]);
          assert.ok(block > 0, `${move.input} is ${move.block} on block`);
        }
      });
    });
  }
});

describe("combos", () => {
  for (const character of withFrames) {
    describe(character.name, () => {
      const set = getCombos(character.id);
      const frames = getFrameData(character.id)!;

      test("exists and has routes", () => {
        assert.ok(set, "every character needs combos");
        const routes = set!.sections.reduce(
          (n, s) => n + s.groups.reduce((m, g) => m + g.routes.length, 0),
          0,
        );
        assert.ok(routes > 0);
      });

      test("every starter moveKey resolves", () => {
        for (const section of set!.sections) {
          for (const group of section.groups) {
            for (const starter of group.starters) {
              if (!starter.moveKey) continue;
              assert.ok(
                frames.moves[starter.moveKey],
                `starter "${starter.label}" points at missing "${starter.moveKey}"`,
              );
            }
          }
        }
      });

      /**
       * A group with no starters has nothing to file its routes under, and a
       * group with no routes renders a header over empty space. The parser
       * drops both, so finding one means the parser regressed.
       */
      test("no group is half-formed", () => {
        for (const section of set!.sections) {
          for (const group of section.groups) {
            assert.ok(group.starters.length > 0, `${section.id}: routes with no starter`);
            assert.ok(group.routes.length > 0, `${section.id}: starter with no routes`);
          }
        }
      });

      test("no route is an editor placeholder", () => {
        for (const section of set!.sections) {
          for (const group of section.groups) {
            for (const route of group.routes) {
              assert.ok(route.notation.trim().length > 0);
              assert.ok(
                !/combo (?:when|for|here)|big boy/i.test(route.notation),
                `${section.id}: placeholder survived — "${route.notation}"`,
              );
            }
          }
        }
      });
    });
  }
});
