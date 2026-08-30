/**
 * Cross-checks written claims against the frame tables they describe.
 *
 * The frame tables are verified against Wavu by `verify:frames`, and the quiz
 * is verified against the tables by `verify:quiz` — but the prose was not
 * checked against anything. A player reported that Steve's counter-hit route
 * omitted the Flicker cancel it depends on, and the same omission sat in that
 * move's hand-written note. Nothing would have caught either.
 *
 * Two checks:
 *
 *   1. A note attached to a move must not contradict that move's own row.
 *      "-14 on block" on a move the table says is -13 is simply wrong.
 *
 *   2. A frame value quoted in an item's prose should appear somewhere in the
 *      moves that item references. This one is advisory: prose legitimately
 *      quotes punish thresholds ("at -14 you get a launch") that are about the
 *      opponent, not about your own move. Findings are printed for review
 *      rather than failing the run.
 *
 * Run: npm run verify:claims
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/* Read from the registry rather than a hand-kept list: a character that
   was added but not listed here would be silently unverified, which is
   exactly the failure this script exists to prevent. */
import { characters } from "../src/data/characters/index.ts";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Every signed frame number a row states, in any field. */
function valuesOf(move) {
  const bag = new Set();
  for (const field of ["startup", "displayStartup", "block", "hit", "ch"]) {
    const v = move[field];
    if (!v) continue;
    for (const m of String(v).matchAll(/[+-]?\d+/g)) bag.add(m[0].replace(/^\+/, ""));
  }
  return bag;
}

/**
 * A note may legitimately state a number the row does not, when it describes
 * something other than the plain move:
 *
 *   - a conditional variant (bluespark, powered up, in Heat, "if only the
 *     first hit is blocked")
 *   - a stance transition, which carries its own block/hit/CH values
 *   - a string's first hit, when the row stores the last hit's startup — Wavu
 *     marks those rows with a leading comma
 *
 * Without these the check drowns in false positives and stops being read,
 * which is worse than not having it.
 */
const conditional = (note) =>
  /bluespark|powered? up|absorb|in heat|heat dash|on wall|wall hit|if only|when .*(hit|block)|buffered|transition|press [a-z,+]+ to|enter |on average|may range/i.test(note);

/**
 * Notes that are never about this move's own frames, whatever number they
 * carry — comparing them to the row is meaningless rather than merely
 * uncertain, so they are skipped per note rather than exempting the move:
 *
 *   "Interrupt with i3"      — the gap the OPPONENT needs, not this startup
 *   "Actual startup i14"     — Wavu's clarification for rows that store an
 *                              input window instead (the Mishima electrics)
 *   "13f effective punish"   — what this move is worth as a punisher
 *   "effective startup i26"  — startup INCLUDING the sidestep in front of it,
 *                              which is not the row's own value
 *   "~i5-6 backsway"         — when an evasive property is ACTIVE, which has
 *                              nothing to do with when the move hits
 */
const aboutAnotherMeasure = (note) =>
  /^\s*interrupt with\b|actual startup|effective (?:startup|punish)|backsway/i.test(
    note,
  );

/**
 * True when n falls inside any figure the startup string states.
 * "i16~17" covers 17; plain string matching cannot see that.
 */
function withinStartup(startup, n) {
  const nums = [...String(startup).matchAll(/\d+/g)].map((m) => Number(m[0]));
  if (!nums.length) return true;
  return n >= Math.min(...nums) && n <= Math.max(...nums);
}

const hardFailures = [];
const advisories = [];

for (const character of characters) {
  const framesPath = path.join(ROOT, "src/data/characters", `${character.id}.frames.json`);
  if (!fs.existsSync(framesPath)) continue;
  const table = JSON.parse(fs.readFileSync(framesPath, "utf8")).moves;

  /* ---- Check 1: a move's notes vs its own row ---- */
  for (const [key, move] of Object.entries(table)) {
    const block = move.block ? String(move.block) : null;
    const ch = move.ch ? String(move.ch) : null;
    const startup = move.startup ? String(move.startup) : null;
    const notes = move.notes ?? [];

    /* A move that documents a powered-up or absorbed-attack variant anywhere
       in its notes may legitimately state a second set of frames. The context
       usually sits in a sibling note ("Power up if an attack is absorbed"),
       not in the line quoting the number, so this is judged per move. */
    const hasVariant = notes.some((n) => conditional(n));
    /* Wavu marks per-hit startups on string rows with a leading comma; a note
       about the string's first hit is then not comparable to the row. */
    const perHit = String(startup ?? "").trim().startsWith(",");

    for (const note of notes) {
      // Measuring a different thing, or explicitly describing a variant.
      if (aboutAnotherMeasure(note) || conditional(note)) continue;
      if (!hasVariant) {
        for (const m of note.matchAll(/([+-]\d+)[a-z]*\s+on\s+block/gi)) {
          if (block && !block.includes(m[1])) {
            hardFailures.push(
              `${character.id}/${key}: note says "${m[1]} on block" but the table says "${block}"`,
            );
          }
        }
        for (const m of note.matchAll(/\bCH\s+([+-]\d+)/gi)) {
          if (ch && !ch.includes(m[1])) {
            hardFailures.push(
              `${character.id}/${key}: note says "CH ${m[1]}" but the table says "${ch}"`,
            );
          }
        }
      }
      if (!perHit && !hasVariant) {
        for (const m of note.matchAll(/\bi(\d+)\b/g)) {
          if (startup && !withinStartup(startup, Number(m[1]))) {
            hardFailures.push(
              `${character.id}/${key}: note says "i${m[1]}" but startup is "${startup}"`,
            );
          }
        }
      }
    }
  }

  /* ---- Check 2: item prose vs the moves it references ---- */
  for (const stage of character.stages) {
    for (const item of stage.items) {
      const keys = item.moveKeys ?? [];
      if (keys.length === 0) continue;
      const known = new Set();
      for (const k of keys) {
        const move = table[k];
        if (!move) continue;
        for (const v of valuesOf(move)) known.add(v);
      }
      const prose = [item.purpose, item.whenToUse, item.leverlessTip]
        .filter(Boolean)
        .join(" ");

      for (const m of prose.matchAll(/(?:^|[\s(])([+-]\d+)(?![\d])/g)) {
        const raw = m[1];
        const norm = raw.replace(/^\+/, "");
        if (known.has(norm)) continue;
        advisories.push(
          `${character.id}/${stage.number}/${item.id}: prose quotes "${raw}" — not in ${keys.join(", ")}`,
        );
      }
      for (const m of prose.matchAll(/\bi(\d+)\b/g)) {
        if (known.has(m[1])) continue;
        advisories.push(
          `${character.id}/${stage.number}/${item.id}: prose quotes "i${m[1]}" — not in ${keys.join(", ")}`,
        );
      }
    }
  }
}

console.log(`\nChecked ${characters.length} characters.`);

if (advisories.length) {
  console.log(`\n${advisories.length} advisory (review by eye — punish thresholds are legitimate):`);
  advisories.forEach((a) => console.log("  ? " + a));
}

if (hardFailures.length) {
  console.error(`\n${hardFailures.length} note(s) contradict their own row:\n`);
  hardFailures.forEach((f) => console.error("  ✗ " + f));
  process.exit(1);
}

console.log("\nNo note contradicts the frame table.");
