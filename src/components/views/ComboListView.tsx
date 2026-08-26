"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Info } from "lucide-react";
import type { Character, ComboGroup, ComboRoute, MoveFrames } from "@/types";
import { getFrameData } from "@/data/frames";
import { COMBO_MARKERS, getCombos, isComboMarker, markersUsed } from "@/data/combos";
import { lessonHref } from "@/lib/progression";
import { cn } from "@/lib/utils";
import { Notation } from "@/components/Notation";

/**
 * Combos, as data rather than prose.
 *
 * Stage 5 is "Core Combos" for every character, and until now a combo was a
 * string in a lesson's `notation` field — no damage, no wall carry, no way to
 * read the route as a sequence. These come from Wavu's combo pages, which
 * group routes under the launchers they work from, which is also how you
 * actually look a combo up: "I hit them with df+2, now what?"
 */
export function ComboListView({ character }: { character: Character }) {
  const set = getCombos(character.id);
  const frames = getFrameData(character.id);
  const [sectionId, setSectionId] = useState<string | null>(null);

  const sections = useMemo(() => set?.sections ?? [], [set]);
  const legend = useMemo(() => (set ? markersUsed(set) : []), [set]);
  /* Bread and butter comes first by convention but is often a single route,
     which opens the page looking broken. Default to the first section with
     enough in it to read as a list. */
  const initial = useMemo(() => {
    const routesIn = (s: (typeof sections)[number]) =>
      s.groups.reduce((n, g) => n + g.routes.length, 0);
    return sections.find((s) => routesIn(s) >= 3) ?? sections[0];
  }, [sections]);
  const active = useMemo(
    () => sections.find((s) => s.id === sectionId) ?? initial,
    [sections, sectionId, initial],
  );

  if (!set || sections.length === 0) {
    return (
      <p className="py-20 text-center text-sm text-muted">
        No combos for {character.name} yet.
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
          Combos
        </h1>
        <p className="mt-2 text-sm text-muted">
          Grouped by the launcher they work from — the way you look one up
          mid-match.
        </p>
      </header>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {sections.map((s) => {
          const isActive = active?.id === s.id;
          const routes = s.groups.reduce((n, g) => n + g.routes.length, 0);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSectionId(s.id)}
              aria-pressed={isActive}
              className={cn(
                "min-h-[36px] clip-row border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors",
                isActive
                  ? "border-accent bg-accent-dim text-accent-bright"
                  : "border-border bg-surface text-muted hover:border-border-strong hover:text-fg",
              )}
            >
              {s.label}
              <span className="ml-1.5 text-faint">{routes}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {active?.groups.map((group, i) => (
          <ComboGroupCard
            key={`${active.id}-${i}`}
            group={group}
            character={character}
            moves={frames?.moves ?? {}}
          />
        ))}
      </div>

      <div className="mt-5 clip-panel border border-border bg-surface-2/60 p-4">
        <p className="microlabel mb-2">Notation</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {legend.map(([token, label]) => (
            <li key={token} className="flex items-center gap-1.5 text-[11px]">
              <span className="rounded-sm bg-accent-dim px-1.5 py-0.5 font-mono text-[10px] font-bold text-accent-bright">
                {token}
              </span>
              <span className="text-muted">{label}</span>
            </li>
          ))}
          <li className="flex items-center gap-1.5 text-[11px]">
            <span className="rounded-sm bg-surface px-1.5 py-0.5 font-mono text-[10px] font-bold text-fg">
              #
            </span>
            <span className="text-muted">just frame (electric)</span>
          </li>
        </ul>
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-relaxed text-faint">
        <Info className="mt-0.5 size-3 shrink-0" aria-hidden />
        Routes from{" "}
        <a
          href={set.source}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-muted underline decoration-border underline-offset-2 transition-colors hover:text-fg"
        >
          Wavu Wiki
          <ExternalLink className="size-2.5" aria-hidden />
        </a>
        , checked {set.verifiedAt} against {set.gameVersion}. Damage figures are
        the wiki&apos;s and assume the stated starter.
      </p>
    </div>
  );
}

function ComboGroupCard({
  group,
  character,
  moves,
}: {
  group: ComboGroup;
  character: Character;
  moves: Record<string, MoveFrames>;
}) {
  return (
    <section className="overflow-hidden clip-panel border border-border bg-surface">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border bg-surface-2/60 px-4 py-2.5 sm:px-5">
        <span className="microlabel shrink-0">From</span>
        {group.starters.map((starter, i) => {
          const move = starter.moveKey ? moves[starter.moveKey] : undefined;
          const href = lessonHref(character, starter.moveKey);
          const body = (
            <span className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-semibold text-fg">
                {starter.label}
              </span>
              {move && move.name !== move.input && (
                <span className="text-[10px] text-faint">{move.name}</span>
              )}
              {starter.damage !== null && (
                <span className="tnum font-mono text-[10px] text-faint">
                  {starter.damage}
                </span>
              )}
            </span>
          );
          return (
            <span key={`${starter.label}-${i}`}>
              {href ? (
                <Link
                  href={href}
                  className="transition-colors hover:text-accent-bright"
                >
                  {body}
                </Link>
              ) : (
                body
              )}
            </span>
          );
        })}
      </div>

      <ol className="divide-y divide-border">
        {group.routes.map((route, i) => (
          <li key={`${route.notation}-${i}`}>
            <RouteRow route={route} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function RouteRow({ route }: { route: ComboRoute }) {
  // Space-separated segments are the beats of the combo; the wiki writes each
  // hit (or stance transition) as one token, which is exactly how it is drilled.
  const steps = route.notation.split(/\s+/).filter(Boolean);

  return (
    <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:gap-4 sm:px-5">
      <ol className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
        {steps.map((step, i) => (
          <li key={`${step}-${i}`}>
            {isComboMarker(step) ? (
              <span
                title={COMBO_MARKERS[step]}
                className="rounded-sm bg-accent-dim px-1.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-accent-bright"
              >
                {step}
              </span>
            ) : (
              <Notation value={step} size="sm" />
            )}
          </li>
        ))}
      </ol>

      <div className="flex shrink-0 items-center gap-2">
        {route.damage !== null && (
          <div className="clip-row bg-surface-2 px-2 py-1.5 text-center">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-faint">
              Damage
            </p>
            <p className="tnum mt-0.5 font-mono text-xs font-semibold text-frame-launch">
              {route.damage}
            </p>
          </div>
        )}
        {route.recoverable !== null && (
          <div
            className="clip-row bg-surface-2 px-2 py-1.5 text-center"
            title="Grey health the opponent recovers"
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-faint">
              Recovers
            </p>
            <p className="tnum mt-0.5 font-mono text-xs font-semibold text-fg">
              {route.recoverable}
            </p>
          </div>
        )}
      </div>

      {route.notes.length > 0 && (
        <ul className="w-full basis-full sm:basis-auto">
          {route.notes.map((note) => (
            <li key={note} className="text-[10px] leading-relaxed text-faint">
              {note}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
