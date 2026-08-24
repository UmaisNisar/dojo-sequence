"use client";

import { motion } from "motion/react";
import { ArrowRight, Check, Dot } from "lucide-react";
import type { Character, TrainingItem } from "@/types";
import { useProgress } from "@/hooks/use-progress";
import { drillTargetLabel, getItemProgress } from "@/lib/progression";

/**
 * What to practice, and how much of it.
 *
 * Deliberately NOT a tracker. The app's job is to tell you what to work on
 * and how many reps it should take — the reps themselves happen in Practice
 * mode, not in here. One button says you are done and moves you on.
 */
export function DrillPanel({
  character,
  item,
  onAdvance,
  advanceLabel,
}: {
  character: Character;
  item: TrainingItem;
  /** Called once the item is learned — moves on to the next thing to train. */
  onAdvance?: () => void;
  advanceLabel?: string;
}) {
  const { state, dispatch } = useProgress();
  const progress = getItemProgress(state.characters[character.id], item.id);
  const drill = item.drill;
  const learned = progress.status === "learned";

  const completeAndAdvance = () => {
    dispatch({ type: "mark-learned", characterId: character.id, itemId: item.id });
    onAdvance?.();
  };

  return (
    <section
      aria-label="Practice"
      className="rounded-xl border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h2 className="microlabel">Practice</h2>
        <div className="shrink-0 text-right">
          <p className="microlabel">Do this</p>
          <p className="tnum mt-1 text-sm font-semibold text-accent-bright">
            {drillTargetLabel(drill)}
          </p>
        </div>
      </div>

      {"rep" in drill ? (
        <p className="mt-3 text-sm leading-relaxed text-fg">{drill.rep}</p>
      ) : (
        <>
          <p className="mt-3 text-sm leading-relaxed text-fg">
            Work through each of these until it is genuinely internalized.
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {drill.checklist.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-2 rounded-lg border border-border bg-surface-2 p-3 text-sm leading-relaxed text-muted"
              >
                <Dot
                  className="mt-0.5 size-4 shrink-0 text-accent-bright"
                  aria-hidden
                />
                {point}
              </li>
            ))}
          </ul>
        </>
      )}

      <div aria-live="polite" className="mt-5">
        {learned ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2 rounded-lg border border-accent/40 bg-accent-dim px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-accent-bright">
              <Check className="size-4" aria-hidden /> Learned
            </div>
            {onAdvance && (
              <motion.button
                type="button"
                onClick={onAdvance}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-accent-bright"
              >
                {advanceLabel ?? "Next"}
                <ArrowRight className="size-4" aria-hidden />
              </motion.button>
            )}
          </div>
        ) : (
          <motion.button
            type="button"
            onClick={completeAndAdvance}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-accent-bright"
          >
            Complete
            <ArrowRight className="size-4" aria-hidden />
          </motion.button>
        )}
      </div>
    </section>
  );
}
