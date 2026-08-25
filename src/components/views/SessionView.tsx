"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Check,
  LogOut,
  SkipForward,
  Trophy,
} from "lucide-react";
import { getCharacter } from "@/data/characters";
import { useProgress } from "@/hooks/use-progress";
import {
  findItem,
  getItemProgress,
  getNextItem,
} from "@/lib/progression";
import { cn, pad2 } from "@/lib/utils";
import { Notation } from "@/components/Notation";
import { ProgressBar } from "@/components/ProgressBar";
import { DrillPanel } from "@/components/DrillPanel";
import { StatusBadge } from "@/components/StatusBadge";

export function SessionView() {
  const { state, dispatch } = useProgress();
  const router = useRouter();
  const session = state.activeSession;

  const character = session ? getCharacter(session.characterId) : undefined;

  const current = useMemo(() => {
    if (!session || !character) return null;
    const sessionItem = session.items[session.currentIndex];
    if (!sessionItem) return null;
    const found = findItem(character, sessionItem.itemId);
    if (!found) return null;
    return { sessionItem, ...found };
  }, [session, character]);

  if (!state.hydrated) {
    return <p className="py-20 text-center text-sm text-muted">Loading…</p>;
  }

  if (!session && state.lastSessionResult) {
    return <SessionResults />;
  }

  if (!session || !character || !current) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-tight">
          No active session
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
          Start a session from the curriculum screen — it lines up your
          next items and a couple of retention reps.
        </p>
        <Link
          href="/training"
          className="mt-6 inline-flex items-center gap-2 clip-row bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-bg transition-colors hover:bg-accent-bright"
        >
          Go to Training <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    );
  }

  const { sessionItem, item, stage } = current;
  const completedCount = session.items.filter((i) => i.completed || i.skipped).length;
  const progress = getItemProgress(state.characters[character.id], item.id);
  const isLast = session.currentIndex >= session.items.length - 1;

  const advance = (skipped: boolean) => {
    if (!skipped && sessionItem.kind === "retention") {
      dispatch({
        type: "mark-reviewed",
        characterId: character.id,
        itemId: item.id,
      });
    }
    // Finishing the last item lands on the results screen, not the curriculum.
    dispatch({ type: "advance-session", skipped });
  };

  const exit = () => {
    dispatch({ type: "exit-session" });
    router.push("/training");
  };

  return (
    <div>
      <header className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <p className="microlabel">
            Session · {character.name}
          </p>
          <p className="tnum text-sm font-semibold">
            {Math.min(completedCount + 1, session.items.length)} /{" "}
            {session.items.length}
          </p>
        </div>
        <div className="mt-3">
          <ProgressBar
            fraction={completedCount / session.items.length}
            height={6}
            label="Session progress"
          />
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="mb-5">
            <div className="flex flex-wrap items-center gap-3">
              <p className="microlabel">
                Stage {pad2(stage.number)} · {stage.name}
              </p>
              <StatusBadge
                state={
                  sessionItem.kind === "retention" ? "learned" : progress.status
                }
              />
              {sessionItem.kind === "retention" && (
                <span className="microlabel text-faint">retention</span>
              )}
            </div>
            <h1 className="display-title mt-2 text-3xl uppercase tracking-tight sm:text-4xl">
              {item.name}
            </h1>
            {item.notation && item.notation !== "—" && (
              <div className="mt-3">
                <Notation value={item.notation} size="lg" />
              </div>
            )}
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {item.purpose}
            </p>
          </div>

          <DrillPanel
            character={character}
            item={item}
            onAdvance={() => advance(false)}
            advanceLabel="Next in session"
          />
        </motion.div>
      </AnimatePresence>

      {/* Session controls — sticky, controller-friendly sizes */}
      <div className="sticky bottom-[76px] mt-6 clip-panel border border-border bg-surface/95 p-3 backdrop-blur-md md:bottom-6">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => advance(true)}
            className="flex min-h-[52px] items-center justify-center gap-2 clip-row border border-border text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:border-border-strong hover:text-fg"
          >
            <SkipForward className="size-4" aria-hidden /> Skip
          </button>
          <motion.button
            type="button"
            onClick={() => advance(false)}
            whileTap={{ scale: 0.97 }}
            className="flex min-h-[52px] items-center justify-center gap-2 clip-row bg-accent text-xs font-semibold uppercase tracking-wider text-bg transition-colors hover:bg-accent-bright"
          >
            {isLast ? "Finish" : "Next"} <ArrowRight className="size-4" aria-hidden />
          </motion.button>
        </div>
        <button
          type="button"
          onClick={exit}
          className="mx-auto mt-2 flex min-h-[44px] items-center gap-1.5 px-4 text-[11px] font-semibold uppercase tracking-wider text-faint transition-colors hover:text-muted"
        >
          <LogOut className="size-3.5" aria-hidden /> Exit session
        </button>
      </div>
    </div>
  );
}

