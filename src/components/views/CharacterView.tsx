"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Play, RefreshCw, RotateCcw, Timer, Trophy } from "lucide-react";
import type { Character, TrainingItem } from "@/types";
import { useProgress } from "@/hooks/use-progress";
import {
  allItems,
  buildSessionItems,
  buildTodayPlan,
  findItem,
  getItemProgress,
  getNextItem,
  summarizeCharacter,
} from "@/lib/progression";
import { Notation } from "@/components/Notation";
import { formatRelativeTime, pad2 } from "@/lib/utils";
import { CharacterHeader } from "@/components/CharacterHeader";
import { StageCard } from "@/components/StageCard";

export function CharacterView({ character }: { character: Character }) {
  const { state, dispatch } = useProgress();
  const router = useRouter();
  const progress = state.characters[character.id];
  const now = state.hydratedAt;
  const summary = useMemo(
    () => summarizeCharacter(character, progress),
    [character, progress],
  );

  const nextStageId = summary.stages.find((s) => s.status === "unlocked")?.stage.id;

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

  /* The curriculum screen is now the home screen, so it owns what Today
     used to: where you are, and the one button that resumes training. */
  const nextItem = useMemo(
    () => getNextItem(character, progress),
    [character, progress],
  );
  const nextHref = nextItem
    ? `/training/${character.id}/stage/${findItem(character, nextItem.id)?.stage.number ?? 1}/item/${nextItem.id}`
    : null;

  const plan = useMemo(
    () => buildTodayPlan(character, progress, now),
    [character, progress, now],
  );
  const hasSession = state.activeSession !== null;

  const startSession = () => {
    dispatch({
      type: "start-session",
      characterId: character.id,
      items: buildSessionItems(plan),
    });
    router.push("/session");
  };

  return (
    <div>
      <CharacterHeader
        character={character}
        summary={summary}
        lastPracticedAt={lastPractice}
        now={now}
      />

      {nextItem && nextHref ? (
        <section aria-labelledby="continue-heading" className="mb-8">
          <h2 id="continue-heading" className="microlabel mb-3">
            Next up
          </h2>
          <Link
            href={nextHref}
            className="group flex items-center gap-4 rounded-xl border border-accent/50 bg-accent-dim p-4 transition-colors hover:border-accent sm:p-5"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-base font-semibold">{nextItem.name}</span>
                {nextItem.notation && nextItem.notation !== "—" && (
                  <Notation value={nextItem.notation} size="sm" />
                )}
              </div>
              <p className="mt-1 text-xs text-muted">
                Stage {pad2(findItem(character, nextItem.id)?.stage.number ?? 1)} ·{" "}
                {findItem(character, nextItem.id)?.stage.name}
              </p>
            </div>
            <ArrowRight
              className="size-4 shrink-0 text-accent-bright transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>

          {(plan.nextUp.length > 0 || plan.retention.length > 0) && (
            <button
              type="button"
              onClick={startSession}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted transition-colors hover:border-border-strong hover:text-fg"
            >
              {hasSession ? (
                <>
                  <RotateCcw className="size-3.5" aria-hidden /> Resume session
                </>
              ) : (
                <>
                  <Play className="size-3.5" aria-hidden /> Start a session
                </>
              )}
            </button>
          )}
        </section>
      ) : (
        state.hydrated && (
          <div className="mb-8 rounded-xl border border-accent/40 bg-accent-dim p-6 text-center">
            <Trophy className="mx-auto size-7 text-accent-bright" aria-hidden />
            <h2 className="mt-3 text-lg font-bold uppercase tracking-tight">
              Curriculum complete
            </h2>
            <p className="mx-auto mt-1.5 max-w-sm text-xs text-muted">
              Every item is learned. Keep the retention list below alive —
              mastery is maintenance.
            </p>
          </div>
        )
      )}

      <ol className="flex flex-col gap-2">
        {summary.stages.map((s, index) => (
          <motion.li
            key={s.stage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.25, ease: "easeOut" }}
          >
            <StageCard
              characterId={character.id}
              summary={s}
              isNext={s.stage.id === nextStageId}
            />
          </motion.li>
        ))}
      </ol>

      {needsReview.length > 0 && (
        <section aria-labelledby="needs-review-heading" className="mt-8">
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

      {quizStats && quizStats.runs > 0 && (
        <Link
          href={`/training/${character.id}/quiz`}
          className="group mt-8 flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong sm:p-5"
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
    </div>
  );
}
