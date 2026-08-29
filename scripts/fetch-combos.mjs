/**
 * Bake Wavu Wiki's combo pages into src/data/characters/*.combos.json.
 *
 *   node scripts/fetch-combos.mjs
 *
 * Combos were the one part of the curriculum that lived as prose. Stage 5 is
 * "Core Combos" for every character, and a combo was a string in a `notation`
 * field with no damage, no wall carry, and no way to see the route as steps.
 *
 * Wavu writes them as definition lists inside `{{Combolist}}`:
 *
 *   ; [23] EWGF                  <- a starter, with its own damage
 *   ; [20] WGF                   <- consecutive starters share the routes below
 *   : [+51; 34] EWGF b+2,2 … T!  <- a route: damage, recoverable damage, input
 *
 * The second bracketed figure is RECOVERABLE damage — the grey health the
 * opponent earns back — per Wavu's own combo-notation legend, not wall carry.
 *
 * Combo notation is not in the Move table, so unlike frame data it cannot be
 * cross-checked field by field — `npm run verify:combos` re-derives the whole
 * set from the wiki and diffs it, which is the same contract the punish sheets
 * use.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const DATA_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "data",
  "characters",
);
const API = "https://wavu.wiki/w/api.php";
const UA = { "User-Agent": "dojo-sequence-combo-fetcher" };

export const WAVU_NAMES = {
  kazuya: "Kazuya",
  lars: "Lars",
  bryan: "Bryan",
  jin: "Jin",
  king: "King",
  dragunov: "Dragunov",
  steve: "Steve",
  hwoarang: "Hwoarang",
  yoshimitsu: "Yoshimitsu",
  "devil-jin": "Devil Jin",
};

/**
 * Which headings become sections, and what they are called in the app.
 * Anything not listed is skipped: "Stage hazard" and "Extras" are mostly
 * unfilled editor stubs across the roster.
 */
const SECTIONS = [
  [/^bread\s?n'?\s?butter$/i, "bnb", "Bread and butter"],
  [/^staples?$/i, "staple", "Staples"],
  [/^mini-?combos?$/i, "mini", "Mini-combos"],
  [/^wall/i, "wall", "Wall"],
  [/^heat/i, "heat", "Heat"],
  [/^rage/i, "rage", "Rage"],
  [/^float/i, "float", "Float"],
  [/^back-?turned/i, "backTurned", "Back-turned opponent"],
];

const dec = (s) =>
  String(s ?? "")
    .replace(/&#0?39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

const unlink = (s) =>
  dec(s)
    .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, "$1")
    .replace(/\[\[([^\]]*)\]\]/g, "$1")
    .replace(/\[https?:\/\/\S+\s+([^\]]*)\]/g, "$1");

const stripComments = (s) => s.replace(/<!--[\s\S]*?-->/g, "");

/** Named refs are back-references to a footnote defined elsewhere. */
function takeRefs(line, refTexts) {
  const notes = [];
  const body = unlink(line).replace(
    /<ref(?:\s+name="([^"]*)")?[^>]*?(?:\/>|>([\s\S]*?)<\/ref>)/g,
    (_, name, inner) => {
      const text = inner
        ? unlink(inner).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
        : (name ? refTexts.get(name) : null) ?? "";
      if (name && inner && text) refTexts.set(name, text);
      if (text) notes.push(text);
      return " ";
    },
  );
  return { body, notes };
}

const tidy = (s) =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/'{2,}/g, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * "[+51; 34] EWGF b+2,2 T! …" -> 51 damage, 34 of it recoverable, and the rest.
 * Wavu writes the total with or without a leading plus; both mean the same.
 */
function takeDamage(text) {
  const match = /^\s*\[\s*\+?(\d+)\s*(?:;\s*\+?(\d+)\s*)?\]\s*/.exec(text);
  if (!match) return { damage: null, recoverable: null, rest: text.trim() };
  return {
    damage: Number(match[1]),
    recoverable: match[2] === undefined ? null : Number(match[2]),
    rest: text.slice(match[0].length).trim(),
  };
}

