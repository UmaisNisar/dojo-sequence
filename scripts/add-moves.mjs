/**
 * Add moves to a character's frame table, straight from Wavu's Move rows.
 *
 *   node scripts/add-moves.mjs hwoarang key=Wavu-Id [key=Wavu-Id …]
 *
 * Every value — name, level, startup, block, hit, CH, damage, notes — comes
 * from the live database; nothing is typed by hand, which is the whole point.
 * Strings inherit their full input and level by walking Wavu's parent chain.
 *
 * Afterwards run `npm run fetch:videos` to attach clips, then
 * `npm run verify:frames` to confirm the additions match the live database.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DATA_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "data",
  "characters",
);
const API = "https://wavu.wiki/w/api.php";
const UA = { "User-Agent": "dojo-sequence-move-adder" };

const dec = (s) =>
  String(s ?? "")
    .replace(/&#0?39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

const unlink = (s) =>
  s === null || s === undefined
    ? null
    : dec(s)
        .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, "$1")
        .replace(/\[\[([^\]]*)\]\]/g, "$1")
        .replace(/\s+/g, " ")
        .trim() || null;

/** See fetch-punishers.mjs: `notes` is a plainlist of bullets, not prose. */
function parseNotes(raw) {
  if (!raw) return [];
  const text = dec(raw);
  const body = /<div class="plainlist">([\s\S]*)<\/div>\s*$/.exec(text);
  const source = body ? body[1] : text;
  const chunks = body ? source.split(/^\s*\*\s?/m).slice(1) : [source];
  return chunks
    .map((chunk) =>
      chunk
        .replace(/<div[^>]*>([\s\S]*?)<\/div>/g, "$1")
        .replace(/<[^>]+>/g, "")
        .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, "$1")
        .replace(/\[\[([^\]]*)\]\]/g, "$1")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
}

async function fetchRows(character) {
  const rows = [];
  let offset = 0;
  for (;;) {
    const u = new URL(API);
    u.searchParams.set("action", "cargoquery");
    u.searchParams.set("tables", "Move");
    u.searchParams.set(
      "fields",
      "id,name,input,target,startup,block,hit,ch,damage,notes,parent",
    );
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
  return rows;
}

const [characterId, ...pairs] = process.argv.slice(2);
if (!characterId || pairs.length === 0) {
  console.error("usage: node scripts/add-moves.mjs <characterId> key=Wavu-Id …");
  process.exit(1);
}

const path = join(DATA_DIR, `${characterId}.frames.json`);
if (!existsSync(path)) {
  console.error(`no frame table for "${characterId}"`);
  process.exit(1);
}
const set = JSON.parse(readFileSync(path, "utf8"));

const wanted = pairs.map((p) => {
  const at = p.indexOf("=");
  if (at === -1) throw new Error(`expected key=Wavu-Id, got "${p}"`);
  return [p.slice(0, at), p.slice(at + 1)];
});

const wavuCharacter = wanted[0][1].split("-")[0];
const rows = await fetchRows(wavuCharacter);
const byId = new Map();
for (const row of rows) {
  // Wavu can list an id twice; the row carrying frame data wins.
  const prev = byId.get(row.id);
  if (prev && prev.startup && !row.startup) continue;
  byId.set(row.id, row);
}

const chain = (id) => {
  const out = [];
  let cur = byId.get(id);
  while (cur) {
    out.unshift(cur);
    cur = cur.parent ? byId.get(cur.parent) : null;
  }
  return out;
};

let added = 0;
for (const [key, id] of wanted) {
  const row = byId.get(id);
  if (!row) {
    console.log(`  ✗ ${key}: no live row for "${id}"`);
    continue;
  }
  if (set.moves[key]) {
    console.log(`  · ${key}: already present, skipped`);
    continue;
  }
  // The same move under a different key is still the same move — guarding on
  // the key alone silently forks the table.
  const dupe = Object.entries(set.moves).find(([, m]) => m.wavuId === id);
  if (dupe) {
    console.log(`  · ${key}: already in the table as "${dupe[0]}", skipped`);
    continue;
  }
  const rows = chain(id);
  const root = rows[0];
  const justFrame = id.includes("${justFrame}");
  const input =
    rows
      .map((r) => dec(r.input))
      .join("")
      // Wavu marks the just-frame input with `#` in `input` and with
      // `${justFrame}` in `id`; both render as a plain `+`.
      .replace(/\$\{justFrame\}|#/g, "+") +
    (justFrame ? " (just frame)" : "");

  const move = {
    wavuId: id,
    input,
    // Wavu leaves some rows unnamed; the notation is the honest fallback.
    name: dec(row.name) || input,
    level: rows.map((r) => dec(r.target ?? "")).join("") || null,
    startup: unlink(row.startup),
  };
  if (rows.length > 1 && root.startup) {
    const m = /i?(\d+)/.exec(unlink(root.startup) ?? "");
    if (m) move.displayStartup = `i${m[1]} (string)`;
  }
  move.block = unlink(row.block);
  move.hit = unlink(row.hit);
  move.ch = unlink(row.ch);
  move.damage = unlink(row.damage);
  move.notes = parseNotes(row.notes);

  set.moves[key] = move;
  added++;
  console.log(`  + ${key.padEnd(18)} ${input.padEnd(18)} ${move.name}`);
}

writeFileSync(path, JSON.stringify(set, null, 2) + "\n");
console.log(`\n${added} move(s) added to ${characterId} (${Object.keys(set.moves).length} total).`);
