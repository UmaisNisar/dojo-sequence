"use client";

import type { MoveFrames } from "@/types";
import type { LiveFrameOverride } from "@/lib/live-frames";
import { cn } from "@/lib/utils";
import { Notation } from "./Notation";
import { MoveVideo } from "./MoveVideo";

/**
 * One move, rendered the same way everywhere it appears — inside a lesson's
 * frame panel, in the move index, and on the punish sheet. Extracted so those
 * three cannot drift apart: a player who learns to read the row on a lesson
 * page should not have to re-learn it two screens later.
 */
export function MoveRow({
  move,
  override,
  compact,
  trailing,
}: {
  move: MoveFrames;
  override?: LiveFrameOverride;
  /** Drop the clip and tighten the padding, for long lists. */
  compact?: boolean;
  /** Rendered top-right — the punish sheet puts the disadvantage there. */
  trailing?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4",
        compact ? "px-4 py-3 sm:px-5" : "px-4 py-3 sm:px-5",
      )}
    >
      {!compact && move.video && (
        <MoveVideo
          src={move.video}
          label={`${move.name} (${move.input})`}
          className="w-full shrink-0 sm:w-[200px]"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Notation value={move.input} size="sm" />
          {/* Wavu leaves some rows unnamed and the table falls back to the
              notation — showing it twice reads as a rendering bug. */}
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
          {trailing && <span className="ml-auto shrink-0">{trailing}</span>}
        </div>
        <dl className="mt-2.5 grid grid-cols-4 gap-2">
          <FrameCell
            label="Startup"
            value={override?.startup ?? move.displayStartup ?? move.startup ?? "—"}
            liveUpdated={override?.startup !== undefined}
          />
          <FrameCell
            label="Block"
            value={override?.block ?? move.block ?? "—"}
            liveUpdated={override?.block !== undefined}
            semantic
          />
          <FrameCell
            label="Hit"
            value={override?.hit ?? move.hit ?? "—"}
            liveUpdated={override?.hit !== undefined}
            semantic
          />
          <FrameCell
            label="CH"
            value={override?.ch ?? move.ch ?? "—"}
            liveUpdated={override?.ch !== undefined}
            semantic
          />
        </dl>
        {move.notes.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {move.notes.map((note) => (
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
    </div>
  );
}

/**
 * Colour by meaning, not decoration: a launch reads gold, advantage reads
 * Heat amber, deficit reads red. Scanning a panel should tell you whether a
 * move is your turn or theirs before you have read a single number.
 */
export function frameTone(value: string): string {
  if (!value || value === "—") return "text-fg";
  // "+43a", "+70a (+54)" — an aerial state, i.e. a full combo.
  if (/[+-]?\d+a/.test(value)) return "text-frame-launch";
  if (value.startsWith("+")) return "text-frame-plus";
  if (value.startsWith("-")) return "text-frame-minus";
  return "text-fg";
}

export function FrameCell({
  label,
  value,
  liveUpdated,
  semantic,
}: {
  label: string;
  value: string;
  liveUpdated?: boolean;
  /** Colour the value by what it means. Off for startup, which has no sign. */
  semantic?: boolean;
}) {
  const tone = semantic ? frameTone(value) : "text-fg";
  return (
    <div
      className={cn(
        "relative clip-row px-2 py-1.5 text-center",
        liveUpdated ? "bg-accent-dim ring-1 ring-accent/40" : "bg-surface-2",
      )}
    >
      <dt className="text-[9px] font-semibold uppercase tracking-[0.12em] text-faint">
        {label}
      </dt>
      <dd
        className={cn(
          "tnum mt-0.5 break-words font-mono text-[11px] font-semibold sm:text-xs",
          liveUpdated ? "text-accent-bright" : tone,
        )}
      >
        {value}
      </dd>
      {liveUpdated && (
        <span
          className="absolute -right-1 -top-1 size-2 rounded-full bg-accent"
          title="Updated live from Wavu Wiki"
          aria-label="Updated live from Wavu Wiki"
        />
      )}
    </div>
  );
}
