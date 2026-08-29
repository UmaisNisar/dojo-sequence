/**
 * Frame-data patch verifier.
 *
 * Diffs every move in src/data/characters/*.frames.json against Wavu Wiki's
 * live Cargo database (the same dataset TekkenDocs mirrors). Run after every
 * Tekken patch:
 *
 *   npm run verify:frames
 *
 * Exit 0  = table matches the live database.
 * Exit 1  = drift detected — the report lists exactly which values changed.
 *           Update the JSON (and bump gameVersion/verifiedAt), then re-run.
 *
 * Startup values for multi-hit strings are reported as warnings only (Wavu
 * stores per-hit startups on string rows); block/hit/CH are strict failures.
 *
 * A move may carry `unverifiable: "<reason>"` to opt out entirely, for rows
 * Wavu no longer stores. Those are printed as warnings on every run — an
 * opt-out that goes quiet is an opt-out nobody re-checks.
 */

import { readdirSync, readFileSync } from "node:fs";
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

/** Strip wiki markup wavu embeds in values: [[Page|+59a]] → +59a, &gt; → >. */
function normalize(value) {
  if (value === null || value === undefined) return null;
  return String(value)
    .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, "$1")
    .replace(/\[\[([^\]]*)\]\]/g, "$1")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchMoves(wavuIds) {
  const results = new Map();
  // Batch to keep the WHERE clause reasonable.
  for (let i = 0; i < wavuIds.length; i += 20) {
    const batch = wavuIds.slice(i, i + 20);
    const where = `id IN (${batch.map((id) => `'${id.replace(/'/g, "''")}'`).join(",")})`;
    const url = new URL(API);
    url.searchParams.set("action", "cargoquery");
    url.searchParams.set("tables", "Move");
    url.searchParams.set("fields", "id,startup,block,hit,ch,target,damage");
    url.searchParams.set("where", where);
    url.searchParams.set("limit", "50");
    url.searchParams.set("format", "json");
    const res = await fetch(url, {
      headers: { "User-Agent": "dojo-sequence-frame-verifier" },
    });
    if (!res.ok) throw new Error(`Wavu API ${res.status} for batch ${i / 20}`);
    const json = await res.json();
    if (json.error) throw new Error(`Wavu API error: ${json.error.info}`);
    for (const row of json.cargoquery ?? []) {
      // Wavu can list the same id twice: a blank string-header row alongside the
      // real move row (e.g. Bryan-b+3). Always keep the row carrying frame data.
      const existing = results.get(row.title.id);
      if (existing && existing.startup && !row.title.startup) continue;
      results.set(row.title.id, row.title);
    }
  }
  return results;
}

/**
 * Every row for one character, so a string's damage can be summed along its
 * parent chain. `damage` on a string row is that HIT's damage — rendering it
 * raw under-reports the move, which is why the tables also carry a total.
 */
