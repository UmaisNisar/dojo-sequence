"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import type { Character, MoveFrames } from "@/types";
import { getFrameData } from "@/data/frames";
import { getPunishers } from "@/data/punishers";
import { useActiveCharacter } from "@/hooks/use-progress";
import { startupFrames } from "@/lib/move-traits";
import { buildThreatSheet, punishFor, type ThreatKind } from "@/lib/threats";
import { cn } from "@/lib/utils";
import { Notation } from "@/components/Notation";
import { frameTone } from "@/components/MoveRow";
import { ProvenanceFooter } from "@/components/FrameDataPanel";

/**
 * "Fighting X" — the opponent's side of the matchup.
 *
 * Everything here is derived from the same verified frame table that powers
 * their curriculum, so the sheet cannot claim anything the move rows do not.
 * The one thing it adds is your side of it: for every move you can launch,
 * the punisher YOUR character actually uses at that disadvantage.
 */
export function MatchupView({ opponent }: { opponent: Character }) {
  const set = getFrameData(opponent.id);
  const you = useActiveCharacter();
  const yourPunishers = getPunishers(you.id);
  const yourFrames = getFrameData(you.id);
  const [kind, setKind] = useState<ThreatKind | null>(null);

  const groups = useMemo(() => (set ? buildThreatSheet(set) : []), [set]);
  const active = useMemo(
    () => groups.find((g) => g.kind === kind) ?? groups[0],
    [groups, kind],
  );

  if (!set || groups.length === 0) {
    return (
      <p className="py-20 text-center text-sm text-muted">
        No frame table for {opponent.name} yet.
      </p>
    );
  }

  return (
    <div>
      <nav className="mb-6" aria-label="Breadcrumb">
        <Link
          href="/matchups"
          className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          All matchups
        </Link>
      </nav>

      <header className="mb-6">
        <p className="microlabel">Matchup</p>
        <h1 className="display-title mt-1 text-4xl uppercase tracking-tight sm:text-5xl">
          Fighting {opponent.name}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {opponent.tagline}
        </p>
      </header>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {groups.map((g) => {
          const isActive = active?.kind === g.kind;
          return (
            <button
              key={g.kind}
              type="button"
              onClick={() => setKind(g.kind)}
              aria-pressed={isActive}
              className={cn(
                "min-h-[36px] clip-row border px-3 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wider transition-colors",
                isActive
                  ? "border-accent bg-accent-dim text-accent-bright"
                  : "border-border bg-surface text-muted hover:border-border-strong hover:text-fg",
              )}
            >
              {g.title}
              <span className="ml-1.5 text-faint">{g.moves.length}</span>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="overflow-hidden clip-panel border border-border bg-surface">
          <p className="flex items-start gap-2 border-b border-border bg-surface-2/60 px-4 py-3 text-xs leading-relaxed text-muted sm:px-5">
            <ShieldAlert
              className="mt-0.5 size-3.5 shrink-0 text-accent-bright"
              aria-hidden
            />
            {active.advice}
          </p>

          <ul className="divide-y divide-border">
            {active.moves.map(({ key, move }) => (
              <li key={key}>
                <ThreatRow
                  move={move}
                  showPunish={active.kind === "free-launch"}
                  you={you}
                  punish={
                    active.kind === "free-launch"
                      ? punishFor(yourPunishers, move.block)
                      : null
                  }
                  yourMoves={yourFrames?.moves ?? {}}
                />
              </li>
            ))}
          </ul>

          <ProvenanceFooter set={set} now={0} />
        </div>
      )}
    </div>
  );
}

function ThreatRow({
  move,
  showPunish,
  you,
  punish,
  yourMoves,
}: {
  move: MoveFrames;
  showPunish: boolean;
  you: Character;
  punish: ReturnType<typeof punishFor>;
  yourMoves: Record<string, MoveFrames>;
}) {
  const startup = startupFrames(move);
  const block = move.block;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <Notation value={move.input} size="sm" />
          {move.name !== move.input && (
            <span className="text-xs font-semibold text-fg">{move.name}</span>
          )}
          <span className="font-mono text-[10px] uppercase text-faint">
            {move.level}
          </span>
          {move.damageTotal !== null && (
            <span className="tnum font-mono text-[10px] text-faint">
              {move.damageTotal} dmg
            </span>
          )}
        </div>

        {/* Break instructions and conditional launches live in the notes. */}
        {move.notes.length > 0 && (
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {move.notes.slice(0, 4).map((note) => (
              <li
                key={note}
                className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted"
              >
                {note}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Cell label="Startup" value={startup !== null ? `i${startup}` : "—"} />
        <Cell
          label="Block"
          value={block ?? "—"}
          className={block ? frameTone(block) : undefined}
        />
        {showPunish && (
          <div className="clip-row bg-surface-2 px-2 py-1.5 text-center">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-faint">
              {you.name} punishes
            </p>
            <p className="tnum mt-0.5 font-mono text-[11px] font-semibold text-accent-bright">
              {/* Template entries identify the move by key, not by input — the
                  notation has to come from your own frame table. */}
              {punish
                ? ((punish.moveKey ? yourMoves[punish.moveKey]?.input : null) ??
                  punish.input ??
                  "—")
                : "—"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Cell({
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
