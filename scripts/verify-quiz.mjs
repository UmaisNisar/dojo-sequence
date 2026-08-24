/**
 * Verifies generated quiz questions against the frame tables they came from.
 *
 * The generator builds questions from data rather than hand-authoring them,
 * which means a parsing mistake would not produce an obviously broken app — it
 * would produce a confident, plausible, wrong answer. This re-derives the
 * correct answer independently for every question and fails loudly on:
 *
 *   - an answer that disagrees with the frame table
 *   - two options that are both correct
 *   - duplicate options, or an out-of-range correct index
 *   - "fastest" questions where the answer is not strictly fastest
 *   - inputs that identify more than one move, which no option could resolve
 *
 * Run: npm run verify:quiz
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildQuiz, QUIZ_LENGTH } from "../src/lib/quiz-generator.ts";
/* Imported file by file rather than through the registry: that uses
   extensionless specifiers, which the bundler resolves and plain Node does
   not. Adding a character here is the one manual step this script needs. */
import { kazuya } from "../src/data/characters/kazuya.ts";
import { lars } from "../src/data/characters/lars.ts";
import { bryan } from "../src/data/characters/bryan.ts";
import { jin } from "../src/data/characters/jin.ts";
import { king } from "../src/data/characters/king.ts";
import { dragunov } from "../src/data/characters/dragunov.ts";
import { steve } from "../src/data/characters/steve.ts";

const characters = [kazuya, lars, bryan, jin, king, dragunov, steve];

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RUNS_PER_CHARACTER = 40;

/* Independent re-implementations. Deliberately not imported from the
   generator: sharing the parser would let a parsing bug validate itself. */
const startupOf = (m) => {
  const r = /^i(\d+)/.exec(m.startup ?? "");
  return r ? Number(r[1]) : null;
};
const blockOf = (m) =>
  /^[+-]\d+$/.test((m.block ?? "").trim()) ? m.block.trim() : null;
const levelOf = (m) =>
  ({ h: "High", m: "Mid", l: "Low" })[m.level ?? ""] ?? null;
const launcherOf = (m) => /[+-]?\d+a\b/.test(m.hit ?? "");

const problems = [];
const fail = (character, q, msg) =>
  problems.push(`${character.padEnd(9)} ${(q?.id ?? "-").padEnd(34)} ${msg}`);

let totalQuestions = 0;
const byCategory = {};
const shortRuns = [];

