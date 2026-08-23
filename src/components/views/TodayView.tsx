"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Play, RotateCcw, Trophy } from "lucide-react";
import type { Character, TrainingItem } from "@/types";
import { useProgress } from "@/hooks/use-progress";
import {
  buildSessionItems,
  buildTodayPlan,
  findItem,
  getItemProgress,
  summarizeCharacter,
} from "@/lib/progression";
import { cn, formatRelativeTime, pad2 } from "@/lib/utils";
import { Notation } from "@/components/Notation";
import { ProgressBar } from "@/components/ProgressBar";

export function TodayView({ character }: { character: Character }) {
  const { state, dispatch } = useProgress();
  const router = useRouter();
  const progress = state.characters[character.id];
  const now = state.hydratedAt;

  const summary = useMemo(
    () => summarizeCharacter(character, progress),
    [character, progress],
  );
  const plan = useMemo(
    () => buildTodayPlan(character, progress, now),
    [character, progress, now],
  );

  const done = plan.nextUp.length === 0;
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
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mb-8"
      >
        <p className="microlabel">
          {character.name} · {summary.learnedCount} / {summary.totalCount} learned
          · Stage {pad2(summary.currentStageNumber)} / {pad2(summary.stages.length)}
        </p>
        <h1 className="mt-1 text-5xl font-bold uppercase tracking-tight sm:text-6xl">
          Today
        </h1>
        <div className="mt-4 max-w-xs">
          <ProgressBar
            fraction={
              summary.totalCount ? summary.learnedCount / summary.totalCount : 0
            }
            height={6}
            label="Overall curriculum progress"
          />
        </div>
      </motion.header>

      {done ? (
        <div className="rounded-xl border border-accent/40 bg-accent-dim p-8 text-center">
          <Trophy className="mx-auto size-8 text-accent-bright" aria-hidden />
          <h2 className="mt-4 text-xl font-bold uppercase tracking-tight">
            Curriculum complete
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Every item is learned. Keep the retention loop below alive — mastery
            is maintenance.
          </p>
        </div>
      ) : (
        <section aria-labelledby="next-up-heading">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 id="next-up-heading" className="microlabel">
              Next up
            </h2>
            <Link
              href={`/training/${character.id}`}
              className="text-xs font-medium text-muted transition-colors hover:text-fg"
            >
              Full curriculum →
            </Link>
          </div>
          <ol className="flex flex-col gap-2">
            {plan.nextUp.map((item, i) => (
              <TodayItemRow
                key={item.id}
                character={character}
                item={item}
                index={i}
                primary={i === 0}
              />
            ))}
          </ol>
        </section>
      )}

      {plan.retention.length > 0 && (
        <section aria-labelledby="retention-heading" className="mt-8">
          <h2 id="retention-heading" className="microlabel mb-3">
            Retention — keep it sharp
          </h2>
          <ol className="flex flex-col gap-2">
            {plan.retention.map((item) => (
              <RetentionRow
                key={item.id}
                character={character}
                item={item}
                now={now}
              />
            ))}
          </ol>
        </section>
      )}

      {(plan.nextUp.length > 0 || plan.retention.length > 0) && (
        <div className="sticky bottom-[76px] mt-8 md:bottom-6">
          <motion.button
            type="button"
            onClick={startSession}
            whileTap={{ scale: 0.985 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-accent/20 transition-colors hover:bg-accent-bright"
          >
            {hasSession ? (
              <>
                <RotateCcw className="size-4" aria-hidden /> Resume session
              </>
            ) : (
              <>
                <Play className="size-4" aria-hidden /> Start today&apos;s session
              </>
            )}
          </motion.button>
        </div>
      )}
    </div>
  );
}

function TodayItemRow({
  character,
  item,
  index,
  primary,
}: {
  character: Character;
  item: TrainingItem;
  index: number;
  primary: boolean;
}) {
  const found = findItem(character, item.id);
  const stageNumber = found?.stage.number ?? 1;

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: "easeOut" }}
    >
      <Link
        href={`/training/${character.id}/stage/${stageNumber}/item/${item.id}`}
        className={cn(
          "group flex items-center gap-4 rounded-xl border p-4 transition-colors sm:p-5",
          primary
            ? "border-accent/50 bg-accent-dim hover:border-accent"
            : "border-border bg-surface hover:border-border-strong",
        )}
      >
        <span
          className={cn(
            "tnum shrink-0 font-mono text-sm font-semibold",
            primary ? "text-accent-bright" : "text-muted",
          )}
        >
          {pad2(index + 1)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className={cn("font-semibold", primary ? "text-base" : "text-sm")}>
              {item.name}
            </span>
            {item.notation && item.notation !== "—" && (
              <Notation value={item.notation} size="sm" />
            )}
          </div>
          <p className="mt-1 line-clamp-1 text-xs text-muted">
            Stage {pad2(stageNumber)} · {found?.stage.name}
          </p>
        </div>
        <ArrowRight
          className={cn(
            "size-4 shrink-0 transition-transform group-hover:translate-x-0.5",
            primary ? "text-accent-bright" : "text-faint",
          )}
          aria-hidden
        />
      </Link>
    </motion.li>
  );
}

function RetentionRow({
  character,
  item,
  now,
}: {
  character: Character;
  item: TrainingItem;
  now: number;
}) {
  const { state } = useProgress();
  const p = getItemProgress(state.characters[character.id], item.id);
  const found = findItem(character, item.id);
  const stageNumber = found?.stage.number ?? 1;
  const lastTouched = Math.max(
    p.lastReviewedAt ?? 0,
    p.lastPracticedAt ?? 0,
    p.learnedAt ?? 0,
  );

  return (
    <li>
      <Link
        href={`/training/${character.id}/stage/${stageNumber}/item/${item.id}`}
        className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-sm font-semibold">{item.name}</span>
            {item.notation && item.notation !== "—" && (
              <Notation value={item.notation} size="sm" />
            )}
          </div>
          <p className="mt-1 text-xs text-muted">
            Stage {pad2(stageNumber)} · practiced{" "}
            {formatRelativeTime(lastTouched || null, now)}
          </p>
        </div>
        <ArrowRight
          className="size-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
    </li>
  );
}