/**
 * Editor stubs. Wavu ships every combo page with placeholder rows, and a
 * "combo when you anti-air with jab here" row rendered as real content would
 * be worse than an empty section.
 */
const isPlaceholder = (text) =>
  !text ||
  /combo (?:when|for|here)|combo here|big boy|^\?+$|^tbd$|^todo$/i.test(text);

const DIRECTIONS = "uf|ub|df|db|ws|fc|ss|bt|f|b|d|u|n";
function canonicalInput(value) {
  return String(value)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/^h(fc\.)/, "$1")
    // "1SS." is Yoshimitsu holding his sword — his DEFAULT stance. Wavu writes
    // it as a qualifier in prose, but the Move rows use the bare input.
    .replace(/1ss\./g, "")
    .replace(/\(justframe\)/g, "")
    .replace(/#/g, "+")
    .replace(/\bf,f\b/g, "ff")
    .replace(/\bb,b\b/g, "bb")
    .replace(/,n\+(\d)/g, ",n,$1")
    .replace(new RegExp(`(${DIRECTIONS})\\+(\\d)`, "g"), "$1$2");
}

/**
 * Starters are written for humans: "CH df+2", "(ws1),3~3", "[23] EWGF",
 * "Regular launch (e.g. f,F+3)". Pull out something matchable, or give up —
 * an unmatched starter still renders its label.
 */
function starterInput(label) {
  let text = label
    .replace(/^\s*(?:ch|counter\s*hit)\s+/i, "")
    .replace(/\s*<sup>[\s\S]*?<\/sup>/gi, "")
    .trim();
  // "Regular launch (e.g. f,F+3)" — the parenthetical is the actual move.
  const eg = /\(e\.g\.?\s*([^)]+)\)/i.exec(text);
  if (eg) text = eg[1].split(/\s+or\s+/i)[0].trim();
  // "(ws1),3~3" — Wavu brackets the part you do not re-input.
  text = text.replace(/[()]/g, "");
  return text.split(/\s+/)[0] ?? text;
}

function parse(wikitext) {
  const refTexts = new Map();
  const lines = stripComments(wikitext).split("\n");
  const sections = new Map();

  let current = null;
  let starters = [];
  let routes = [];
  /**
   * Whether the cursor is inside a `{{Combolist}}`. Pages also carry
   * definition lists in the same `;`/`:` syntax — Kazuya's Staples section
   * opens by defining EWGF, DEWGF and PEWGF — and reading those as combos put
   * "f,n,df#2 or f,n,d,df#2." in the app as a route. Groups found inside a
   * list therefore win; loose ones are a fallback for the sections that have
   * no list at all (Kazuya writes Heat that way).
   */
  let inList = false;

  const bucketFor = (id, label) => {
    const bucket = sections.get(id) ?? { id, label, groups: [], loose: [] };
    sections.set(id, bucket);
    return bucket;
  };

  const flush = () => {
    if (current && starters.length > 0 && routes.length > 0) {
      const bucket = bucketFor(current.id, current.label);
      (inList ? bucket.groups : bucket.loose).push({ starters, routes });
    }
    starters = [];
    routes = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    const heading = /^={2,}\s*(.+?)\s*={2,}$/.exec(line);
    if (heading) {
      flush();
      inList = false;
      const title = tidy(heading[1]);
      const hit = SECTIONS.find(([re]) => re.test(title));
      // A subsection under a matched section keeps that section.
      current = hit
        ? { id: hit[1], label: hit[2] }
        : current && line.startsWith("===")
          ? current
          : null;
      continue;
    }
    if (!current) continue;

    if (/^\{\{Combolist/i.test(line.trim())) {
      flush();
      inList = true;
      continue;
    }

    if (line.trim() === "" || /^\}\}/.test(line.trim())) {
      flush();
      if (/^\}\}/.test(line.trim())) inList = false;
      continue;
    }

    const isStarter = line.startsWith(";");
    const isRoute = line.startsWith(":");
    if (!isStarter && !isRoute) continue;

    const { body, notes } = takeRefs(line.slice(1), refTexts);
    const text = tidy(body);
    if (!text) continue;

    if (isStarter) {
      // A starter after routes begins a new group.
      if (routes.length > 0) flush();
      const { damage, rest } = takeDamage(text);
      if (isPlaceholder(rest)) continue;
      starters.push({ label: rest, damage, notes });
    } else {
      const { damage, recoverable, rest } = takeDamage(text);
      if (isPlaceholder(rest)) continue;
      // "… T! 3,1~df~3 - While In Heat +4" — the tail is a condition, not input.
      const tail = /\s+[-–]\s+(.+)$/.exec(rest);
      routes.push({
        notation: tail ? rest.slice(0, tail.index).trim() : rest,
        damage,
        recoverable,
        notes: tail ? [...notes, tail[1].trim()] : notes,
      });
    }
  }
  flush();

  // Keep the reading order of SECTIONS rather than the page's.
  return SECTIONS.map(([, id]) => sections.get(id))
    .filter(Boolean)
    .map(({ id, label, groups, loose }) => ({
      id,
      label,
      groups: groups.length > 0 ? groups : loose,
    }))
    .filter((s) => s.groups.length > 0);
}