/** Post-match results screen shown after the last session item. */
function SessionResults() {
  const { state, dispatch } = useProgress();
  const router = useRouter();
  const result = state.lastSessionResult;
  const character = result ? getCharacter(result.characterId) : undefined;

  if (!result || !character) return null;

  const progress = state.characters[character.id];
  const doneCount = result.items.filter((i) => i.completed).length;
  const skippedCount = result.items.filter((i) => i.skipped).length;
  const durationMin = Math.max(
    1,
    Math.round((result.finishedAt - result.startedAt) / 60_000),
  );
  const next = getNextItem(character, progress);
  const nextStageNumber = next
    ? findItem(character, next.id)?.stage.number
    : undefined;

  const dismissTo = (href: string) => {
    dispatch({ type: "dismiss-session-result" });
    router.push(href);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-lg py-6"
    >
      <div className="text-center">
        <motion.span
          className="mx-auto flex size-14 items-center justify-center rounded-full border border-accent/50 bg-accent-dim"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.1 }}
        >
          <Trophy className="size-6 text-accent-bright" aria-hidden />
        </motion.span>
        <h1 className="display-title mt-5 text-3xl uppercase tracking-tight sm:text-4xl">
          Session complete
        </h1>
        <p className="tnum mt-2 text-sm text-muted">
          {doneCount} trained · {skippedCount} skipped · ~{durationMin} min
        </p>
      </div>

      <ol className="mt-8 flex flex-col gap-2">
        {result.items.map((si, i) => {
          const found = findItem(character, si.itemId);
          if (!found) return null;
          const learned =
            getItemProgress(progress, si.itemId).status === "learned";
          return (
            <motion.li
              key={si.itemId}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.07, duration: 0.25 }}
              className="flex items-center gap-3 clip-panel border border-border bg-surface p-4"
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border",
                  si.skipped
                    ? "border-border text-faint"
                    : "border-accent/50 bg-accent-dim text-accent-bright",
                )}
                aria-hidden
              >
                {si.skipped ? (
                  <SkipForward className="size-3" />
                ) : (
                  <Check className="size-3.5" strokeWidth={3} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{found.item.name}</p>
                <p className="text-[11px] text-muted">
                  {si.kind === "retention" ? "Retention" : "Curriculum"}
                  {si.skipped ? " · skipped" : learned ? " · learned" : " · drilled"}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>

      <div className="mt-8 flex flex-col gap-2">
        {next && nextStageNumber !== undefined && (
          <button
            type="button"
            onClick={() =>
              dismissTo(
                `/training/${character.id}/stage/${nextStageNumber}/item/${next.id}`,
              )
            }
            className="flex min-h-[52px] items-center justify-center gap-2 clip-panel bg-accent px-6 text-sm font-semibold uppercase tracking-[0.15em] text-bg transition-colors hover:bg-accent-bright"
          >
            Keep training: {next.name}
            <ArrowRight className="size-4" aria-hidden />
          </button>
        )}
        <button
          type="button"
          onClick={() => dismissTo("/training")}
          className="flex min-h-[48px] items-center justify-center clip-panel border border-border px-6 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-fg"
        >
          Back to Training
        </button>
      </div>
    </motion.div>
  );
}
