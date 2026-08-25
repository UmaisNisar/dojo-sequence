"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { ArrowRight, Check, Dot } from "lucide-react";
import type { Character, TrainingItem } from "@/types";
import { useProgress, useHaptics } from "@/hooks/use-progress";
import { haptic } from "@/lib/haptics";
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
  const hapticsOn = useHaptics();
  /* The primary action sits at the bottom of a long page. On a phone that
     means scrolling back to find it, so a compact copy pins itself above
     the tab bar whenever the real one is out of view — never both at once. */
  const actionRef = useRef<HTMLDivElement | null>(null);
  const [actionOffScreen, setActionOffScreen] = useState(false);
  /* The pinned copy is portalled to <body>. This section is a .clip-panel,
     and a clip-path clips its descendants — including position:fixed ones —
     so rendered in place the bar was painted and then clipped away. It
     measured correctly in the DOM and was invisible on screen.

     The host lives in AppShell rather than document.body: body is outside
     AccentScope, so a bar portalled there rendered in the default violet on a
     gold character page. No mounted flag is needed — `actionOffScreen` only
     flips inside the observer below, so the server and first client render
     both produce nothing and the host is guaranteed to exist by then. */
  const progress = getItemProgress(state.characters[character.id], item.id);
  const drill = item.drill;
  const learned = progress.status === "learned";

  useEffect(() => {
    const el = actionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => setActionOffScreen(!entries[0]?.isIntersecting),
      { rootMargin: "0px 0px -72px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const completeAndAdvance = () => {
    haptic("complete", hapticsOn);
    dispatch({ type: "mark-learned", characterId: character.id, itemId: item.id });
    onAdvance?.();
  };

  return (
    <section
      aria-label="Practice"
      className="clip-panel border border-border bg-surface p-5 sm:p-6"
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
                className="flex items-start gap-2 clip-row border border-border bg-surface-2 p-3 text-sm leading-relaxed text-muted"
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

      <div aria-live="polite" className="mt-5" ref={actionRef}>
        {learned ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2 clip-row border border-accent/40 bg-accent-dim px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-accent-bright">
              <Check className="size-4" aria-hidden /> Learned
            </div>
            {onAdvance && (
              <motion.button
                type="button"
                onClick={onAdvance}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 clip-row bg-accent px-4 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-bg transition-colors hover:bg-accent-bright"
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
            className="flex w-full items-center justify-center gap-2 clip-row bg-accent px-4 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-bg transition-colors hover:bg-accent-bright"
          >
            Complete
            <ArrowRight className="size-4" aria-hidden />
          </motion.button>
        )}
      </div>

      {actionOffScreen && createPortal(
        <div
          className="fixed inset-x-0 z-30 px-4 pb-2 md:hidden"
          style={{ bottom: "calc(60px + env(safe-area-inset-bottom))" }}
        >
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={learned ? onAdvance : completeAndAdvance}
            disabled={learned && !onAdvance}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center gap-2 clip-row bg-accent px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-bg shadow-lg shadow-black/50 disabled:opacity-0"
          >
            {learned ? (advanceLabel ?? "Next") : "Complete"}
            <ArrowRight className="size-4" aria-hidden />
          </motion.button>
        </div>,
        document.getElementById("pinned-action") ?? document.body,
      )}
    </section>
  );
}
