import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { SCHEMA_VERSION } from "@/lib/store";
import { buildExport, parseImport } from "@/lib/export";
import { normalize } from "@/lib/live-frames";

/**
 * The two places the app takes input it did not create: a progress file a
 * person hands it, and frame values fetched from a wiki anyone can edit.
 * Neither can be trusted, and neither failure would be loud — a bad import
 * corrupts a save, a bad live value renders as fact.
 */

describe("parseImport", () => {
  const valid = JSON.stringify({
    app: "dojo-sequence",
    schemaVersion: SCHEMA_VERSION,
    characters: { king: { items: { "forward-dash": { status: "learned" } } } },
  });

  test("accepts a well-formed export", () => {
    const result = parseImport(valid);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.itemCount, 1);
    assert.equal(result.characters.king.items["forward-dash"].status, "learned");
  });

  test("rejects malformed JSON without throwing", () => {
    for (const bad of ["", "{", "not json", "[1,2,3]", "null"]) {
      const result = parseImport(bad);
      assert.equal(result.ok, false, `should reject ${JSON.stringify(bad)}`);
    }
  });

  test("rejects a file from a different app", () => {
    const result = parseImport(
      JSON.stringify({ app: "some-other-app", schemaVersion: 1, characters: {} }),
    );
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.match(result.error, /Dojo Sequence/);
  });

  /**
   * Forwards-incompatible is the dangerous direction: a newer export may hold
   * fields this build would silently drop, so it is refused rather than
   * half-imported.
   */
  test("refuses an export newer than this build", () => {
    const result = parseImport(
      JSON.stringify({
        app: "dojo-sequence",
        schemaVersion: SCHEMA_VERSION + 1,
        characters: { king: { items: { a: { status: "learned" } } } },
      }),
    );
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.match(result.error, /newer than this app supports/);
  });

  test("accepts an older export, because migration handles it", () => {
    const result = parseImport(
      JSON.stringify({
        app: "dojo-sequence",
        schemaVersion: 1,
        characters: { kazuya: { items: { ewgf: { status: "learned", reps: 30 } } } },
      }),
    );
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.ok(!("reps" in result.characters.kazuya.items.ewgf));
  });

  test("rejects an export with no actual progress in it", () => {
    for (const payload of [
      { app: "dojo-sequence", schemaVersion: SCHEMA_VERSION, characters: {} },
      { app: "dojo-sequence", schemaVersion: SCHEMA_VERSION, characters: { king: {} } },
    ]) {
      assert.equal(parseImport(JSON.stringify(payload)).ok, false);
    }
  });

  test("drops junk entries instead of importing them", () => {
    const result = parseImport(
      JSON.stringify({
        app: "dojo-sequence",
        schemaVersion: SCHEMA_VERSION,
        characters: {
          king: {
            items: {
              good: { status: "learned" },
              bad: "<script>alert(1)</script>",
              worse: { status: { nested: "object" } },
            },
          },
        },
      }),
    );
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.itemCount, 2, "the string entry is dropped; the object degrades");
    assert.equal(result.characters.king.items.worse.status, "not-started");
    assert.ok(!("bad" in result.characters.king.items));
  });

  test("an export of the app's own state imports cleanly", () => {
    const exported = buildExport({
      schemaVersion: SCHEMA_VERSION,
      activeCharacterId: "king",
      characters: { king: { characterId: "king", items: { a: { status: "learned", learnedAt: 1, lastPracticedAt: 1, lastReviewedAt: 1 } } } },
      activeSession: null,
      lastSessionResult: null,
      quizStats: {},
      knowledgeStats: {},
      settings: { reducedMotion: false, mirrorClips: true, haptics: true },
    });
    const result = parseImport(JSON.stringify(exported));
    assert.equal(result.ok, true);
  });
});

/**
 * `normalize` decides whether a value pulled from Wavu is allowed to render.
 * React escapes text, so this is defence in depth rather than the only guard —
 * but it is the line that keeps a vandalised cell from becoming UI content.
 */
describe("normalize (live wiki values)", () => {
  test("accepts the frame values that actually occur", () => {
    for (const value of ["-13", "+9", "+9c", "i15~16", "+34a (+24)", "0", "-14~-13", "+8g"]) {
      assert.equal(normalize(value), value, `${value} should be allowed through`);
    }
  });

  test("unwraps the wiki links Wavu embeds in values", () => {
    assert.equal(normalize("[[Steve_combos#Staples|+61a]]"), "+61a");
    assert.equal(normalize("[[+59a]]"), "+59a");
  });

  test("collapses whitespace and treats empty as absent", () => {
    assert.equal(normalize("  -13  "), "-13");
    assert.equal(normalize("+34a   (+24)"), "+34a (+24)");
    assert.equal(normalize(""), null);
    assert.equal(normalize("   "), null);
    assert.equal(normalize(null), null);
    assert.equal(normalize(undefined), null);
  });

  test("refuses anything that is not a frame value", () => {
    for (const hostile of [
      "<script>alert(1)</script>",
      "<img src=x onerror=alert(1)>",
      'javascript:alert("x")',
      "-13<b>bold</b>",
      "{{template}}",
      "https://example.com",
      "DROP TABLE moves",
    ]) {
      assert.equal(normalize(hostile), null, `${hostile} must be rejected`);
    }
  });

  test("caps the length so a wall of text cannot render", () => {
    assert.equal(normalize("1".repeat(32)), "1".repeat(32));
    assert.equal(normalize("1".repeat(33)), null);
  });

  test("a rejected value falls back rather than throwing", () => {
    assert.doesNotThrow(() => normalize({ toString: () => "<script>" }));
    assert.equal(normalize(12345), "12345", "numbers stringify to valid values");
  });
});
