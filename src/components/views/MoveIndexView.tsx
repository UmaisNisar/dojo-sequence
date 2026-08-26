"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, SlidersHorizontal, X } from "lucide-react";
import type { Character, MoveFrames } from "@/types";
import { getFrameData } from "@/data/frames";
import { useLiveFrames } from "@/hooks/use-live-frames";
import { useProgress } from "@/hooks/use-progress";
import { allItems } from "@/lib/progression";
import {
  HEIGHT_LABEL,
  type MoveHeight,
  type MoveSort,
  type MoveTrait,
  TRAIT_LABEL,
  heightOf,
  matchesQuery,
  sortMoves,
  startupFrames,
  traitsOf,
} from "@/lib/move-traits";
import { cn } from "@/lib/utils";
import { MoveRow } from "@/components/MoveRow";
import { ProvenanceFooter } from "@/components/FrameDataPanel";

const HEIGHTS: MoveHeight[] = ["high", "mid", "low", "throw"];
const TRAITS: MoveTrait[] = [
  "launcher",
  "ch-launcher",
  "homing",
  "heat-engager",
  "tornado",
  "power-crush",
  "plus-on-block",
  "safe",
  "launch-punishable",
];
const SORTS: { id: MoveSort; label: string }[] = [
  { id: "movelist", label: "Movelist" },
  { id: "startup", label: "Fastest" },
  { id: "block", label: "Best on block" },
  { id: "damage", label: "Damage" },
];

/** i10 and i15 are the thresholds every punish decision turns on. */
const SPEED_CAPS = [10, 13, 15] as const;

/**
 * The whole movelist, searchable.
 *
 * The curricula reference roughly half of what the frame tables carry — the
 * rest was verified, clipped and shipped in the bundle without ever being
 * reachable. This is the screen that makes the app a reference you keep open
 * next to the game rather than a course you finish once.
 */
