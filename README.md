# Dojo Sequence

**A structured training curriculum for learning Tekken 8 characters.**

**Live: [dojo-sequence.vercel.app](https://dojo-sequence.vercel.app)**

Instead of dumping a 100-move list on you, Dojo Sequence teaches a character as
a strict, ordered curriculum: **learn → drill → pass → unlock the next skill**.

Ships with a complete **Kazuya** curriculum — 45 training items across 8 stages
(Movement → Core Pokes → Launchers & Counterhits → Punishment → Core Combos →
Mixups & Pressure → Defense → Gameplan), with frame data cross-verified against
[TekkenDocs](https://tekkendocs.com/t8/kazuya) and
[Wavu Wiki](https://wavu.wiki/t/Kazuya) (Season 3), and execution tips written
specifically for leverless/hitbox players.

## Features

- **Today screen** — always answers "what should I practice right now?"
- **Session mode** — a fast, focused loop over your next items + retention reps
- **Measurable drills** — consecutive reps, total reps, accuracy sets, timed
  holds, and concept checklists; an item only becomes *Learned* when its pass
  condition is genuinely met
- **Linear unlocks** — stages (and items within them) unlock in strict order;
  locked content stays visible so you always see the road ahead
- **Retention** — already-learned items resurface based on how stale they are
- **Progress that survives** — everything persists in `localStorage`, with
  validated JSON export/import
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
```

## Deploy

Push to GitHub and import into [Vercel](https://vercel.com) — zero
configuration required. Every route is prerendered static HTML.

## Add a character

1. Create `src/data/characters/<name>.ts` exporting a `Character`
2. Register it in `src/data/characters/index.ts`

The UI, progression engine, routing, and persistence are all
character-agnostic.

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
  data/        # character curricula (static, typed)
  hooks/       # ProgressProvider (single reducer owns all state)
  lib/         # progression engine, persistence store, import/export validation
  types/       # domain models: Character → Stage → TrainingItem → Drill
```

Progression rules (unlocks, pass conditions, session planning, retention
scoring) live in `src/lib/progression.ts` — components never re-implement them.
`localStorage` access is isolated behind `src/lib/store.ts`, and every byte
read from storage or an imported file is validated before it touches app state.

---

Dojo Sequence is a fan-made training tool and is not affiliated with Bandai
Namco. Frame data can shift between patches — when in doubt, verify in-game.
