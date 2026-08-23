"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { Check } from "lucide-react";

/** Stage name slamming in letter by letter, K.O.-screen energy. */
function SlamTitle({ text }: { text: string }) {
  const letters = [...text];
  return (
    <h2
      className="text-4xl font-bold uppercase tracking-tight sm:text-5xl"
      aria-label={text}
    >
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, y: -46, scale: 1.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 0.15 + i * 0.035,
            type: "spring",
            stiffness: 620,
            damping: 30,
          }}
        >
          {ch}
        </motion.span>
      ))}
    </h2>
  );
}

/** "MASTERED" stamped over a screen flash after the title lands. */
function MasteredStamp() {
  return (
    <span className="relative mt-3 inline-block">
      <motion.span
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-accent"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.16, 0] }}
        transition={{ delay: 0.85, duration: 0.4, times: [0, 0.3, 1] }}
      />
      <motion.span
        className="inline-block border-2 border-accent-bright px-4 py-1 text-sm font-bold uppercase tracking-[0.3em] text-accent-bright"
        initial={{ opacity: 0, scale: 2.4, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: -3 }}
        transition={{ delay: 0.85, type: "spring", stiffness: 500, damping: 22 }}
      >
        Mastered
      </motion.span>
    </span>
  );
}

export interface StageCompleteInfo {
  stageName: string;
  learned: number;
  total: number;
  nextStageName: string | null;
  nextStageHref: string | null;
}

interface Props {
  open: boolean;
  itemName: string;
  passLabel: string;
  stageComplete: StageCompleteInfo | null;
  onContinue: () => void;
  continueHref?: string | null;
  continueLabel?: string;
}

/**
 * Shown when a drill passes and the item becomes learned.
 * If the whole stage just finished, escalates into the larger stage moment.
 */
export function CompletionOverlay({
  open,
  itemName,
  passLabel,
  stageComplete,
  onContinue,
  continueHref,
  continueLabel = "Continue",
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/88 p-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={stageComplete ? "Stage complete" : "Drill passed"}
        >
          <motion.div
            className="w-full max-w-sm text-center"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <motion.div
              className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full border border-accent/50 bg-accent-dim"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.05 }}
            >
              <Check className="size-7 text-accent-bright" strokeWidth={2.5} aria-hidden />
            </motion.div>

            {stageComplete ? (
              <>
                <p className="microlabel mb-3 text-accent-bright">Stage complete</p>
                <SlamTitle text={stageComplete.stageName} />
                <MasteredStamp />
                <p className="tnum mt-5 text-sm text-muted">
                  {stageComplete.learned} / {stageComplete.total}
                </p>
                {stageComplete.nextStageName && (
                  <motion.p
                    className="mt-6 text-sm text-muted"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    Next:{" "}
                    <span className="font-semibold uppercase tracking-wide text-fg">
                      {stageComplete.nextStageName}
                    </span>
                  </motion.p>
                )}
              </>
            ) : (
              <>
                <p className="microlabel mb-3 text-accent-bright">Drill passed</p>
                <h2 className="text-2xl font-bold uppercase tracking-tight">
                  {itemName}
                </h2>
                <p className="tnum mt-3 text-sm text-muted">{passLabel}</p>
                <p className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent-dim px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-accent-bright">
                  <Check className="size-3.5" aria-hidden /> Learned
                </p>
              </>
            )}

            <div className="mt-8 flex flex-col gap-2">
              {stageComplete?.nextStageHref ? (
                <Link
                  href={stageComplete.nextStageHref}
                  onClick={onContinue}
                  className="rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-accent-bright"
                >
                  Enter {stageComplete.nextStageName}
                </Link>
              ) : continueHref ? (
                <Link
                  href={continueHref}
                  onClick={onContinue}
                  className="rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-accent-bright"
                >
                  {continueLabel}
                </Link>
              ) : null}
              <button
                type="button"
                onClick={onContinue}
                className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-fg"
              >
                Stay here
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
