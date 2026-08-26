/**
 * Recompute `damageTotal` for every move from Wavu's live rows.
 *
 *   node scripts/sync-damage-totals.mjs
 *
 * `damage` is stored exactly as Wavu writes it, so it stays diffable against
 * the source. `damageTotal` is the figure the app renders: the plain variant,
 * summed along the parent chain. Run this after a patch, alongside
 * `npm run verify:frames`, which recomputes the same value and fails on drift.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { damageTotal } from "./wavu-damage.mjs";

const DATA_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "data",
  "characters",
);
const API = "https://wavu.wiki/w/api.php";
const UA = { "User-Agent": "dojo-sequence-damage-sync" };

async function fetchRows(character) {
  const rows = [];
  let offset = 0;
  for (;;) {
    const u = new URL(API);
    u.searchParams.set("action", "cargoquery");
    u.searchParams.set("tables", "Move");
    u.searchParams.set("fields", "id,damage,parent");
    u.searchParams.set("where", `id LIKE '${character}-%'`);
    u.searchParams.set("limit", "500");
    u.searchParams.set("offset", String(offset));
    u.searchParams.set("format", "json");
    const res = await fetch(u, { headers: UA });
    if (!res.ok) throw new Error(`Cargo ${res.status}`);
    const json = await res.json();
    if (json.error) throw new Error(json.error.info);
    const batch = (json.cargoquery ?? []).map((r) => r.title);
    rows.push(...batch);
    if (batch.length < 500) break;
    offset += 500;
  }
  const byId = new Map();
  for (const row of rows) {
    const prev = byId.get(row.id);
    if (prev && prev.damage && !row.damage) continue;
    byId.set(row.id, row);
  }
  return byId;
}

let changed = 0;
for (const file of readdirSync(DATA_DIR).filter((f) => f.endsWith(".frames.json"))) {
  const path = join(DATA_DIR, file);
  const set = JSON.parse(readFileSync(path, "utf8"));
  const entries = Object.entries(set.moves);
  const wavuCharacter = entries[0]?.[1].wavuId.split("-")[0];
  if (!wavuCharacter) continue;
  const byId = await fetchRows(wavuCharacter);

  let n = 0;
  for (const [, move] of entries) {
    const total = damageTotal(byId, move.wavuId);
    if ((move.damageTotal ?? null) !== total) {
      move.damageTotal = total;
      n++;
    }
  }
  changed += n;
  writeFileSync(path, JSON.stringify(set, null, 2) + "\n");
  console.log(`■ ${set.characterId.padEnd(9)} ${n} totals updated`);
}
console.log(`\n${changed} damage total(s) updated. Run \`npm run verify:frames\`.`);