for (const character of characters) {
  const framesPath = path.join(
    ROOT,
    "src/data/characters",
    `${character.id}.frames.json`,
  );
  if (!fs.existsSync(framesPath)) continue;
  const frames = JSON.parse(fs.readFileSync(framesPath, "utf8"));
  const moves = Object.values(frames.moves);

  // An input that names two moves makes any option referencing it ambiguous.
  const byInput = new Map();
  for (const m of moves) {
    if (!byInput.has(m.input)) byInput.set(m.input, []);
    byInput.get(m.input).push(m);
  }
  for (const [input, list] of byInput) {
    if (list.length > 1) {
      fail(
        character.id,
        null,
        `input "${input}" identifies ${list.length} moves: ${list.map((m) => m.wavuId).join(", ")}`,
      );
    }
  }
  const moveByWavuId = new Map(moves.map((m) => [m.wavuId, m]));
  const moveByInput = new Map(moves.map((m) => [m.input, m]));

  // Cold start, half learned, and fully learned all have to hold up.
  const allItems = character.stages.flatMap((s) => s.items);
  const profiles = {
    "nothing learned": {},
    "half learned": Object.fromEntries(
      allItems
        .slice(0, Math.ceil(allItems.length / 2))
        .map((i) => [i.id, { status: "learned" }]),
    ),
    "all learned": Object.fromEntries(
      allItems.map((i) => [i.id, { status: "learned" }]),
    ),
  };

  for (const [profileName, items] of Object.entries(profiles)) {
    const progress = { characterId: character.id, items };
    for (let run = 0; run < RUNS_PER_CHARACTER; run++) {
      const plan = buildQuiz(character, frames, progress, QUIZ_LENGTH);

      if (plan.questions.length < QUIZ_LENGTH) {
        shortRuns.push(
          `${character.id}/${profileName}: ${plan.questions.length}/${QUIZ_LENGTH}`,
        );
      }

      const seen = new Set();
      for (const q of plan.questions) {
        totalQuestions++;
        byCategory[q.category] = (byCategory[q.category] ?? 0) + 1;

        if (seen.has(q.id)) fail(character.id, q, "duplicate question in run");
        seen.add(q.id);

        if (new Set(q.options).size !== q.options.length)
          fail(character.id, q, `duplicate options: ${q.options.join(" | ")}`);
        if (q.correctIndex < 0 || q.correctIndex >= q.options.length) {
          fail(character.id, q, `correctIndex ${q.correctIndex} out of range`);
          continue;
        }
        if (!q.explain || !q.situation || !q.prompt)
          fail(character.id, q, "missing prompt/situation/explain");

        const picked = q.options[q.correctIndex];
        const wavuId = q.id.slice(q.id.indexOf(":") + 1);
        const move = moveByWavuId.get(wavuId);
        if (!move) {
          fail(character.id, q, `no move for id ${wavuId}`);
          continue;
        }

        switch (q.category) {
          case "block": {
            const truth = blockOf(move);
            if (picked !== truth)
              fail(character.id, q, `answer ${picked} but table says ${truth}`);
            if (q.options.filter((o) => o === truth).length !== 1)
              fail(character.id, q, "correct value appears more than once");
            break;
          }
          case "level": {
            const truth = levelOf(move);
            if (picked !== truth)
              fail(character.id, q, `answer ${picked} but table says ${truth}`);
            break;
          }
          case "notation": {
            if (picked !== move.input)
              fail(character.id, q, `answer ${picked} but input is ${move.input}`);
            break;
          }
          case "speed": {
            const mine = startupOf(move);
            for (const opt of q.options) {
              if (opt === picked) continue;
              const other = moveByInput.get(opt);
              if (!other) {
                fail(character.id, q, `option "${opt}" matches no move`);
                continue;
              }
              const f = startupOf(other);
              if (f === null) fail(character.id, q, `option "${opt}" has no startup`);
              else if (f <= mine)
                fail(
                  character.id,
                  q,
                  `"${opt}" is i${f}, not slower than answer i${mine}`,
                );
            }
            break;
          }
          case "launcher": {
            if (!launcherOf(move))
              fail(character.id, q, `answer ${picked} does not launch`);
            for (const opt of q.options) {
              if (opt === picked) continue;
              const other = moveByInput.get(opt);
              if (!other) {
                fail(character.id, q, `option "${opt}" matches no move`);
                continue;
              }
              if (launcherOf(other))
                fail(character.id, q, `distractor "${opt}" also launches`);
            }
            break;
          }
          default:
            fail(character.id, q, `unknown category ${q.category}`);
        }
      }
    }
  }
}

const runs = characters.length * 3 * RUNS_PER_CHARACTER;
console.log(
  `\n${totalQuestions} questions checked across ${runs} runs · ${characters.length} characters`,
);
console.log(
  "by category: " +
    Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k} ${v}`)
      .join(" · "),
);

if (shortRuns.length) {
  const uniq = [...new Set(shortRuns)];
  console.log(`\n${shortRuns.length} runs came up short:`);
  uniq.slice(0, 10).forEach((s) => console.log("  ■ " + s));
}

if (problems.length) {
  const uniq = [...new Set(problems)];
  console.error(`\n${uniq.length} distinct problems:\n`);
  uniq.slice(0, 40).forEach((p) => console.error("  ✗ " + p));
  if (uniq.length > 40) console.error(`  … and ${uniq.length - 40} more`);
  process.exit(1);
}

console.log("\nEvery generated answer matches the frame table.");
