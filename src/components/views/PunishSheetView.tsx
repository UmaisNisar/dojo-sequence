"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Info } from "lucide-react";
import type {
  Character,
  MoveFrames,
  PunishEntry,
  PunishSection,
  WhiffPunishEntry,
} from "@/types";
import { getFrameData } from "@/data/frames";
import { enemyFrames, getPunishers } from "@/data/punishers";
import { useLiveFrames } from "@/hooks/use-live-frames";
import { useProgress } from "@/hooks/use-progress";
import { isLaunch } from "@/lib/move-traits";
import { lessonHref } from "@/lib/progression";
import { cn } from "@/lib/utils";
import { Notation } from "@/components/Notation";
import { frameTone } from "@/components/MoveRow";
import { ProvenanceFooter } from "@/components/FrameDataPanel";

const TABS: { id: PunishSection | "whiff"; label: string; hint: string }[] = [
  { id: "standing", label: "Standing", hint: "You blocked it on your feet" },
  { id: "crouching", label: "Crouching", hint: "You blocked it crouching" },
  { id: "backTurned", label: "Back turned", hint: "They are facing away" },
  { id: "grounded", label: "Grounded", hint: "They are on the floor" },
  { id: "whiff", label: "Whiff", hint: "They missed entirely" },
];

/**
 * "They are -12, what do I hit?" — the single most-consulted thing in Tekken,
 * and the one question the curriculum could only answer by reading four
 * lessons in the Punishment stage in order.
 *
 * The entries are Wavu's curated punisher tables rather than every move whose
 * startup happens to fit. That distinction matters: a derived list confidently
 * recommends moves that reach on paper and whiff, duck under, or simply are
 * not worth taking. Damage and frames still come from our own frame table, so
 * a patch moves both surfaces together.
 */
