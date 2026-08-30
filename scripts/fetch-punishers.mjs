/**
 * Bake Wavu Wiki's punisher tables into src/data/characters/*.punishers.json.
 *
 *   node scripts/fetch-punishers.mjs
 *
 * "They are -12, what do I hit?" is the single most-consulted thing in Tekken,
 * and Wavu maintains a per-character answer that is curated by players rather
 * than derived from raw startup values — it already excludes the moves that
 * technically reach but whiff, duck under, or are not worth taking.
 *
 * Two page formats exist and both are parsed here:
 *
 *   {{PunisherTable|character=X |standing={{o |{{o| moveId=… | enemy=-12 }} }}}}
 *   {| class="punishers"   …a plain wikitable with rowspan'd enemy values
 *
 * What gets stored is only what the punisher page adds on top of the move
 * itself: which disadvantage it answers, the combo it converts into, any
 * frames override, and the footnotes. Damage, startup and the rest stay in the
 * frame table so there is still exactly one source of truth per number, and a
 * patch that changes a move updates the punish sheet with it.
 *
 * Run `npm run verify:punishers` afterwards to confirm every entry still
 * resolves to a move we carry.
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
const UA = { "User-Agent": "dojo-sequence-punisher-fetcher" };

/** Our character id -> the Wavu page prefix. */
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
  victor: "Victor",
};

const SECTIONS = {
  standing: "standing",
  crouching: "crouching",
  backTurnedOpponent: "backTurned",
  groundedOpponent: "grounded",
};

const dec = (s) =>
  String(s ?? "")
    .replace(/&#0?39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

/** Wiki links render as their label: [[Kazuya combos#Staples|+34a]] -> +34a. */
const unlink = (s) =>
  dec(s)
    .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, "$1")
    .replace(/\[\[([^\]]*)\]\]/g, "$1")
    .replace(/\[https?:\/\/\S+\s+([^\]]*)\]/g, "$1")
    .replace(/\[(https?:\/\/\S+)\]/g, "$1");

const clean = (s) =>
  unlink(s)
    .replace(/<[^>]+>/g, "")
    .replace(/'{2,}/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** Commented-out rows are the editors' way of retiring an entry. */
const stripComments = (s) => s.replace(/<!--[\s\S]*?-->/g, "");

/** Pull <ref>…</ref> out as footnotes; named back-references carry no text. */
function takeRefs(value) {
  const notes = [];
  const body = String(value).replace(
    /<ref[^>]*?(?:\/>|>([\s\S]*?)<\/ref>)/g,
    (_, inner) => {
      const note = clean(inner ?? "");
      if (note) notes.push(note);
      return " ";
    },
  );
  return { body, notes };
}

/** Split on `|` that are not inside a nested {{…}} or [[…]]. */
function splitTop(body) {
  const parts = [];
  let depth = 0;
  let current = "";
  for (let i = 0; i < body.length; i++) {
    const two = body.slice(i, i + 2);
    if (two === "{{" || two === "[[") { depth++; current += two; i++; continue; }
    if (two === "}}" || two === "]]") { depth--; current += two; i++; continue; }
    if (body[i] === "|" && depth === 0) { parts.push(current); current = ""; continue; }
    current += body[i];
  }
  parts.push(current);
  return parts;
}

/** The balanced {{…}} block starting at `from`. */
function balanced(text, from) {
  const start = text.indexOf("{{", from);
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < text.length - 1; i++) {
    const two = text.slice(i, i + 2);
    if (two === "{{") { depth++; i++; continue; }
    if (two === "}}") {
      depth--;
      i++;
      if (depth === 0) return { body: text.slice(start + 2, i - 1), end: i + 1 };
    }
  }
  return null;
}

/**
 * Every leaf `{{o| … }}` in a block. Sections wrap their rows in one more
 * `{{o …}}` than whiff tables do, so the nesting is walked rather than assumed
 * — reading only the top level returns the wrapper and loses every row.
 */
