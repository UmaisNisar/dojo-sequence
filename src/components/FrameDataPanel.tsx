"use client";

import { ExternalLink, RadioTower, TriangleAlert } from "lucide-react";
import type { FrameDataSet, MoveFrames } from "@/types";
import { getFrameData, frameDataAgeDays, isFrameDataStale } from "@/data/frames";
import { useLiveFrames } from "@/hooks/use-live-frames";
import type { LiveFrameOverride, LiveFramesState } from "@/lib/live-frames";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Notation } from "./Notation";

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
      className="mb-8 overflow-hidden rounded-xl border border-border bg-surface"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5 sm:px-5">
        <h2 className="microlabel">Frame data</h2>
        <p className="text-[10px] text-faint">verified {set.gameVersion}</p>
      </div>

      <div className="divide-y divide-border">
        {moves.map(({ key, move }) => (
          <FrameRow key={move.wavuId} move={move} override={live.overrides[key]} />
        ))}
      </div>

      <ProvenanceFooter set={set} now={now} live={live} />
    </section>
  );
}

function FrameRow({
  move,
  override,
}: {
  move: MoveFrames;
  override?: LiveFrameOverride;
}) {
  return (
    <div className="px-4 py-3 sm:px-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Notation value={move.input} size="sm" />
        <span className="text-xs font-semibold text-fg">{move.name}</span>
        <span className="font-mono text-[10px] uppercase text-faint">
          {move.level}
        </span>
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
          highlightPlus
        />
        <FrameCell
          label="Hit"
          value={override?.hit ?? move.hit}
          liveUpdated={override?.hit !== undefined}
        />
        <FrameCell
          label="CH"
          value={override?.ch ?? move.ch ?? "—"}
          liveUpdated={override?.ch !== undefined}
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
  );
}

function FrameCell({
  label,
  value,
  liveUpdated,
  highlightPlus,
}: {
  label: string;
  value: string;
  liveUpdated?: boolean;
  highlightPlus?: boolean;
}) {
  const isPlus = highlightPlus && value.startsWith("+");
  return (
    <div
      className={cn(
        "relative rounded-lg px-2 py-1.5 text-center",
        liveUpdated
          ? "bg-accent-dim ring-1 ring-accent/40"
          : "bg-surface-2",
      )}
    >
      <dt className="text-[9px] font-semibold uppercase tracking-[0.12em] text-faint">
        {label}
      </dt>
      <dd
        className={cn(
          "tnum mt-0.5 break-words font-mono text-[11px] font-semibold sm:text-xs",
          isPlus || liveUpdated ? "text-accent-bright" : "text-fg",
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
