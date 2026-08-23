"use client";

import Link from "next/link";
import { Repeat } from "lucide-react";
import type { Character, CharacterSummary } from "@/types";
import { characters } from "@/data/characters";
import { nextRank, rankFor } from "@/lib/ranks";
import { formatRelativeTime, pad2 } from "@/lib/utils";
import { ProgressBar } from "./ProgressBar";

export function CharacterHeader({
  character,
  summary,
  lastPracticedAt,
  now,
}: {
  character: Character;
  summary: CharacterSummary;
  lastPracticedAt?: number | null;
  now?: number;
}) {
  const rank = rankFor(summary.learnedCount, summary.totalCount);
  const next = nextRank(summary.learnedCount, summary.totalCount);

  return (
    <header className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="microlabel">{character.style}</p>
          <h1 className="mt-1 text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            {character.name}
          </h1>
        </div>
        {characters.length > 1 && (
          <Link
            href="/characters"
            className="mt-1 inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:border-border-strong hover:text-fg"
          >
            <Repeat className="size-3.5" aria-hidden /> Switch
          </Link>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="rounded-full border border-accent/40 bg-accent-dim px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-bright">
          {rank.name}
        </span>
        {next && (
          <span className="text-[11px] text-faint">
            {next.itemsToGo} more to {next.rank.name}
          </span>
        )}
        {now !== undefined && lastPracticedAt !== undefined && (
          <span className="text-[11px] text-faint">
            · practiced {formatRelativeTime(lastPracticedAt ?? null, now)}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
        <div>
          <p className="tnum text-sm font-semibold text-fg">
            {summary.learnedCount} / {summary.totalCount}{" "}
            <span className="font-medium text-muted">learned</span>
          </p>
        </div>
        <div>
          <p className="tnum text-sm font-semibold text-fg">
            Stage {pad2(summary.currentStageNumber)}{" "}
            <span className="font-medium text-muted">
              / {pad2(summary.stages.length)}
            </span>
          </p>
        </div>
        <div className="w-full max-w-xs">
          <ProgressBar
            fraction={
              summary.totalCount ? summary.learnedCount / summary.totalCount : 0
            }
            height={6}
            label={`${character.name} overall progress`}
          />
        </div>
      </div>
    </header>
  );
}