function entryBlocks(body) {
  const out = [];
  let i = 0;
  for (;;) {
    const next = body.indexOf("{{o", i);
    if (next === -1) break;
    const block = balanced(body, next);
    if (!block) break;
    const inner = block.body.replace(/^o\s*/, "");
    if (inner.includes("{{o")) out.push(...entryBlocks(inner));
    else out.push(inner);
    i = block.end;
  }
  return out;
}

function parseEntry(raw) {
  const fields = {};
  const notes = [];
  for (const part of splitTop(raw)) {
    const m = /^\s*([A-Za-z]+)\s*=([\s\S]*)$/.exec(part);
    if (!m) continue;
    const { body, notes: refs } = takeRefs(m[2]);
    notes.push(...refs);
    fields[m[1]] = clean(body);
  }
  return { fields, notes };
}

/** Wavu writes just-frame ids with `#`; the Move table stores `${justFrame}`. */
const normalizeId = (id) => id.replace(/#/g, "${justFrame}");

/**
 * Canonical form for matching an input written on a punisher page against the
 * input on a Move row. The two disagree on casing and on where the `+` goes
 * ("WS+4,4" vs "ws4,4", "FF+3" vs "f,F+3"), so both sides are folded.
 *
 * The `+` between two BUTTONS is meaningful and kept: dropping all punctuation
 * would make "DF3+4" and "df+3,4" — different moves — collide.
 */
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
    .replace(/\bf,f\b/g, "ff")
    .replace(/\bb,b\b/g, "bb")
    // "uf,n+4" and "uf,n,4" are the same input. This has to run BEFORE the
    // rule below, which would otherwise consume the `+` as a direction join.
    .replace(/,n\+(\d)/g, ",n,$1")
    // Direction+button joins are cosmetic: ws+4 and ws4 are the same input.
    .replace(new RegExp(`(${DIRECTIONS})\\+(\\d)`, "g"), "$1$2");
}

/**
 * Letters and digits only — "RFF F+[4~4]" and "RFF.f+4~4" collapse to the same
 * string. Used ONLY when it maps to exactly one move, because this deliberately
 * throws away the punctuation that separates "DF3+4" from "df+3,4".
 */
const looseInput = (value) => canonicalInput(value).replace(/[^a-z0-9]/g, "");

function fromTemplate(text) {
  const sections = { standing: [], crouching: [], backTurned: [], grounded: [] };
  const whiff = [];

  const tableAt = text.indexOf("{{PunisherTable");
  if (tableAt !== -1) {
    const block = balanced(text, tableAt);
    if (block) {
      for (const part of splitTop(block.body)) {
        const m = /^\s*([A-Za-z]+)\s*=([\s\S]*)$/.exec(part);
        if (!m || !(m[1] in SECTIONS)) continue;
        for (const raw of entryBlocks(m[2])) {
          const { fields, notes } = parseEntry(raw);
          /* An empty section — "backTurnedOpponent={{o }}" — leaves a wrapper
             with no rows inside it, which reads as a leaf entry naming no
             move. Victor has two of those and they rendered as "?". */
          if (!fields.moveId && !fields.move) continue;
          sections[SECTIONS[m[1]]].push({
            moveId: fields.moveId ? normalizeId(fields.moveId) : null,
            input: fields.move ?? null,
            enemy: fields.enemy ?? null,
            frames: fields.frames ?? null,
            damage: fields.damage ?? null,
            combo: fields.staple ?? fields.wall ?? fields.mini ?? null,
            notes,
          });
        }
      }
    }
  }

  const whiffAt = text.indexOf("{{WhiffPunisherTable");
  if (whiffAt !== -1) {
    const block = balanced(text, whiffAt);
    if (block) {
      for (const raw of entryBlocks(block.body)) {
        const { fields, notes } = parseEntry(raw);
        if (!fields.moveId && !fields.move) continue;
        whiff.push({
          moveId: fields.moveId ? normalizeId(fields.moveId) : null,
          input: fields.move ?? null,
          speed: fields.speed ?? null,
          damage: fields.damage ?? null,
          risk: fields.risk ?? null,
          notes,
        });
      }
    }
  }

  return { sections, whiff };
}

