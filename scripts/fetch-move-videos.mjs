/**
 * Bake move-demo video URLs into the frame tables.
 *
 * Wavu Wiki stores a short silent clip per move and exposes the filename as a
 * `video` field on the same Move rows the frame data comes from. This resolves
 * those filenames to their permanent file URLs ONCE, at authoring time, and
 * writes them into src/data/characters/*.frames.json.
 *
 *   node scripts/fetch-move-videos.mjs
 *
 * Baking the URLs keeps the app frontend-only: nothing calls an API at runtime
 * to find a clip. Run this after a patch, then `npm run verify:videos` to catch
 * anything that was renamed or removed.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
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
const UA = { "User-Agent": "dojo-sequence-video-fetcher" };

/** Cargo: wavu move id -> "File:xyz.mp4" (only rows that have a clip). */
async function fetchVideoNames(ids) {
  const found = new Map();
  for (let i = 0; i < ids.length; i += 20) {
    const batch = ids.slice(i, i + 20);
    const where = `id IN (${batch.map((id) => `'${id.replace(/'/g, "''")}'`).join(",")})`;
    const url = new URL(API);
    url.searchParams.set("action", "cargoquery");
    url.searchParams.set("tables", "Move");
    url.searchParams.set("fields", "id,video");
    url.searchParams.set("where", where);
    url.searchParams.set("limit", "50");
    url.searchParams.set("format", "json");
    const res = await fetch(url, { headers: UA });
    if (!res.ok) throw new Error(`Cargo ${res.status}`);
    const json = await res.json();
    if (json.error) throw new Error(`Cargo: ${json.error.info}`);
    for (const row of json.cargoquery ?? []) {
      if (row.title.video) found.set(row.title.id, row.title.video);
    }
  }
  return found;
}

/** MediaWiki: "File:xyz.mp4" -> permanent URL. Resolved, never guessed. */
async function resolveFileUrls(fileTitles) {
  const urls = new Map();
  const titles = [...new Set(fileTitles)];
  for (let i = 0; i < titles.length; i += 40) {
    const batch = titles.slice(i, i + 40);
    const url = new URL(API);
    url.searchParams.set("action", "query");
    url.searchParams.set("prop", "imageinfo");
    url.searchParams.set("iiprop", "url|size|mime");
    url.searchParams.set("titles", batch.join("|"));
    url.searchParams.set("format", "json");
    const res = await fetch(url, { headers: UA });
    if (!res.ok) throw new Error(`imageinfo ${res.status}`);
    const json = await res.json();
    const pages = json.query?.pages ?? {};
    // Normalisation maps the title we asked for onto the title MediaWiki used.
    const alias = new Map();
    for (const n of json.query?.normalized ?? []) alias.set(n.to, n.from);
    for (const page of Object.values(pages)) {
      const info = page.imageinfo?.[0];
      if (!info?.url) continue;
      if (info.mime && !info.mime.startsWith("video/")) continue;
      urls.set(page.title, info.url);
      const asked = alias.get(page.title);
      if (asked) urls.set(asked, info.url);
    }
  }
  return urls;
}

const files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".frames.json"));
let totalMoves = 0;
let totalWithVideo = 0;

for (const file of files) {
  const path = join(DATA_DIR, file);
  const set = JSON.parse(readFileSync(path, "utf8"));
  const entries = Object.entries(set.moves);
  const names = await fetchVideoNames(entries.map(([, m]) => m.wavuId));
  const urls = await resolveFileUrls([...names.values()]);

  let hit = 0;
  for (const [, move] of entries) {
    const fileTitle = names.get(move.wavuId);
    const url = fileTitle ? urls.get(fileTitle) : undefined;
    if (url) {
      move.video = url;
      hit++;
    } else {
      delete move.video;
    }
  }

  // Keep `video` last within each move for a stable, readable diff.
  const reordered = {};
  for (const [key, move] of entries) {
    const { video, ...rest } = move;
    reordered[key] = video ? { ...rest, video } : rest;
  }
  set.moves = reordered;

  writeFileSync(path, JSON.stringify(set, null, 2) + "\n");
  totalMoves += entries.length;
  totalWithVideo += hit;
  console.log(
    `■ ${set.characterId.padEnd(9)} ${String(hit).padStart(3)}/${String(entries.length).padEnd(3)} moves have a clip`,
  );
}

console.log(
  `\n${totalWithVideo}/${totalMoves} moves linked (${Math.round((totalWithVideo / totalMoves) * 100)}%).`,
);
console.log("Run `npm run verify:videos` to confirm every URL still resolves.");
