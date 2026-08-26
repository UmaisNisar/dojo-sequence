# Dojo Sequence

**A structured training curriculum for learning Tekken 8 characters.**

**Live: [dojo-sequence.vercel.app](https://dojo-sequence.vercel.app)**

Instead of dumping a 100-move list on you, Dojo Sequence teaches a character as
a strict, ordered curriculum — and then keeps being useful as a reference once
you know it: **learn → drill → unlock**, plus a searchable movelist, punish
sheet, combo list and matchup notes.

Ships with complete curricula for **eight characters** — Kazuya, Lars, Bryan,
Jin, King, Dragunov, Steve and Hwoarang — plus a reference layer built on 830
moves of frame data cross-verified against [Wavu Wiki](https://wavu.wiki)'s
live database (Season 3) and execution tips written specifically for
leverless/hitbox players.

## Features

**Learn**

- **Linear unlocks** — stages (and items within them) unlock in strict order;
  locked content stays visible so you always see the road ahead
- **Session mode** — a fast, focused loop over your next items + retention reps
- **Drills** — consecutive reps, total reps, accuracy sets, timed holds and
  concept checklists tell you what to practise and how much of it; marking an
  item learned is your call, not a rep counter's
- **Retention** — already-learned items resurface based on how stale they are
- **Quiz** — an untimed knowledge quiz generated from the frame tables, and a
  timed punish-reaction drill

**Reference** — the screens you keep open with the game running

- **Movelist** — every move in the verified table, searchable by notation,
  name or property, filterable by height, speed (i10/i13/i15) and traits
  (launcher, homing, Heat engager, plus on block, launch-punishable…)
- **Punishers** — "they are -12, what do I hit?", by disadvantage, for
  standing, crouching, back-turned, grounded and whiff punishes
- **Combos** — 360 routes grouped by the launcher they work from, with damage
  and recoverable damage
- **Matchups** — the other half of the game: the opponent's fast lows, plus
  frames, homing moves and launch-punishable moves, each paired with the
  punisher *your* character actually uses at that disadvantage

**Everywhere**

- **Progress that survives** — everything persists in `localStorage`, with
  validated JSON export/import
- **Works offline** — installs to a home screen and keeps working without a
  connection (move clips stream from the wiki, so those need one)
- **Fully responsive** — designed for a phone next to your controller
- **Accessible** — keyboard navigable, screen-reader status messaging, honors
  `prefers-reduced-motion` plus an in-app reduce-motion toggle

## Stack

Next.js (App Router, Server Components, fully static output) · React ·
TypeScript · Tailwind CSS · Motion (`motion/react`) · Lucide icons.
**No backend** — no accounts, no database, no API. Everything runs in the
browser.

## Develop

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build (fully static)
npm run lint
npm test       # unit tests (node:test, no framework)
```

Six data checks run against the live sources, not fixtures:

| | |
| --- | --- |
| `npm run verify:frames` | every frame value, level, damage and total against Wavu's Cargo API |
| `npm run verify:punishers` | every punish sheet against Wavu's punisher pages |
| `npm run verify:combos` | every combo route against Wavu's combo pages |
| `npm run verify:quiz` | every generated question re-derived from the tables |
| `npm run verify:claims` | prose and notes against the values they describe |
| `npm run verify:videos` | every baked clip URL still resolves |

`npm test` covers the logic those cannot: persistence and schema migration,
unlock rules, import validation, the sanitiser that decides whether a value
fetched from a wiki is allowed to render, the parsers that turn Wavu's exact
strings into filterable numbers, and the joins between the baked wiki data and
the frame tables.

Authoring scripts, run when adding a character or after a patch:

| | |
| --- | --- |
| `node scripts/add-moves.mjs <character> key=Wavu-Id …` | add moves to a frame table, straight from the live database |
| `npm run fetch:videos` | bake move-demo clip URLs |
| `npm run fetch:punishers` | bake the punisher tables |
| `npm run fetch:combos` | bake the combo routes |
| `npm run sync:damage` | recompute each move's total damage from the live rows |

## Deploy

Push to GitHub and import into [Vercel](https://vercel.com). Every route is
prerendered static HTML.

One optional environment variable, for the `/feedback` form:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | [Web3Forms](https://web3forms.com) access key that reports are delivered to. |

Without it the form renders disabled and says so, rather than silently
dropping what someone writes. The key is public by design — it names the
destination inbox and cannot read anything back — so it is safe in a client
bundle, and lives in an env var only so it can be rotated without a commit.

## Add a character

1. Build the frame table with `node scripts/add-moves.mjs <name> key=Wavu-Id …`
2. Create `src/data/characters/<name>.ts` exporting a `Character`
3. Register it in `src/data/characters/index.ts`, `frames.ts`, `punishers.ts`
   and `combos.ts`
4. `npm run fetch:videos && npm run fetch:punishers && npm run fetch:combos`
5. Verify: `npm run verify:frames`, `:punishers`, `:combos`, `:quiz`, `:claims`

The UI, progression engine, routing, and persistence are all
character-agnostic — the movelist, punish sheet, combo list and matchup sheet
appear automatically once the data is registered.

## Frame data accuracy

Frame numbers live in exactly one place per character:
`src/data/characters/<name>.frames.json` — a table stamped with the game
version, verification date, and sources. The UI renders frame panels from this
table (nothing is hand-typed into components), always states which patch it
was verified against, and warns the user automatically when the data is old
enough that a patch has plausibly shipped.

**While the app is open**, it background-checks the bundled table against Wavu
Wiki's live database (MediaWiki's anonymous CORS API) at most once per day.
Values a patch changed render live in the frame panels — highlighted and
labeled — and the provenance line reports the check result. Offline, the app
falls back to bundled values with the normal staleness warning. Live values
pass a strict sanitizer before they can render.

**After every Tekken patch** (to re-baseline the bundled table, prose, and
quiz answers):

```bash
npm run verify:frames
```

This diffs the entire table against the same live database and reports exactly
which values drifted. Update the JSON, re-check any prose that cites the
changed values, bump `gameVersion` / `verifiedAt`, re-run until green, and
redeploy.

## Architecture

```
src/
  app/         # App Router routes (all static; dynamic segments via generateStaticParams)
  components/  # UI components + views
  data/        # curricula + baked frame/punisher/combo tables (static, typed)
  hooks/       # ProgressProvider (single reducer owns all state)
  lib/         # progression engine, move readings, persistence, import/export
  types/       # domain models: Character → Stage → TrainingItem → Drill
```

Progression rules (unlocks, session planning, retention scoring) live in
`src/lib/progression.ts`; the readings that turn Wavu's exact strings into
filterable numbers live in `src/lib/move-traits.ts` — components never
re-implement either.
`localStorage` access is isolated behind `src/lib/store.ts`, and every byte
read from storage or an imported file is validated before it touches app state.

## Offline

`app/manifest.ts` makes the app installable, and `public/sw.js` keeps it
working without a connection. Hashed `/_next/static/**` assets are served
cache-first — the filename IS the version, so a cached one is never stale.
Everything else is network-first and only falls back to the cache, because
serving an HTML document cache-first is how you hand someone last week's shell
and leave it requesting chunk hashes that no longer exist.

Move clips are deliberately not cached: they are cross-origin and opaque, so
the browser would charge their full padded size against the origin quota
without ever letting the app read them. Every number those clips illustrate is
in the bundle, so the whole app works offline except the video.

## Privacy

Your training progress never leaves your browser — it lives in `localStorage`
and there is no account, no server and no database to hold it.

The site does record aggregate traffic through Vercel Web Analytics: page
paths, referrer, country, browser and device type. It sets no cookies, stores
no IP addresses, and identifies visitors by a hash that is discarded every 24
hours, so visits cannot be linked across days or across sites. It cannot see
your progress. The dashboard is private to the project owner.

Reports sent from `/feedback` go straight from your browser to Web3Forms,
which forwards them to the maintainer. They carry what you type plus your
browser string and window size, which is stated on the form itself — no
training progress and no identifiers. Email is optional and used only to
reply.

Security headers, including the Content Security Policy, are defined in
`next.config.ts`. `connect-src` and `media-src` pin the only reachable third
parties to `wavu.wiki` and the form endpoint.

---

Dojo Sequence is a fan-made training tool and is not affiliated with Bandai
Namco. Frame data can shift between patches — when in doubt, verify in-game.