const CAT_TO_SECTION = {
  standing: "standing",
  crouching: "crouching",
  "back-turned opponent": "backTurned",
  "grounded opponent": "grounded",
};

/**
 * The plain-wikitable format (Hwoarang). Columns are
 * Enemy | Move | Damage | Frames, and an Enemy cell may rowspan several moves.
 */
function fromWikiTable(text) {
  const sections = { standing: [], crouching: [], backTurned: [], grounded: [] };
  const whiff = [];

  for (const table of text.split(/\{\|/).slice(1)) {
    const body = table.split(/\n\|\}/)[0];
    const isWhiff = /table-cat[^|]*\|\s*Whiff punishers/i.test(body);
    let section = "standing";
    let carriedEnemy = null;
    let carriedLeft = 0;

    for (const rowRaw of body.split(/\n\|-/)) {
      const row = rowRaw.trim();
      if (!row) continue;

      const cat = /class="table-cat"\s*\|\s*([^\n|]+)/.exec(row);
      if (cat) {
        const key = clean(cat[1]).toLowerCase();
        if (key in CAT_TO_SECTION) section = CAT_TO_SECTION[key];
        continue;
      }
      if (/^\s*!/.test(row)) continue; // header row

      /* Cells are separated by `||` on a line, or by a fresh `|` on a new
         line. Empty cells are KEPT: these tables use a blank Enemy cell to
         mean "same disadvantage as the row above", and dropping it shifts
         every later column left — which read damage values as move inputs
         and put "29" in the sheet as a punisher. */
      const cells = row
        .split(/\|\||\n\s*\|/)
        .map((c) => c.replace(/^\s*\|/, ""));
      if (cells.every((c) => c.trim() === "")) continue;

      const parsed = cells.map((c) => {
        const span = /rowspan="(\d+)"\s*\|([\s\S]*)$/.exec(c);
        const { body: b, notes } = takeRefs(span ? span[2] : c);
        return { text: clean(b), rowspan: span ? Number(span[1]) : 1, notes };
      });

      if (isWhiff) {
        // Move | Speed | Range | Damage | Risk | Hitbox
        const [move, speed, , damage, risk] = parsed;
        if (!move?.text) continue;
        whiff.push({
          moveId: null,
          input: move.text,
          speed: speed?.text || null,
          damage: damage?.text || null,
          risk: risk?.text || null,
          notes: parsed.flatMap((p) => p.notes),
        });
        continue;
      }

      /* A rowspan'd Enemy cell covers the rows beneath it; a blank one means
         the same thing written by hand. Both carry the last value forward. */
      let cursor = 1;
      let enemy;
      if (carriedLeft > 0) {
        enemy = carriedEnemy;
        carriedLeft--;
        cursor = 0;
      } else if (parsed[0]?.text) {
        enemy = parsed[0].text;
        carriedEnemy = enemy;
        if (parsed[0].rowspan > 1) carriedLeft = parsed[0].rowspan - 1;
      } else {
        enemy = carriedEnemy;
      }

      const move = parsed[cursor];
      if (!move?.text) continue;
      const damage = parsed[cursor + 1];
      const frames = parsed[cursor + 2];
      // "20 (39)" — the bracketed figure is the combo the punish converts to.
      const comboMatch = /\(([^)]+)\)/.exec(damage?.text ?? "");
      sections[section].push({
        moveId: null,
        input: move.text,
        enemy,
        frames: frames?.text || null,
        damage: (damage?.text ?? "").replace(/\s*\([^)]*\)/, "").trim() || null,
        combo: comboMatch && comboMatch[1] !== "?" ? comboMatch[1] : null,
        notes: parsed.slice(cursor).flatMap((p) => p.notes),
      });
    }
  }

  return { sections, whiff };
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

