/**
 * Move-video link verifier.
 *
 * Every clip URL baked into src/data/characters/*.frames.json is hotlinked
 * from Wavu Wiki, so a rename or deletion there would silently leave a blank
 * player in the app. This turns that into a loud failure:
 *
 *   npm run verify:videos
 *
 * Exit 0  = every baked URL still resolves.
 * Exit 1  = at least one is gone. Re-run `node scripts/fetch-move-videos.mjs`
 *           to re-resolve, then re-run this.
 *
 * Checks are HEAD requests run in small batches — no clip is downloaded.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DATA_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "data",
  "characters",
);
const CONCURRENCY = 8;

async function head(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": "dojo-sequence-video-verifier" },
    });
    return {
      ok: res.ok,
      status: res.status,
      type: res.headers.get("content-type") ?? "",
      bytes: Number(res.headers.get("content-length") ?? 0),
    };
  } catch (err) {
    return { ok: false, status: 0, type: "", bytes: 0, error: String(err) };
  }
}

const files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".frames.json"));
let checked = 0;
let failures = 0;
let bytes = 0;

for (const file of files) {
  const set = JSON.parse(readFileSync(join(DATA_DIR, file), "utf8"));
  const withVideo = Object.entries(set.moves).filter(([, m]) => m.video);
  const total = Object.keys(set.moves).length;
  console.log(
    `\n■ ${set.characterId} — ${withVideo.length}/${total} moves link a clip`,
  );

  for (let i = 0; i < withVideo.length; i += CONCURRENCY) {
    const batch = withVideo.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(([, m]) => head(m.video)));
    batch.forEach(([key, move], n) => {
      const r = results[n];
      checked++;
      if (!r.ok) {
        failures++;
        console.log(
          `  ✗ ${key} (${move.input}) — ${r.status || r.error} · ${move.video}`,
        );
      } else if (!r.type.startsWith("video/")) {
        failures++;
        console.log(`  ✗ ${key} (${move.input}) — not video (${r.type})`);
      } else {
        bytes += r.bytes;
      }
    });
  }
}

const mb = (bytes / 1024 / 1024).toFixed(1);
const avgKb = checked - failures > 0 ? (bytes / (checked - failures) / 1024).toFixed(0) : "0";
console.log(
  `\n${checked} clips checked · ${failures} broken · ${mb} MB total (~${avgKb} KB each)`,
);
if (failures > 0) {
  console.log(
    "\nBroken links. Re-run `node scripts/fetch-move-videos.mjs` to re-resolve\nagainst Wavu, then verify again. Moves whose clip was removed upstream\nsimply lose the player — the frame data is unaffected.",
  );
  process.exit(1);
}
console.log("All baked clip URLs resolve.");
