import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  SCHEMA_VERSION,
  emptyState,
  sanitizeDrillProgress,
  sanitizeState,
} from "@/lib/store";

/**
 * Persistence is the one place in this app where a bug is silent and
 * permanent: a sanitizer that drops a field does not throw, it just quietly
 * loses months of somebody's progress on their next page load. Every schema
 * change so far has gone through here, so this is where they get pinned.
 */
describe("sanitizeState", () => {
  test("garbage in gives a usable state rather than throwing", () => {
    for (const junk of [null, undefined, 0, "", "nope", [], true]) {
      const state = sanitizeState(junk);
      assert.equal(state.schemaVersion, SCHEMA_VERSION);
      assert.deepEqual(state.characters, {});
      assert.equal(state.activeSession, null);
    }
  });

  test("keeps learned items and drops malformed ones", () => {
    const state = sanitizeState({
      characters: {
        king: {
          items: {
            "forward-dash": { status: "learned", learnedAt: 1700000000000 },
            "backdash": { status: "not-started" },
            "junk-a": "not an object",
            "junk-b": null,
            "junk-c": 42,
          },
        },
      },
    });
    const items = state.characters.king.items;
    assert.equal(items["forward-dash"].status, "learned");
    assert.equal(items["forward-dash"].learnedAt, 1700000000000);
    assert.equal(items["backdash"].status, "not-started");
    assert.ok(!("junk-a" in items), "string item should be dropped");
    assert.ok(!("junk-b" in items), "null item should be dropped");
    assert.ok(!("junk-c" in items), "number item should be dropped");
  });

  /**
   * v1 tracked reps and had a "drilling" status; v2 removed both. A real v1
   * save has to survive the trip with its learned items intact — that is the
   * only part a player would actually notice losing.
   */
  test("migrates a v1 save without losing learned progress", () => {
    const v1 = {
      schemaVersion: 1,
      activeCharacterId: "kazuya",
      characters: {
        kazuya: {
          items: {
            ewgf: {
              status: "learned",
              reps: 40,
              bestStreak: 9,
              attempts: 60,
              hits: 41,
              checked: [true, false],
              elapsedSeconds: 900,
              learnedAt: 1690000000000,
            },
            "hellsweep": { status: "drilling", reps: 12 },
          },
        },
      },
      settings: { reducedMotion: true },
    };
    const state = sanitizeState(v1);
    const items = state.characters.kazuya.items;

    assert.equal(state.schemaVersion, SCHEMA_VERSION);
    assert.equal(state.activeCharacterId, "kazuya");
    assert.equal(items.ewgf.status, "learned", "learned must survive migration");
    assert.equal(items.ewgf.learnedAt, 1690000000000);
    // The counting fields are gone from the type and must not be carried over.
    for (const dead of ["reps", "bestStreak", "attempts", "hits", "checked", "elapsedSeconds"]) {
      assert.ok(!(dead in items.ewgf), `${dead} should not survive`);
    }
    // "drilling" is no longer a status; it must degrade, not persist.
    assert.equal(items.hellsweep.status, "not-started");
    assert.equal(state.settings.reducedMotion, true);
  });

  /**
   * Both of these shipped after people already had saves. Absent has to mean
   * on, or every existing user silently gets the feature switched off.
   */
  describe("settings added after launch default to on", () => {
    test("absent means enabled", () => {
      const state = sanitizeState({ settings: { reducedMotion: false } });
      assert.equal(state.settings.mirrorClips, true);
      assert.equal(state.settings.haptics, true);
    });

    test("an explicit false is still respected", () => {
      const state = sanitizeState({
        settings: { reducedMotion: false, mirrorClips: false, haptics: false },
      });
      assert.equal(state.settings.mirrorClips, false);
      assert.equal(state.settings.haptics, false);
    });

    test("a missing settings object does not disable them", () => {
      const state = sanitizeState({ characters: {} });
      assert.equal(state.settings.mirrorClips, true);
      assert.equal(state.settings.haptics, true);
    });
  });

  test("rejects nonsense timestamps instead of rendering them", () => {
    const p = sanitizeDrillProgress({
      status: "learned",
      learnedAt: -5,
      lastPracticedAt: Number.NaN,
      lastReviewedAt: "yesterday",
    });
    assert.ok(p);
    assert.equal(p.learnedAt, null);
    assert.equal(p.lastPracticedAt, null);
    assert.equal(p.lastReviewedAt, null);
  });

  test("an unknown status degrades to not-started", () => {
    assert.equal(sanitizeDrillProgress({ status: "mastered" })?.status, "not-started");
    assert.equal(sanitizeDrillProgress({ status: 7 })?.status, "not-started");
    assert.equal(sanitizeDrillProgress({})?.status, "not-started");
  });

  test("a full round trip through sanitize is stable", () => {
    const once = sanitizeState({
      characters: { king: { items: { "forward-dash": { status: "learned" } } } },
      settings: { reducedMotion: true, mirrorClips: false, haptics: false },
      activeCharacterId: "king",
    });
    const twice = sanitizeState(once);
    assert.deepEqual(twice, once, "sanitizing an already-clean state must be a no-op");
  });

  test("emptyState is itself valid input", () => {
    assert.deepEqual(sanitizeState(emptyState()), emptyState());
  });
});