/**
 * Resolve each entry against the character's frame table so the UI can render
 * a punisher from the same verified row the rest of the app uses.
 */
function link(entries, byWavuId, byInput, byLoose, unresolved) {
  return entries.map((e) => {
    let key = e.moveId ? (byWavuId.get(e.moveId) ?? null) : null;
    if (!key && e.input) key = byInput.get(canonicalInput(e.input)) ?? null;
    if (!key && e.input) {
      const loose = byLoose.get(looseInput(e.input));
      if (loose && loose.length === 1) key = loose[0];
    }
    if (!key) unresolved.push(e.moveId ?? e.input ?? "?");
    // moveId has served its purpose once resolved; the sheet stores the key.
    const rest = { ...e };
    delete rest.moveId;
    /* Damage belongs to the frame table whenever there IS one. The wikitable
       format carries a Damage column, and its hand-typed values can drift from
       the Move rows — Yoshimitsu's page says 1,1 does 26 where the rows total
       24 — which showed the same move at two different numbers on two screens.
       Kept only for entries with no move to read it from. */
    if (key) rest.damage = null;
    return { moveKey: key, ...rest, input: rest.input ?? null };
  });
}

export async function buildPunishers(characterId) {
  const wavu = WAVU_NAMES[characterId];
  const framesPath = join(DATA_DIR, `${characterId}.frames.json`);
  if (!wavu || !existsSync(framesPath)) return null;

  const frames = JSON.parse(readFileSync(framesPath, "utf8"));
  const byWavuId = new Map();
  const byInput = new Map();
  const byLoose = new Map();
  for (const [key, move] of Object.entries(frames.moves)) {
    byWavuId.set(move.wavuId, key);
    byInput.set(canonicalInput(move.input), key);
    const loose = looseInput(move.input);
    byLoose.set(loose, [...(byLoose.get(loose) ?? []), key]);
  }

  const page = `${wavu} punishers`;
  const raw = await fetchWikitext(page);
  if (!raw) throw new Error(`no wikitext for ${page}`);
  const text = stripComments(raw);

  const parsed = text.includes("{{PunisherTable")
    ? fromTemplate(text)
    : fromWikiTable(text);

  const unresolved = [];
  const sections = {};
  for (const [name, entries] of Object.entries(parsed.sections)) {
    sections[name] = link(entries, byWavuId, byInput, byLoose, unresolved);
  }

  return {
    data: {
      characterId,
      source: `https://wavu.wiki/t/${wavu}_punishers`,
      gameVersion: frames.gameVersion,
      verifiedAt: new Date().toISOString().slice(0, 10),
      sections,
      whiff: link(parsed.whiff, byWavuId, byInput, byLoose, unresolved),
    },
    unresolved,
  };
}

/* ------------------------------------------------------------------ */

// Windows drive paths need pathToFileURL — a hand-built file:// URL differs by
// a slash, and the block below then silently never runs.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  let total = 0;
  let unlinked = 0;
  for (const id of Object.keys(WAVU_NAMES)) {
    const result = await buildPunishers(id);
    if (!result) continue;
    const { data, unresolved } = result;
    const counts = Object.entries(data.sections)
      .map(([k, v]) => `${k} ${v.length}`)
      .join(" · ");
    const n =
      Object.values(data.sections).reduce((a, v) => a + v.length, 0) +
      data.whiff.length;
    total += n;
    unlinked += unresolved.length;
    writeFileSync(
      join(DATA_DIR, `${id}.punishers.json`),
      JSON.stringify(data, null, 2) + "\n",
    );
    console.log(`■ ${id.padEnd(9)} ${String(n).padStart(3)} entries — ${counts} · whiff ${data.whiff.length}`);
    for (const u of unresolved) console.log(`    ? no move in our table for "${u}"`);
  }
  console.log(`\n${total} punisher entries · ${unlinked} unlinked.`);
}
