import { test, describe } from "node:test";
import assert from "node:assert/strict";
import type { MoveFrames } from "@/types";
import {
  advantage,
  heightOf,
  isLaunch,
  matchesQuery,
  sortMoves,
  startupFrames,
  traitsOf,
} from "@/lib/move-traits";

/**
 * These functions turn Wavu's exact strings into the numbers and categories
 * the movelist filters and sorts by. Everything they touch is a string that
 * looks like a number without being one — "i15~16", "+34a (+24)", ",i13" —
 * and a misread here is silent: the move simply does not appear under the
 * filter that should have found it, which nobody notices in a list of 166.
 */
function move(over: Partial<MoveFrames> = {}): MoveFrames {
  return {
    wavuId: "Test-1",
    input: "1",
    name: "Jab",
    level: "h",
    startup: "i10",
    block: "+1",
    hit: "+8",
    ch: null,
    damage: "5",
    damageTotal: 5,
    notes: [],
    ...over,
  };
}

describe("heightOf", () => {
  test("reads the FIRST hit, which is what you block", () => {
    // "m,h" is a mid: standing-block it or the mid hits you.
    assert.equal(heightOf(move({ level: "m,h" })), "mid");
    assert.equal(heightOf(move({ level: "h,h,m" })), "high");
    assert.equal(heightOf(move({ level: "l,m" })), "low");
  });

  test("treats every flavour of low as a low", () => {
    // l = low, L = unblockable standing, sl = special low (crouch jab).
    for (const level of ["l", "L", "sl", "SL"]) {
      assert.equal(heightOf(move({ level })), "low", level);
    }
  });

  test("recognises throws however they are written", () => {
    assert.equal(heightOf(move({ level: "th(h)" })), "throw");
    assert.equal(heightOf(move({ level: "t" })), "throw");
    assert.equal(heightOf(move({ level: "m,th" })), "mid", "a mid that ends in a throw is blocked as a mid");
  });

  /**
   * Wavu leaves the target off a few string parents, so the chained level can
   * begin with an empty segment. Reading that literally filed 231 moves under
   * "special", where no height filter could reach them.
   */
  test("skips an empty leading segment rather than giving up", () => {
    assert.equal(heightOf(move({ level: ",t" })), "throw");
    assert.equal(heightOf(move({ level: ",m,h" })), "mid");
    assert.equal(heightOf(move({ level: ",,l" })), "low");
  });

  test("anything else is special rather than guessed at", () => {
    assert.equal(heightOf(move({ level: "sp" })), "special");
    assert.equal(heightOf(move({ level: "" })), "special");
    assert.equal(heightOf(move({ level: "m!" })), "special", "unblockables are not ordinary mids");
  });
});

describe("startupFrames", () => {
  test("takes the first frame of a range", () => {
    assert.equal(startupFrames(move({ startup: "i15~16" })), 15);
    assert.equal(startupFrames(move({ startup: "i10" })), 10);
  });

  /**
   * Wavu marks a string's continuation with a leading comma, and that value is
   * when THAT HIT comes out — not when the move started. Filtering "i10 or
   * faster" on it would offer a 3-hit string as a i13 punisher.
   */
  test("uses the string's real startup, not the hit's", () => {
    assert.equal(
      startupFrames(move({ startup: ",i13", displayStartup: "i10 (string)" })),
      10,
    );
  });

  test("is null rather than zero when there is nothing to read", () => {
    assert.equal(startupFrames(move({ startup: null })), null);
    assert.equal(startupFrames(move({ startup: ",i13", displayStartup: undefined })), null);
    assert.equal(startupFrames(move({ startup: "—" })), null);
  });
});

describe("advantage", () => {
  test("reads the leading signed value", () => {
    assert.equal(advantage("+34a (+24)"), 34);
    assert.equal(advantage("-13"), -13);
    assert.equal(advantage("+0c"), 0);
  });

  test("ignores values that do not start with a sign", () => {
    // "HE/+9" describes a Heat route, not this move's own block value.
    assert.equal(advantage("HE/+9"), null);
    assert.equal(advantage("KND"), null);
    assert.equal(advantage(null), null);
  });
});

describe("isLaunch", () => {
  test("an aerial state is a launch", () => {
    assert.equal(isLaunch("+59a"), true);
    assert.equal(isLaunch("+70a (+54)"), true);
  });

  test("plain advantage is not", () => {
    assert.equal(isLaunch("+9"), false);
    assert.equal(isLaunch("+13cg"), false);
    assert.equal(isLaunch(null), false);
  });
});

