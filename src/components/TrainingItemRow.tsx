"use client";

import Link from "next/link";
import { Check, ChevronRight, Lock } from "lucide-react";
import type { ItemStatus, TrainingItem } from "@/types";
import { cn, pad2 } from "@/lib/utils";
import { Notation } from "./Notation";

export function TrainingItemRow({
  characterId,
  stageNumber,
  item,
  index,
  status,
  unlocked,
}: {
  characterId: string;
  stageNumber: number;
  item: TrainingItem;
  index: number;
  status: ItemStatus;
  unlocked: boolean;
}) {
  const learned = status === "learned";
  const locked = !unlocked;

  const inner = (
    <div
      className={cn(
        "clip-row group relative flex items-stretch gap-0 border transition-colors",
        locked
          ? "border-border bg-surface opacity-50"
          : "border-border bg-surface hover:border-border-strong hover:bg-surface-2",
      )}
    >
      {/* Accent spine — the character's colour, lit once the item is learned. */}
      <span
        aria-hidden
        className={cn(
          "w-[3px] shrink-0 transition-colors",
          learned
            ? "bg-accent"
            : locked
              ? "bg-border"
              : "bg-border-strong group-hover:bg-accent-deep",
        )}
      />

      <span
        className={cn(
          "tnum flex w-11 shrink-0 items-center justify-center font-mono text-[11px] font-bold tracking-widest",
          learned ? "text-accent-bright" : locked ? "text-faint" : "text-muted",
        )}
      >
        {pad2(index + 1)}
      </span>

      <div className="min-w-0 flex-1 py-3.5 pr-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3
            className={cn(
              "text-[13px] font-bold uppercase tracking-[0.06em]",
              locked ? "text-muted" : "text-fg",
            )}
          >
            {item.name}
          </h3>
          {item.notation && item.notation !== "—" && (
            <Notation value={item.notation} size="sm" />
          )}
        </div>
        <p className="mt-1 line-clamp-1 text-xs text-muted">{item.purpose}</p>
      </div>

      <span className="flex shrink-0 items-center pr-4" aria-hidden={!locked && !learned}>
        {learned ? (
          <span
            className="clip-row flex size-6 items-center justify-center border border-accent/60 bg-accent-dim text-accent-bright"
            aria-label="Learned"
            role="img"
          >
            <Check className="size-3.5" strokeWidth={3} />
          </span>
        ) : locked ? (
          <span aria-label="Locked" role="img">
            <Lock className="size-4 text-faint" />
          </span>
        ) : (
          <ChevronRight className="size-4 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent-bright" />
        )}
      </span>
    </div>
  );

  if (locked) return <div aria-disabled="true">{inner}</div>;

  return (
    <Link
      href={`/training/${characterId}/stage/${stageNumber}/item/${item.id}`}
      aria-label={`${item.name}${learned ? ", learned" : ""}`}
    >
      {inner}
    </Link>
  );
}
