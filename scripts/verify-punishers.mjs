/**
 * Punish-sheet verifier.
 *
 * Re-derives every punisher table from Wavu Wiki and diffs it against the
 * committed src/data/characters/*.punishers.json, then confirms that every
 * entry still points at a move the frame table actually carries.
 *
 *   npm run verify:punishers
 *
 * Exit 0 = the sheets match the wiki and every link resolves.
 * Exit 1 = the wiki changed, or an entry points at a move we no longer have.
 *          Re-run `node scripts/fetch-punishers.mjs` and review the diff.
 *
 * Entries the wiki lists but Wavu's own Move table has no row for are reported
 * as advisories: they render from the wiki's own damage and frames, and there
 * is nothing on our side to fix.
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPunishers, WAVU_NAMES } from "./fetch-punishers.mjs";

const DATA_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "data",
  "characters",
);

const SECTION_NAMES = ["standing", "crouching", "backTurned", "grounded"];

/** Compare only the fields the sheet renders — not verifiedAt, which moves. */
const shape = (data) => ({
  sections: Object.fromEntries(
    SECTION_NAMES.map((s) => [
      s,
      (data.sections[s] ?? []).map((e) => ({
        moveKey: e.moveKey,
        input: e.input,
        enemy: e.enemy,
        frames: e.frames,
        damage: e.damage,
        combo: e.combo,
        notes: e.notes,
      })),
    ]),
  ),
  whiff: data.whiff.map((e) => ({
    moveKey: e.moveKey,
    input: e.input,
    speed: e.speed,
    damage: e.damage,
    risk: e.risk,
    notes: e.notes,
  })),
});

let failures = 0;
let advisories = 0;
let checked = 0;

for (const id of Object.keys(WAVU_NAMES)) {
  const path = join(DATA_DIR, `${id}.punishers.json`);
  if (!existsSync(path)) {
    console.log(`  ✗ ${id}: no punishers.json — run scripts/fetch-punishers.mjs`);
    failures++;
    continue;
  }
  const committed = JSON.parse(readFileSync(path, "utf8"));
  const frames = JSON.parse(
    readFileSync(join(DATA_DIR, `${id}.frames.json`), "utf8"),
  ).moves;

  const result = await buildPunishers(id);
  if (!result) continue;

  const entries = [
    ...SECTION_NAMES.flatMap((s) => committed.sections[s] ?? []),
    ...committed.whiff,
  ];
  checked += entries.length;

  console.log(`\n■ ${id} — ${entries.length} entries`);

  const before = JSON.stringify(shape(committed));
  const after = JSON.stringify(shape(result.data));
  if (before !== after) {
    failures++;
    console.log("  ✗ the wiki no longer matches the committed sheet");
    // Point at the first section that moved, so the diff is findable.
    for (const s of SECTION_NAMES) {
      const a = JSON.stringify(committed.sections[s] ?? []);
      const b = JSON.stringify(result.data.sections[s] ?? []);
      if (a !== b) console.log(`      section "${s}" changed`);
    }
    if (JSON.stringify(committed.whiff) !== JSON.stringify(result.data.whiff)) {
      console.log('      section "whiff" changed');
    }
  }

  for (const entry of entries) {
    if (entry.moveKey && !frames[entry.moveKey]) {
      failures++;
      console.log(
        `  ✗ ${entry.input ?? entry.moveKey}: moveKey "${entry.moveKey}" is not in the frame table`,
      );
    } else if (!entry.moveKey) {
      advisories++;
      console.log(
        `  ? ${entry.input ?? "?"}: no matching move row — renders from the wiki's own values`,
      );
    }
  }

  if (before === after && entries.every((e) => !e.moveKey || frames[e.moveKey])) {
    console.log("  ✓ matches the wiki; every link resolves");
  }
}

console.log(
  `\n${checked} punisher entries checked · ${failures} failures · ${advisories} unlinked`,
);
if (failures > 0) {
  console.log(
    "\nRe-run `node scripts/fetch-punishers.mjs`, review the diff, and commit it.",
  );
  process.exit(1);
}
console.log("Punish sheets match Wavu Wiki.");