async function fetchCharacterRows(wavuCharacter) {
  const rows = [];
  let offset = 0;
  for (;;) {
    const url = new URL(API);
    url.searchParams.set("action", "cargoquery");
    url.searchParams.set("tables", "Move");
    url.searchParams.set("fields", "id,damage,parent,target");
    url.searchParams.set("where", `id LIKE '${wavuCharacter}-%'`);
    url.searchParams.set("limit", "500");
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("format", "json");
    const res = await fetch(url, {
      headers: { "User-Agent": "dojo-sequence-frame-verifier" },
    });
    if (!res.ok) throw new Error(`Wavu API ${res.status} for ${wavuCharacter}`);
    const json = await res.json();
    if (json.error) throw new Error(`Wavu API error: ${json.error.info}`);
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

/**
 * A string's `target` is relative to its parent (",h"), so the full level has
 * to be chained the same way the input is. Storing the raw value renders ",H"
 * and, worse, hides the move from every height filter.
 */
function liveLevel(byId, wavuId) {
  const parts = [];
  let current = byId.get(wavuId);
  const seen = new Set();
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    parts.unshift(normalize(current.target) ?? "");
    current = current.parent ? byId.get(current.parent) : null;
  }
  return parts.join("") || null;
}

function compareMove(key, local, live) {
  const failures = [];
  const warnings = [];
  const isString = local.wavuId.split("-").slice(1).join("-").includes(",");

  const checks = [
    ["block", local.block, normalize(live.block), false],
    ["hit", local.hit, normalize(live.hit), false],
    ["ch", local.ch, normalize(live.ch), false],
    ["damage", local.damage, normalize(live.damage), false],
    ["startup", local.startup, normalize(live.startup), isString],
  ];

  for (const [field, ours, theirs, warnOnly] of checks) {
    const a = normalize(ours);
    const b = theirs;
    if ((a ?? "") === (b ?? "")) continue;
    const line = `${key} (${local.input}) ${field}: ours "${a ?? "—"}" vs live "${b ?? "—"}"`;
    (warnOnly ? warnings : failures).push(line);
  }
  return { failures, warnings };
}

let totalFailures = 0;
let totalWarnings = 0;
let totalChecked = 0;

const files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".frames.json"));
if (files.length === 0) {
  console.error("No *.frames.json files found.");
  process.exit(1);
}

for (const file of files) {
  const set = JSON.parse(readFileSync(join(DATA_DIR, file), "utf8"));
  const entries = Object.entries(set.moves);
  console.log(
    `\n■ ${set.characterId} — ${entries.length} moves (stated: ${set.game} ${set.gameVersion}, verified ${set.verifiedAt})`,
  );

  const live = await fetchMoves(entries.map(([, m]) => m.wavuId));
  const wavuCharacter = entries[0]?.[1].wavuId.split("-")[0];
  const chains = wavuCharacter ? await fetchCharacterRows(wavuCharacter) : new Map();

  for (const [key, move] of entries) {
    totalChecked++;
    /* A move the Move table no longer carries. Wavu dropped the per-character
       generic low-parry rows, but the mechanic and its values are unchanged
       and a lesson still teaches it. Reported every run rather than skipped
       quietly, so an opt-out cannot rot unnoticed. */
    if (move.unverifiable) {
      totalWarnings++;
      console.log(`  ⚠ ${key} (${move.input}) not checked — ${move.unverifiable}`);
      continue;
    }
    const expectedLevel = liveLevel(chains, move.wavuId);
    if (expectedLevel !== null && (move.level ?? null) !== expectedLevel) {
      totalFailures++;
      console.log(
        `  ✗ ${key} (${move.input}) level: ours "${move.level ?? "—"}" vs live "${expectedLevel}"`,
      );
    }
    const expectedTotal = damageTotal(chains, move.wavuId);
    if ((move.damageTotal ?? null) !== expectedTotal) {
      totalFailures++;
      console.log(
        `  ✗ ${key} (${move.input}) damageTotal: ours "${move.damageTotal ?? "—"}" vs live "${expectedTotal ?? "—"}"`,
      );
    }
    const row = live.get(move.wavuId);
    if (!row) {
      totalFailures++;
      console.log(`  ✗ ${key}: wavu id "${move.wavuId}" not found — renamed or removed in a patch?`);
      continue;
    }
    const { failures, warnings } = compareMove(key, move, row);
    for (const f of failures) {
      totalFailures++;
      console.log(`  ✗ ${f}`);
    }
    for (const w of warnings) {
      totalWarnings++;
      console.log(`  ⚠ ${w} (string-row startup — informational)`);
    }
    if (failures.length === 0 && warnings.length === 0) {
      console.log(`  ✓ ${key} (${move.input})`);
    }
  }
}

console.log(
  `\n${totalChecked} moves checked · ${totalFailures} mismatches · ${totalWarnings} warnings`,
);
if (totalFailures > 0) {
  console.log(
    "\nDrift detected. Update the affected values in the *.frames.json table,\nre-verify prose that cites them, bump gameVersion/verifiedAt, and re-run.",
  );
  process.exit(1);
}
console.log("Frame table matches the live Wavu database.");