describe("traitsOf", () => {
  test("a launcher on hit is not also counted as a CH launcher", () => {
    const t = traitsOf(move({ hit: "+59a", ch: "+70a" }));
    assert.ok(t.includes("launcher"));
    assert.ok(!t.includes("ch-launcher"), "one or the other, never both");
  });

  test("counter-hit-only launchers are their own category", () => {
    const t = traitsOf(move({ hit: "+5", ch: "+59a" }));
    assert.ok(t.includes("ch-launcher"));
    assert.ok(!t.includes("launcher"));
  });

  test("safety is judged against the fastest punish in the game", () => {
    // Nothing punishes faster than i10, so -9 is safe and -10 is not.
    assert.ok(traitsOf(move({ block: "-9" })).includes("safe"));
    assert.ok(!traitsOf(move({ block: "-10" })).includes("safe"));
    assert.ok(!traitsOf(move({ block: "-10" })).includes("launch-punishable"));
    assert.ok(traitsOf(move({ block: "-15" })).includes("launch-punishable"));
  });

  test("plus on block excludes zero", () => {
    assert.ok(traitsOf(move({ block: "+1" })).includes("plus-on-block"));
    assert.ok(!traitsOf(move({ block: "+0c" })).includes("plus-on-block"));
    assert.ok(traitsOf(move({ block: "+0c" })).includes("safe"));
  });

  test("properties come from the notes, whatever their casing", () => {
    // Wavu writes "Heat Engager"; the hand-written tables wrote "heat engager".
    assert.ok(traitsOf(move({ notes: ["Heat Engager"] })).includes("heat-engager"));
    assert.ok(traitsOf(move({ notes: ["heat engager"] })).includes("heat-engager"));
    assert.ok(traitsOf(move({ notes: ["Homing"] })).includes("homing"));
    assert.ok(traitsOf(move({ notes: ["Tornado"] })).includes("tornado"));
  });
});

describe("matchesQuery", () => {
  const df1 = move({ input: "df+1", name: "Entrails Smash", notes: ["Homing"] });

  test("finds a move by the notation people actually type", () => {
    assert.equal(matchesQuery(df1, "df1"), true, "nobody types the plus");
    assert.equal(matchesQuery(df1, "df+1"), true);
    assert.equal(matchesQuery(df1, "DF1"), true);
  });

  test("finds a move by name and by property", () => {
    assert.equal(matchesQuery(df1, "entrails"), true);
    assert.equal(matchesQuery(df1, "homing"), true);
  });

  test("an empty query matches everything", () => {
    assert.equal(matchesQuery(df1, ""), true);
    assert.equal(matchesQuery(df1, "   "), true);
  });

  test("does not match unrelated input", () => {
    assert.equal(matchesQuery(df1, "hellsweep"), false);
    assert.equal(matchesQuery(df1, "ws2"), false);
  });
});

describe("sortMoves", () => {
  const entries: [string, MoveFrames][] = [
    ["slow", move({ startup: "i20", block: "-13", damageTotal: 30 })],
    ["fast", move({ startup: "i10", block: "+1", damageTotal: 5 })],
    ["nostartup", move({ startup: null, block: null, damageTotal: null })],
  ];

  test("movelist order is left exactly as authored", () => {
    assert.deepEqual(
      sortMoves(entries, "movelist").map(([k]) => k),
      ["slow", "fast", "nostartup"],
    );
  });

  /**
   * Every sort has to be total. A move with no value for the active key sinks
   * to the bottom — scattering them through the list makes the sort look broken.
   */
  test("moves with no value sink, whatever the key", () => {
    for (const key of ["startup", "block", "damage"] as const) {
      const order = sortMoves(entries, key).map(([k]) => k);
      assert.equal(order.at(-1), "nostartup", `${key} should sink the empty row`);
    }
  });

  test("fastest, best on block, and biggest damage each lead", () => {
    assert.equal(sortMoves(entries, "startup")[0][0], "fast");
    assert.equal(sortMoves(entries, "block")[0][0], "fast");
    assert.equal(sortMoves(entries, "damage")[0][0], "slow");
  });

  test("does not mutate the array it was given", () => {
    const original = [...entries];
    sortMoves(entries, "startup");
    assert.deepEqual(entries, original);
  });
});
