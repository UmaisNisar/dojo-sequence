/**
 * Combo verifier.
 *
 * Combo notation is not in Wavu's Move table, so unlike frame data it cannot
 * be checked value by value. What CAN be checked is that the committed set
 * still equals what the wiki says, and that every starter still points at a
 * move we carry — so this re-derives the whole set and diffs it.
 *
 *   npm run verify:combos
 *
 * Exit 0 = the committed combos match the wiki.
 * Exit 1 = the wiki changed, or a starter points at a move we no longer have.
 *          Re-run `node scripts/fetch-combos.mjs` and review the diff.
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildCombos, WAVU_NAMES } from "./fetch-combos.mjs";

const DATA_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "data",
  "characters",
);

/** Everything the app renders. verifiedAt is excluded — it moves every run. */
const shape = (data) =>
  JSON.stringify(
    data.sections.map((s) => ({
      id: s.id,
      groups: s.groups.map((g) => ({
        starters: g.starters,
        routes: g.routes,
      })),
    })),
  );

let failures = 0;
let checked = 0;

for (const id of Object.keys(WAVU_NAMES)) {
  const path = join(DATA_DIR, `${id}.combos.json`);
  if (!existsSync(path)) {
    console.log(`  ✗ ${id}: no combos.json — run scripts/fetch-combos.mjs`);
    failures++;
    continue;
  }
  const committed = JSON.parse(readFileSync(path, "utf8"));
  const frames = JSON.parse(
    readFileSync(join(DATA_DIR, `${id}.frames.json`), "utf8"),
  ).moves;

  const live = await buildCombos(id);
  if (!live) continue;

  const routes = committed.sections.reduce(
    (n, s) => n + s.groups.reduce((m, g) => m + g.routes.length, 0),
    0,
  );
  checked += routes;
  console.log(`\n■ ${id} — ${routes} routes`);

  let ok = true;
  if (shape(committed) !== shape(live)) {
    ok = false;
    failures++;
    console.log("  ✗ the wiki no longer matches the committed combos");
    for (const s of committed.sections) {
      const other = live.sections.find((x) => x.id === s.id);
      if (!other || JSON.stringify(s.groups) !== JSON.stringify(other.groups)) {
        console.log(`      section "${s.id}" changed`);
      }
    }
    for (const s of live.sections) {
      if (!committed.sections.some((x) => x.id === s.id)) {
        console.log(`      section "${s.id}" is new on the wiki`);
      }
    }
  }

  for (const section of committed.sections) {
    for (const group of section.groups) {
      for (const starter of group.starters) {
        if (starter.moveKey && !frames[starter.moveKey]) {
          ok = false;
          failures++;
          console.log(
            `  ✗ ${section.id}: starter "${starter.label}" points at missing move "${starter.moveKey}"`,
          );
        }
      }
    }
  }

  if (ok) console.log("  ✓ matches the wiki; every starter resolves");
}

console.log(`\n${checked} combo routes checked · ${failures} failures`);
if (failures > 0) {
  console.log(
    "\nRe-run `node scripts/fetch-combos.mjs`, review the diff, and commit it.",
  );
  process.exit(1);
}
console.log("Combos match Wavu Wiki.");
