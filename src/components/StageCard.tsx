"use client";

import Link from "next/link";
import { ChevronRight, Lock } from "lucide-react";
import type { StageSummary } from "@/types";
import { cn, pad2 } from "@/lib/utils";
import { ProgressBar } from "./ProgressBar";

export function StageCard({
  characterId,
  summary,
  isNext,
}: {
  characterId: string;
  summary: StageSummary;
  isNext: boolean;
}) {
  const { stage, status, learnedCount, totalCount } = summary;
  const locked = status === "locked";

  const inner = (
    <div
      className={cn(
        "group relative flex items-center gap-4 clip-panel border p-4 transition-colors sm:p-5",
        locked
          ? "border-border bg-surface opacity-60"
          : "border-border bg-surface hover:border-border-strong",
        isNext && "border-accent/40",
      )}
    >
      <div
        className={cn(
          "tnum flex size-11 shrink-0 items-center justify-center clip-row border font-mono text-sm font-semibold",
          status === "complete"
            ? "border-accent/50 bg-accent-dim text-accent-bright"
            : locked
              ? "border-border text-faint"
              : "border-border-strong text-fg",
        )}
      >
        {locked ? <Lock className="size-4" aria-hidden /> : pad2(stage.number)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h3
            className={cn(
              "truncate text-sm font-semibold uppercase tracking-[0.08em]",
              locked ? "text-muted" : "text-fg",
            )}
          >
            {stage.name}
          </h3>
          {isNext && (
            <span className="microlabel shrink-0 text-accent-bright">current</span>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted">{stage.focus}</p>
        {!locked && (
          <div className="mt-2.5 flex items-center gap-3">
            <ProgressBar
              fraction={totalCount ? learnedCount / totalCount : 0}
              className="max-w-[10rem]"
              label={`${stage.name} progress`}
            />
            <span className="tnum text-xs text-muted">
              {learnedCount} / {totalCount}
            </span>
          </div>
        )}
        {locked && (
          <p className="mt-1.5 text-[11px] text-faint">
            Complete Stage {pad2(stage.number - 1)} to unlock
          </p>
        )}
      </div>

      {!locked && (
        <ChevronRight
          className="size-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-muted"
          aria-hidden
        />
      )}
    </div>
  );

  if (locked) {
    return <div aria-disabled="true">{inner}</div>;
  }

  return (
    <Link
      href={`/training/${characterId}/stage/${stage.number}`}
      aria-label={`Stage ${stage.number}: ${stage.name}, ${learnedCount} of ${totalCount} learned`}
    >
      {inner}
    </Link>
  );
}
