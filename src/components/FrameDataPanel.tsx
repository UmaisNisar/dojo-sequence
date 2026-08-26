"use client";

import { ExternalLink, RadioTower, TriangleAlert } from "lucide-react";
import type { FrameDataSet, MoveFrames } from "@/types";
import { getFrameData, frameDataAgeDays, isFrameDataStale } from "@/data/frames";
import { useLiveFrames } from "@/hooks/use-live-frames";
import type { LiveFramesState } from "@/lib/live-frames";
import { cn, formatRelativeTime } from "@/lib/utils";
import { MoveRow } from "./MoveRow";

/**
 * Verified frame data for the moves an item covers.
 * Numbers come from the character's versioned frame table, and while the app
 * is open they're background-checked against Wavu Wiki's live database —
 * patch-changed values render live (highlighted) instead of the bundled ones.
 */
export function FrameDataPanel({
  characterId,
  moveKeys,
  now,
}: {
  characterId: string;
  moveKeys: string[];
  now: number;
}) {
  const set = getFrameData(characterId);
  const live = useLiveFrames(characterId);
  if (!set) return null;
  const moves = moveKeys
    .map((k) => ({ key: k, move: set.moves[k] }))
    .filter((m): m is { key: string; move: MoveFrames } => Boolean(m.move));
  if (moves.length === 0) return null;

  return (
    <section
      aria-label="Frame data"
      className="mb-8 overflow-hidden clip-panel border border-border bg-surface"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5 sm:px-5">
        <h2 className="microlabel">Frame data</h2>
        <p className="text-[10px] text-faint">verified {set.gameVersion}</p>
      </div>

      <div className="divide-y divide-border">
        {moves.map(({ key, move }) => (
          <MoveRow key={move.wavuId} move={move} override={live.overrides[key]} />
        ))}
      </div>

      <ProvenanceFooter set={set} now={now} live={live} />
    </section>
  );
}

export function ProvenanceFooter({
  set,
  now,
  live,
  className,
}: {
  set: FrameDataSet;
  now: number;
  live?: LiveFramesState;
  className?: string;
}) {
  const liveOk = live?.status === "ok";
  const liveChanged = liveOk && Object.keys(live.overrides).length > 0;
  // A successful live check supersedes the calendar-based staleness warning.
  const stale = !liveOk && now > 0 && isFrameDataStale(set, now);
  const ageDays = now > 0 ? frameDataAgeDays(set, now) : 0;

  return (
    <div
      className={cn(
        "border-t border-border bg-surface-2/60 px-4 py-2.5 sm:px-5",
        className,
      )}
    >
      <p className="text-[10px] leading-relaxed text-faint">
        Verified against {set.game} {set.gameVersion} on {set.verifiedAt} ·{" "}
        {set.sources.map((s, i) => (
          <span key={s.url}>
            {i > 0 && " · "}
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-muted underline decoration-border underline-offset-2 transition-colors hover:text-fg"
            >
              {s.name}
              <ExternalLink className="size-2.5" aria-hidden />
            </a>
          </span>
        ))}
      </p>

      {live && live.status !== "idle" && (
        <p
          className={cn(
            "mt-1.5 flex items-start gap-1.5 text-[10px] leading-relaxed",
            liveChanged ? "text-accent-bright" : "text-faint",
          )}
          aria-live="polite"
        >
          <RadioTower className="mt-0.5 size-3 shrink-0" aria-hidden />
          {live.status === "checking" && "Checking live frame data…"}
          {live.status === "ok" &&
            (liveChanged
              ? `Live values from Wavu Wiki (checked ${formatRelativeTime(live.checkedAt, now)}) — highlighted cells changed since ${set.gameVersion}.`
              : `Live-checked against Wavu Wiki ${formatRelativeTime(live.checkedAt, now)} — matches the bundled table.`)}
          {live.status === "error" &&
            "Couldn't reach Wavu Wiki — showing bundled values."}
        </p>
      )}

      {stale && (
        <p className="mt-1.5 flex items-start gap-1.5 text-[10px] leading-relaxed text-danger">
          <TriangleAlert className="mt-0.5 size-3 shrink-0" aria-hidden />
          This data was verified {ageDays} days ago — a patch may have shipped
          since. Cross-check the live sources above before trusting exact
          numbers.
        </p>
      )}
    </div>
  );
}
