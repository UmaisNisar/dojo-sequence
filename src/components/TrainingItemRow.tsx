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
        "group flex items-center gap-3 rounded-xl border p-4 transition-colors sm:gap-4",
        locked
          ? "border-border bg-surface opacity-55"
          : "border-border bg-surface hover:border-border-strong",
      )}
    >
      <span
        className={cn(
          "tnum w-7 shrink-0 font-mono text-xs font-semibold",
          learned ? "text-accent-bright" : locked ? "text-faint" : "text-muted",
        )}
      >
        {pad2(index + 1)}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3
            className={cn(
              "text-sm font-semibold",
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

      <span className="shrink-0" aria-hidden={!locked && !learned}>
        {learned ? (
          <span
            className="flex size-6 items-center justify-center rounded-full border border-accent/50 bg-accent-dim text-accent-bright"
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
          <ChevronRight className="size-4 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-muted" />
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