async function fetchWikitext(page) {
  const u = new URL(API);
  u.searchParams.set("action", "parse");
  u.searchParams.set("page", page);
  u.searchParams.set("prop", "wikitext");
  u.searchParams.set("format", "json");
  const res = await fetch(u, { headers: UA });
  if (!res.ok) throw new Error(`MediaWiki ${res.status} for ${page}`);
  const json = await res.json();
  if (json.error) throw new Error(`${page}: ${json.error.info}`);
  return json.parse?.wikitext?.["*"] ?? null;
}

export async function buildCombos(characterId) {
  const wavu = WAVU_NAMES[characterId];
  const framesPath = join(DATA_DIR, `${characterId}.frames.json`);
  if (!wavu || !existsSync(framesPath)) return null;

  const frames = JSON.parse(readFileSync(framesPath, "utf8"));
  const byInput = new Map();
  for (const [key, move] of Object.entries(frames.moves)) {
    byInput.set(canonicalInput(move.input), key);
  }

  const page = `${wavu} combos`;
  const raw = await fetchWikitext(page);
  if (!raw) throw new Error(`no wikitext for ${page}`);

  const sections = parse(raw).map((section) => ({
    ...section,
    groups: section.groups.map((group) => ({
      ...group,
      starters: group.starters.map((s) => ({
        ...s,
        moveKey: byInput.get(canonicalInput(starterInput(s.label))) ?? null,
      })),
    })),
  }));

  return {
    characterId,
    source: `https://wavu.wiki/t/${wavu}_combos`,
    gameVersion: frames.gameVersion,
    verifiedAt: new Date().toISOString().slice(0, 10),
    sections,
  };
}

/* ------------------------------------------------------------------ */

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  let total = 0;
  for (const id of Object.keys(WAVU_NAMES)) {
    const data = await buildCombos(id);
    if (!data) continue;
    const routes = data.sections.reduce(
      (n, s) => n + s.groups.reduce((m, g) => m + g.routes.length, 0),
      0,
    );
    const linked = data.sections.reduce(
      (n, s) =>
        n + s.groups.reduce((m, g) => m + g.starters.filter((x) => x.moveKey).length, 0),
      0,
    );
    const starters = data.sections.reduce(
      (n, s) => n + s.groups.reduce((m, g) => m + g.starters.length, 0),
      0,
    );
    total += routes;
    writeFileSync(
      join(DATA_DIR, `${id}.combos.json`),
      JSON.stringify(data, null, 2) + "\n",
    );
    console.log(
      `■ ${id.padEnd(9)} ${String(routes).padStart(3)} routes · ${starters} starters (${linked} linked) · ${data.sections.map((s) => s.id).join(", ")}`,
    );
  }
  console.log(`\n${total} combo routes baked.`);
}