export function PunishSheetView({ character }: { character: Character }) {
  const set = getFrameData(character.id);
  const punishers = getPunishers(character.id);
  const live = useLiveFrames(character.id);
  const { state } = useProgress();
  const [tab, setTab] = useState<PunishSection | "whiff">("standing");

  const available = useMemo(
    () =>
      TABS.filter((t) =>
        t.id === "whiff"
          ? (punishers?.whiff.length ?? 0) > 0
          : (punishers?.sections[t.id]?.length ?? 0) > 0,
      ),
    [punishers],
  );

  /** Group by the disadvantage answered, so -12 reads as one decision. */
  const grouped = useMemo(() => {
    if (!punishers || tab === "whiff") return [];
    const rows = punishers.sections[tab] ?? [];
    const byEnemy = new Map<string, PunishEntry[]>();
    for (const row of rows) {
      const key = row.enemy ?? "—";
      byEnemy.set(key, [...(byEnemy.get(key) ?? []), row]);
    }
    return [...byEnemy.entries()].sort(
      (a, b) => enemyFrames(a[0]) - enemyFrames(b[0]),
    );
  }, [punishers, tab]);

  if (!punishers || !set) {
    return (
      <p className="py-20 text-center text-sm text-muted">
        No punish sheet for {character.name} yet.
      </p>
    );
  }

  const activeTab = available.some((t) => t.id === tab) ? tab : available[0]?.id;

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
          Punishers
        </h1>
        <p className="mt-2 text-sm text-muted">
          What to hit them with, by how negative they are. Curated by Wavu Wiki
          — moves that reach on paper but whiff in practice are already gone.
        </p>
      </header>

      <div className="mb-5 flex flex-wrap gap-2">
        {available.map((t) => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-pressed={active}
              className={cn(
                "clip-row border px-3 py-2 text-left transition-colors",
                active
                  ? "border-accent bg-accent-dim"
                  : "border-border bg-surface hover:border-border-strong",
              )}
            >
              <span
                className={cn(
                  "block text-[13px] font-bold uppercase tracking-wide",
                  active ? "text-accent-bright" : "text-muted",
                )}
              >
                {t.label}
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-faint">
                {t.hint}
              </span>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden clip-panel border border-border bg-surface">
        {activeTab === "whiff" ? (
          <ul className="divide-y divide-border">
            {punishers.whiff.map((entry, i) => (
              <li key={`${entry.moveKey ?? entry.input}-${i}`}>
                <WhiffRow entry={entry} moves={set.moves} character={character} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="divide-y divide-border">
            {grouped.map(([enemy, rows]) => (
              <section key={enemy}>
                <div className="flex items-baseline gap-3 border-b border-border bg-surface-2/60 px-4 py-2 sm:px-5">
                  <span className="tnum font-mono text-lg font-bold text-frame-minus">
                    {enemy}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-faint">
                    {rows.length === 1 ? "one answer" : `${rows.length} answers`}
                  </span>
                </div>
                <ul className="divide-y divide-border">
                  {rows.map((entry, i) => (
                    <li key={`${entry.moveKey ?? entry.input}-${i}`}>
                      <PunishRow
                        entry={entry}
                        moves={set.moves}
                        character={character}
                        override={
                          entry.moveKey ? live.overrides[entry.moveKey] : undefined
                        }
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        <ProvenanceFooter set={set} now={state.hydratedAt} live={live} />
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-relaxed text-faint">
        <Info className="mt-0.5 size-3 shrink-0" aria-hidden />
        Punish list from{" "}
        <a
          href={punishers.source}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-muted underline decoration-border underline-offset-2 transition-colors hover:text-fg"
        >
          Wavu Wiki
          <ExternalLink className="size-2.5" aria-hidden />
        </a>
        , checked {punishers.verifiedAt}. Frame values come from this app&apos;s
        own verified table.
      </p>
    </div>
  );
}

/** The notation, with a link into the lesson when the curriculum teaches it. */
function MoveLabel({
  move,
  input,
  character,
  moveKey,
}: {
  move?: MoveFrames;
  input: string | null;
  character: Character;
  moveKey: string | null;
}) {
  const notation = move?.input ?? input ?? "—";
  const href = lessonHref(character, moveKey);

  const label = (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <Notation value={notation} size="sm" />
      {move && move.name !== move.input && (
        <span className="text-xs font-semibold text-fg">{move.name}</span>
      )}
    </span>
  );

  return href ? (
    <Link href={href} className="transition-opacity hover:opacity-80">
      {label}
    </Link>
  ) : (
    label
  );
}

function PunishRow({
  entry,
  moves,
  character,
  override,
}: {
  entry: PunishEntry;
  moves: Record<string, MoveFrames>;
  character: Character;
  override?: { hit?: string };
}) {
  const move = entry.moveKey ? moves[entry.moveKey] : undefined;
  // The page's own `frames` wins when it has one — it describes the punish
  // (a Heat Engager route, a stance exit), not the move's plain hit value.
  const outcome = entry.frames ?? override?.hit ?? move?.hit ?? null;
  const damage = entry.damage ?? move?.damageTotal?.toString() ?? null;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-5">
      <div className="min-w-0 flex-1">
        <MoveLabel
          move={move}
          input={entry.input}
          character={character}
          moveKey={entry.moveKey}
        />
        {entry.notes.length > 0 && (
          <ul className="mt-1.5 flex flex-col gap-0.5">
            {entry.notes.map((note) => (
              <li key={note} className="text-[10px] leading-relaxed text-faint">
                {note}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {damage && (
          <Stat label="Damage" value={damage} />
        )}
        {outcome && (
          <Stat
            label="Leaves you"
            value={outcome}
            className={frameTone(outcome)}
          />
        )}
        {entry.combo && (
          <Stat
            label="Combo"
            value={entry.combo}
            className={cn(isLaunch(outcome) && "text-frame-launch")}
          />
        )}
      </div>
    </div>
  );
}

function WhiffRow({
  entry,
  moves,
  character,
}: {
  entry: WhiffPunishEntry;
  moves: Record<string, MoveFrames>;
  character: Character;
}) {
  const move = entry.moveKey ? moves[entry.moveKey] : undefined;
  const speed = entry.speed ?? move?.displayStartup ?? move?.startup ?? null;
  const damage = entry.damage ?? move?.damageTotal?.toString() ?? null;
  const risk = entry.risk ?? move?.block ?? null;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-5">
      <div className="min-w-0 flex-1">
        <MoveLabel
          move={move}
          input={entry.input}
          character={character}
          moveKey={entry.moveKey}
        />
        {entry.notes.length > 0 && (
          <ul className="mt-1.5 flex flex-col gap-0.5">
            {entry.notes.map((note) => (
              <li key={note} className="text-[10px] leading-relaxed text-faint">
                {note}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {speed && <Stat label="Speed" value={speed} />}
        {damage && <Stat label="Damage" value={damage} />}
        {risk && <Stat label="If blocked" value={risk} className={frameTone(risk)} />}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="clip-row bg-surface-2 px-2 py-1.5 text-center">
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-faint">
        {label}
      </p>
      <p
        className={cn(
          "tnum mt-0.5 font-mono text-[11px] font-semibold sm:text-xs",
          className ?? "text-fg",
        )}
      >
        {value}
      </p>
    </div>
  );
}
