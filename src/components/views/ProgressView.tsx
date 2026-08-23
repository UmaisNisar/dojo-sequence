"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, Lock, RefreshCw, Timer } from "lucide-react";
import type { Character, TrainingItem } from "@/types";
import { useProgress } from "@/hooks/use-progress";
import {
  allItems,
  findItem,
  getItemProgress,
  summarizeCharacter,
} from "@/lib/progression";
import { nextRank, rankFor } from "@/lib/ranks";
import { cn, formatRelativeTime, pad2 } from "@/lib/utils";
import { ProgressBar } from "@/components/ProgressBar";

export function ProgressView({ character }: { character: Character }) {
  const { state } = useProgress();
  const progress = state.characters[character.id];
  const now = state.hydratedAt;
  const summary = useMemo(
    () => summarizeCharacter(character, progress),
    [character, progress],
  );

  const lastPractice = useMemo(() => {
    let latest = 0;
    for (const p of Object.values(progress?.items ?? {})) {
      latest = Math.max(latest, p.lastPracticedAt ?? 0, p.lastReviewedAt ?? 0);
    }
    return latest || null;
  }, [progress]);

  /** Learned items untouched for over a week — retention debt. */
  const needsReview = useMemo(() => {
    if (!now) return [];
    const WEEK = 7 * 86_400_000;
    const overdue: { item: TrainingItem; lastTouched: number }[] = [];
    for (const item of allItems(character)) {
      const p = getItemProgress(progress, item.id);
      if (p.status !== "learned") continue;
      const lastTouched = Math.max(
        p.lastReviewedAt ?? 0,
        p.lastPracticedAt ?? 0,
        p.learnedAt ?? 0,
      );
      if (now - lastTouched > WEEK) overdue.push({ item, lastTouched });
    }
    overdue.sort((a, b) => a.lastTouched - b.lastTouched);
    return overdue.slice(0, 5);
  }, [character, progress, now]);

  const quizStats = state.quizStats[character.id];

  return (
    <div>
      <header className="mb-8">
        <p className="microlabel">Progress</p>
        <h1 className="mt-1 text-4xl font-bold uppercase tracking-tight sm:text-5xl">
          {character.name}
        </h1>
      </header>

      {/* Headline stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Rank"
          value={rankFor(summary.learnedCount, summary.totalCount).name}
          hint={(() => {
            const next = nextRank(summary.learnedCount, summary.totalCount);
            return next
              ? `${next.itemsToGo} to ${next.rank.name}`
              : "Top of the ladder";
          })()}
          small
          accent
        />
        <StatCard
          label="Learned"
          value={`${summary.learnedCount} / ${summary.totalCount}`}
        />
        <StatCard
          label="Stage"
          value={`${pad2(summary.currentStageNumber)} / ${pad2(summary.stages.length)}`}
        />
        <StatCard
          label="Last practice"
          value={formatRelativeTime(lastPractice, now)}
          small
        />
      </div>

      {quizStats && quizStats.runs > 0 && (
        <Link
          href={`/training/${character.id}/quiz`}
          className="group mb-8 flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong sm:p-5"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-accent/40 text-accent-bright">
            <Timer className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="microlabel">Punish reaction</h2>
            <p className="tnum mt-1 text-sm font-semibold">
              Best {quizStats.bestScore} / 10
              {quizStats.bestAvgMs !== null && (
                <span className="font-medium text-muted">
                  {" "}
                  · avg {(quizStats.bestAvgMs / 1000).toFixed(2)}s ·{" "}
                  {quizStats.runs} run{quizStats.runs === 1 ? "" : "s"}
                </span>
              )}
            </p>
          </div>
          <span className="text-xs font-medium text-muted transition-colors group-hover:text-fg">
            Run again →
          </span>
        </Link>
      )}

      {needsReview.length > 0 && (
        <section aria-labelledby="needs-review-heading" className="mb-8">
          <h2
            id="needs-review-heading"
            className="microlabel mb-3 flex items-center gap-1.5"
          >
            <RefreshCw className="size-3.5" aria-hidden /> Getting rusty —
            review these
          </h2>
          <ol className="flex flex-col gap-2">
            {needsReview.map(({ item, lastTouched }) => {
              const stageNumber = findItem(character, item.id)?.stage.number ?? 1;
              return (
                <li key={item.id}>
                  <Link
                    href={`/training/${character.id}/stage/${stageNumber}/item/${item.id}`}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{item.name}</p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        Stage {pad2(stageNumber)} · practiced{" "}
                        {formatRelativeTime(lastTouched, now)}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-muted transition-colors group-hover:text-fg">
                      Review →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <section aria-label="Stage breakdown" className="flex flex-col gap-2">
        {summary.stages.map((s, index) => {
          const fraction = s.totalCount ? s.learnedCount / s.totalCount : 0;
          const locked = s.status === "locked";
          return (
            <motion.div
              key={s.stage.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.25, ease: "easeOut" }}
              className={cn(
                "rounded-xl border border-border bg-surface p-4 sm:p-5",
                locked && "opacity-60",
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="tnum font-mono text-xs font-semibold text-muted">
                    {pad2(s.stage.number)}
                  </span>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.08em]">
                    {locked ? (
                      s.stage.name
                    ) : (
                      <Link
                        href={`/training/${character.id}/stage/${s.stage.number}`}
                        className="transition-colors hover:text-accent-bright"
                      >
                        {s.stage.name}
                      </Link>
                    )}
                  </h2>
                  {s.status === "complete" && (
                    <Check className="size-4 text-accent-bright" aria-label="Complete" />
                  )}
                  {locked && <Lock className="size-3.5 text-faint" aria-label="Locked" />}
                </div>
                <span className="tnum text-xs text-muted">
                  {s.learnedCount} / {s.totalCount}
                </span>
              </div>
              <div className="mt-3">
                <ProgressBar
                  fraction={fraction}
                  height={5}
                  label={`${s.stage.name} progress`}
                />
              </div>

              {/* Per-item dots */}
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-hidden>
                {s.stage.items.map((item) => {
                  const st = getItemProgress(progress, item.id).status;
                  return (
                    <li
                      key={item.id}
                      title={item.name}
                      className={cn(
                        "size-2 rounded-full",
                        st === "learned"
                          ? "bg-accent"
                          : st === "drilling"
                            ? "bg-accent/40"
                            : "bg-surface-3",
                      )}
                    />
                  );
                })}
              </ul>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  small,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  small?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-surface p-4 sm:p-5",
        accent ? "border-accent/40" : "border-border",
      )}
    >
      <p className="microlabel">{label}</p>
      <p
        className={cn(
          "tnum mt-2 font-bold",
          small ? "text-lg" : "text-2xl sm:text-3xl",
          accent && "text-accent-bright",
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-[11px] text-faint">{hint}</p>}
    </div>
  );
}