export function MoveIndexView({ character }: { character: Character }) {
  const set = getFrameData(character.id);
  const live = useLiveFrames(character.id);
  const { state } = useProgress();

  const [query, setQuery] = useState("");
  const [height, setHeight] = useState<MoveHeight | null>(null);
  const [traits, setTraits] = useState<MoveTrait[]>([]);
  const [maxStartup, setMaxStartup] = useState<number | null>(null);
  const [sort, setSort] = useState<MoveSort>("movelist");
  /* Six rows of chips fill an entire phone screen before a single move
     appears, and looking one move up mid-match is the whole point. Hidden
     behind a toggle on small screens, always open from `sm` up — a pure class
     switch, so there is nothing for hydration to disagree about. */
  const [filtersOpen, setFiltersOpen] = useState(false);

  /* Typing filters ~170 rows on every keystroke. Deferring keeps the input
     responsive on a phone without debouncing away the last character. */
  const deferredQuery = useDeferredValue(query);

  /** Which moves the curriculum teaches, so the index can point back at them. */
  const taughtBy = useMemo(() => {
    const map = new Map<string, { itemId: string; name: string; stage: number }>();
    for (const stage of character.stages) {
      for (const item of stage.items) {
        for (const key of item.moveKeys ?? []) {
          if (!map.has(key)) {
            map.set(key, { itemId: item.id, name: item.name, stage: stage.number });
          }
        }
      }
    }
    return map;
  }, [character]);

  const learned = useMemo(() => {
    const progress = state.characters[character.id];
    const ids = new Set<string>();
    for (const item of allItems(character)) {
      if (progress?.items[item.id]?.status === "learned") ids.add(item.id);
    }
    return ids;
  }, [character, state.characters]);

  const entries = useMemo<[string, MoveFrames][]>(
    () => (set ? Object.entries(set.moves) : []),
    [set],
  );

  const filtered = useMemo(() => {
    const matches = entries.filter(([, move]) => {
      if (height && heightOf(move) !== height) return false;
      if (maxStartup !== null) {
        const startup = startupFrames(move);
        if (startup === null || startup > maxStartup) return false;
      }
      if (traits.length > 0) {
        const has = traitsOf(move);
        // Every selected trait must hold — narrowing, not widening.
        if (!traits.every((t) => has.includes(t))) return false;
      }
      return matchesQuery(move, deferredQuery);
    });
    return sortMoves(matches, sort);
  }, [entries, height, maxStartup, traits, deferredQuery, sort]);

  const toggleTrait = (trait: MoveTrait) =>
    setTraits((prev) =>
      prev.includes(trait) ? prev.filter((t) => t !== trait) : [...prev, trait],
    );

  const clear = () => {
    setQuery("");
    setHeight(null);
    setTraits([]);
    setMaxStartup(null);
    setSort("movelist");
  };

  /** What the collapsed toggle reports, so a filter is never hidden silently. */
  const activeFilterCount =
    (height ? 1 : 0) +
    traits.length +
    (maxStartup !== null ? 1 : 0) +
    (sort !== "movelist" ? 1 : 0);

  const filtersActive = query !== "" || activeFilterCount > 0;

  if (!set) {
    return (
      <p className="py-20 text-center text-sm text-muted">
        No frame table for {character.name} yet.
      </p>
    );
  }

  return (
    <div>
      <nav className="mb-6" aria-label="Breadcrumb">
        <Link
          href={`/training/${character.id}`}
          className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          {character.name} curriculum
        </Link>
      </nav>

      <header className="mb-6">
        <p className="microlabel">Reference</p>
        <h1 className="display-title mt-1 text-4xl uppercase tracking-tight sm:text-5xl">
          Movelist
        </h1>
        <p className="mt-2 text-sm text-muted">
          Every {character.name} move in the verified table — {entries.length}{" "}
          of them, the same numbers the lessons use.
        </p>
      </header>

      <div className="sticky top-0 z-20 -mx-4 mb-4 bg-bg/95 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0">
        <label className="relative block">
          <span className="sr-only">Search moves</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="df1, hellsweep, homing…"
            className="w-full clip-row border border-border bg-surface py-3 pl-9 pr-3 text-sm text-fg placeholder:text-faint focus:border-accent focus:outline-none"
          />
        </label>

        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
          className="mt-2 flex min-h-[36px] w-full items-center justify-center gap-2 clip-row border border-border bg-surface text-[11px] font-semibold uppercase tracking-wider text-muted transition-colors hover:text-fg sm:hidden"
        >
          <SlidersHorizontal className="size-3.5" aria-hidden />
          Filters
          {activeFilterCount > 0 && (
            <span className="tnum rounded-full bg-accent-dim px-1.5 py-0.5 text-[10px] text-accent-bright">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className={cn(filtersOpen ? "block" : "hidden sm:block")}>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {HEIGHTS.map((h) => (
            <Chip
              key={h}
              active={height === h}
              onClick={() => setHeight(height === h ? null : h)}
            >
              {HEIGHT_LABEL[h]}
            </Chip>
          ))}
          <span className="mx-1 w-px bg-border" aria-hidden />
          {SPEED_CAPS.map((cap) => (
            <Chip
              key={cap}
              active={maxStartup === cap}
              onClick={() => setMaxStartup(maxStartup === cap ? null : cap)}
            >
              i{cap} or faster
            </Chip>
          ))}
        </div>

        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {TRAITS.map((t) => (
            <Chip key={t} active={traits.includes(t)} onClick={() => toggleTrait(t)}>
              {TRAIT_LABEL[t]}
            </Chip>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="microlabel mr-1">Sort</span>
          {SORTS.map((s) => (
            <Chip key={s.id} active={sort === s.id} onClick={() => setSort(s.id)}>
              {s.label}
            </Chip>
          ))}
          {filtersActive && (
            <button
              type="button"
              onClick={clear}
              className="ml-auto inline-flex min-h-[32px] items-center gap-1 px-2 text-[11px] font-medium text-muted transition-colors hover:text-fg"
            >
              <X className="size-3" aria-hidden /> Clear
            </button>
          )}
        </div>
        </div>
      </div>

      <p className="mb-3 text-[11px] uppercase tracking-wider text-faint" aria-live="polite">
        {filtered.length} of {entries.length} moves
      </p>

      {filtered.length === 0 ? (
        <p className="clip-panel border border-border bg-surface p-8 text-center text-sm text-muted">
          Nothing matches those filters.
        </p>
      ) : (
        <div className="overflow-hidden clip-panel border border-border bg-surface">
          <ul className="divide-y divide-border">
            {filtered.map(([key, move]) => {
              const taught = taughtBy.get(key);
              return (
                <li key={key}>
                  <MoveRow
                    move={move}
                    override={live.overrides[key]}
                    trailing={
                      taught ? (
                        <Link
                          href={`/training/${character.id}/stage/${taught.stage}/item/${taught.itemId}`}
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider transition-colors",
                            learned.has(taught.itemId)
                              ? "border-accent/40 bg-accent-dim text-accent-bright hover:border-accent"
                              : "border-border bg-surface-2 text-muted hover:text-fg",
                          )}
                        >
                          {learned.has(taught.itemId) ? "Learned" : "Lesson"}
                        </Link>
                      ) : null
                    }
                  />
                </li>
              );
            })}
          </ul>
          <ProvenanceFooter set={set} now={state.hydratedAt} live={live} />
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-[32px] rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors",
        active
          ? "border-accent bg-accent-dim text-accent-bright"
          : "border-border bg-surface text-muted hover:border-border-strong hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
