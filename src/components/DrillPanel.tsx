"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  CheckCheck,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import type { Character, Drill, TrainingItem } from "@/types";
import { useProgress } from "@/hooks/use-progress";
import {
  drillFraction,
  drillTargetLabel,
  getItemProgress,
  isDrillPassed,
} from "@/lib/progression";
import { cn, pad2 } from "@/lib/utils";
import { ProgressBar } from "./ProgressBar";

/**
 * The drill itself — deliberately huge controls, usable with a controller
 * on the desk and the app on a phone.
 */
export function DrillPanel({
  character,
  item,
}: {
  character: Character;
  item: TrainingItem;
}) {
  const { state, dispatch } = useProgress();
  const progress = getItemProgress(state.characters[character.id], item.id);
  const drill = item.drill;
  const passed = isDrillPassed(drill, progress);
  const learned = progress.status === "learned";

  const act = (type: "increment" | "decrement" | "reset-drill" | "complete-drill") =>
    dispatch({ type, characterId: character.id, itemId: item.id });

  return (
    <section aria-label="Drill" className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="microlabel">Drill</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-fg">
            {"rep" in drill ? drill.rep : "Work through each point until it's genuinely internalized — then check it off."}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="microlabel">Target</p>
          <p className="tnum mt-1 text-sm font-semibold text-fg">
            {drillTargetLabel(drill)}
          </p>
        </div>
      </div>

      {(drill.type === "consecutive-reps" || drill.type === "total-reps") && (
        <RepCounter
          drill={drill}
          reps={progress.reps}
          bestStreak={progress.bestStreak}
          passed={passed}
          onIncrement={() => act("increment")}
          onDecrement={() => act("decrement")}
          onReset={() => act("reset-drill")}
          onComplete={() => act("complete-drill")}
        />
      )}

      {drill.type === "accuracy" && (
        <AccuracyDrillView
          attempts={progress.attempts}
          hits={progress.hits}
          drill={drill}
          passed={passed}
          onAttempt={(hit) =>
            dispatch({
              type: "record-attempt",
              characterId: character.id,
              itemId: item.id,
              hit,
            })
          }
          onReset={() => act("reset-drill")}
        />
      )}

      {drill.type === "manual" && (
        <ChecklistDrillView
          checklist={drill.checklist}
          checked={progress.checked}
          onToggle={(index) =>
            dispatch({
              type: "toggle-check",
              characterId: character.id,
              itemId: item.id,
              index,
            })
          }
        />
      )}

      {drill.type === "timed" && (
        <TimedDrillView
          durationSeconds={drill.durationSeconds}
          elapsed={progress.elapsedSeconds}
          passed={passed}
          onAddTime={(seconds) =>
            dispatch({
              type: "add-time",
              characterId: character.id,
              itemId: item.id,
              seconds,
            })
          }
          onReset={() => act("reset-drill")}
        />
      )}

      <div className="mt-4">
        <ProgressBar
          fraction={drillFraction(drill, progress)}
          height={6}
          label={`Drill progress for ${item.name}`}
        />
      </div>

      {/* Pass state + mark learned. The reducer re-validates the pass
          condition — this button is a request, not the authority. */}
      <div aria-live="polite" className="mt-4">
        {learned ? (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-accent/40 bg-accent-dim px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-accent-bright">
            <Check className="size-4" aria-hidden /> Learned
          </div>
        ) : (
          <motion.button
            type="button"
            disabled={!passed}
            onClick={() =>
              dispatch({
                type: "mark-learned",
                characterId: character.id,
                itemId: item.id,
              })
            }
            whileTap={passed ? { scale: 0.98 } : undefined}
            className={cn(
              "w-full rounded-lg px-4 py-4 text-sm font-semibold uppercase tracking-[0.15em] transition-colors",
              passed
                ? "bg-accent text-white hover:bg-accent-bright"
                : "cursor-not-allowed border border-border bg-surface-2 text-faint",
            )}
          >
            {passed ? "Mark learned" : "Pass the drill to unlock"}
          </motion.button>
        )}
      </div>

    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Rep counter (consecutive + total)                                   */
/* ------------------------------------------------------------------ */

function RepCounter({
  drill,
  reps,
  bestStreak,
  passed,
  onIncrement,
  onDecrement,
  onReset,
  onComplete,
}: {
  drill: Extract<Drill, { type: "consecutive-reps" | "total-reps" }>;
  reps: number;
  bestStreak: number;
  passed: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
  onComplete: () => void;
}) {
  // Each increment fires a spark burst; passing fires the big flash.
  const [burst, setBurst] = useState(0);
  const fraction = Math.min(1, reps / drill.target);

  const increment = () => {
    onIncrement();
    setBurst((b) => b + 1);
  };

  return (
    <div className="relative">
      {/* Panel flash the moment the drill passes */}
      <AnimatePresence>
        {passed && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-2 rounded-xl bg-accent"
            initial={{ opacity: 0.22 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center gap-3 py-2 sm:gap-6">
        <BigControl label="Subtract one rep" onClick={onDecrement} disabled={reps === 0}>
          <Minus className="size-6 sm:size-7" aria-hidden />
        </BigControl>

        <div className="relative min-w-[8rem] text-center sm:min-w-[11rem]">
          <SparkBurst trigger={burst} big={passed} />
          <div
            className="tnum flex items-baseline justify-center gap-2 text-fg"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatedCount value={reps} passed={passed} glow={fraction} />
            <span className="text-xl font-medium text-faint sm:text-2xl">/</span>
            <span className="text-xl font-medium text-muted sm:text-2xl">
              {drill.target}
            </span>
          </div>
          <p className="microlabel mt-1.5">
            {drill.type === "consecutive-reps" ? "Current streak" : "Total reps"}
          </p>
          {drill.type === "consecutive-reps" && bestStreak > 0 && (
            <p className="tnum mt-0.5 text-xs text-faint">best {bestStreak}</p>
          )}
        </div>

        <BigControl label="Add one rep" onClick={increment} accent>
          <Plus className="size-6 sm:size-7" aria-hidden />
        </BigControl>
      </div>

      <div className="mt-2 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="flex min-h-[44px] items-center gap-2 rounded-lg px-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted transition-colors hover:text-fg"
        >
          <RotateCcw className="size-3.5" aria-hidden /> Reset
          {drill.type === "consecutive-reps" ? " streak" : ""}
        </button>
        {!passed && (
          <button
            type="button"
            onClick={onComplete}
            className="flex min-h-[44px] items-center gap-2 rounded-lg border border-accent/40 px-4 text-xs font-semibold uppercase tracking-[0.15em] text-accent-bright transition-colors hover:border-accent hover:bg-accent-dim"
          >
            <CheckCheck className="size-3.5" aria-hidden /> Complete
          </button>
        )}
      </div>
    </div>
  );
}

function AnimatedCount({
  value,
  passed,
  glow = 0,
}: {
  value: number;
  passed: boolean;
  /** 0..1 — the counter heats up as the drill nears its target. */
  glow?: number;
}) {
  // Width is driven by digit count in `ch`, with the big font size on the
  // container so the unit resolves against the actual digit glyphs.
  const digits = String(value).length;
  return (
    <span
      className={cn(
        "tnum relative inline-block h-[1em] overflow-visible text-6xl font-bold leading-none sm:text-7xl",
        passed ? "text-accent-bright" : "text-fg",
      )}
      style={{
        width: `${digits}ch`,
        textShadow:
          glow > 0
            ? `0 0 ${Math.round(6 + glow * 26)}px rgba(167, 139, 250, ${(glow * 0.6).toFixed(2)})`
            : undefined,
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="absolute inset-0 leading-none"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Radial spark burst fired from the counter on every added rep. */
const SPARK_ANGLES = [15, 70, 130, 195, 250, 310];

function SparkBurst({ trigger, big }: { trigger: number; big: boolean }) {
  if (trigger === 0) return null;
  const distance = big ? 64 : 42;
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-10"
    >
      {SPARK_ANGLES.map((deg, i) => {
        const rad = ((deg + (trigger * 37) % 60) * Math.PI) / 180;
        return (
          <motion.span
            key={`${trigger}-${i}`}
            className={cn(
              "absolute block rounded-full",
              big ? "size-2 bg-accent-bright" : "size-1.5 bg-accent",
            )}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(rad) * distance,
              y: Math.sin(rad) * distance,
              opacity: 0,
              scale: 0.3,
            }}
            transition={{ duration: big ? 0.55 : 0.4, ease: "easeOut" }}
          />
        );
      })}
    </span>
  );
}

function BigControl({
  children,
  label,
  onClick,
  disabled,
  accent,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  accent?: boolean;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      className={cn(
        "flex size-14 items-center justify-center rounded-xl border transition-colors sm:size-16",
        disabled
          ? "cursor-not-allowed border-border text-faint"
          : accent
            ? "border-accent/50 bg-accent-dim text-accent-bright hover:border-accent"
            : "border-border bg-surface-2 text-fg hover:border-border-strong",
      )}
    >
      {children}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Accuracy                                                            */
/* ------------------------------------------------------------------ */

function AccuracyDrillView({
  attempts,
  hits,
  drill,
  passed,
  onAttempt,
  onReset,
}: {
  attempts: number;
  hits: number;
  drill: Extract<Drill, { type: "accuracy" }>;
  passed: boolean;
  onAttempt: (hit: boolean) => void;
  onReset: () => void;
}) {
  const setDone = attempts >= drill.attempts;
  const setFailed = setDone && !passed;

  return (
    <div>
      <div className="py-2 text-center">
        <div className="tnum flex items-baseline justify-center gap-2" aria-live="polite">
          <span
            className={cn(
              "text-6xl font-bold sm:text-7xl",
              passed ? "text-accent-bright" : "text-fg",
            )}
          >
            {hits}
          </span>
          <span className="text-2xl font-medium text-faint sm:text-3xl">/</span>
          <span className="text-2xl font-medium text-muted sm:text-3xl">
            {drill.required}
          </span>
        </div>
        <p className="microlabel mt-2">
          landed · attempt {Math.min(attempts, drill.attempts)} of {drill.attempts}
        </p>
        {setFailed && (
          <p className="mt-2 text-xs font-medium text-danger">
            Set finished short — reset and run it again.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.button
          type="button"
          onClick={() => onAttempt(true)}
          disabled={setDone}
          whileTap={setDone ? undefined : { scale: 0.97 }}
          className={cn(
            "flex min-h-[64px] items-center justify-center gap-2 rounded-xl border text-sm font-semibold uppercase tracking-[0.15em] transition-colors",
            setDone
              ? "cursor-not-allowed border-border text-faint"
              : "border-accent/50 bg-accent-dim text-accent-bright hover:border-accent",
          )}
        >
          <Check className="size-5" aria-hidden /> Landed
        </motion.button>
        <motion.button
          type="button"
          onClick={() => onAttempt(false)}
          disabled={setDone}
          whileTap={setDone ? undefined : { scale: 0.97 }}
          className={cn(
            "flex min-h-[64px] items-center justify-center gap-2 rounded-xl border text-sm font-semibold uppercase tracking-[0.15em] transition-colors",
            setDone
              ? "cursor-not-allowed border-border text-faint"
              : "border-border bg-surface-2 text-muted hover:border-border-strong hover:text-fg",
          )}
        >
          <X className="size-5" aria-hidden /> Missed
        </motion.button>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mx-auto mt-4 flex min-h-[44px] items-center gap-2 rounded-lg px-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted transition-colors hover:text-fg"
      >
        <RotateCcw className="size-3.5" aria-hidden /> Reset set
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Manual checklist                                                    */
/* ------------------------------------------------------------------ */

function ChecklistDrillView({
  checklist,
  checked,
  onToggle,
}: {
  checklist: string[];
  checked: boolean[];
  onToggle: (index: number) => void;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {checklist.map((point, i) => {
        const done = checked[i] === true;
        return (
          <li key={i}>
            <button
              type="button"
              onClick={() => onToggle(i)}
              aria-pressed={done}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg border p-4 text-left text-sm leading-relaxed transition-colors",
                done
                  ? "border-accent/40 bg-accent-dim text-fg"
                  : "border-border bg-surface-2 text-muted hover:border-border-strong hover:text-fg",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border transition-colors",
                  done
                    ? "border-accent bg-accent text-white"
                    : "border-border-strong",
                )}
              >
                {done && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
              </span>
              {point}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Timed                                                               */
/* ------------------------------------------------------------------ */

function TimedDrillView({
  durationSeconds,
  elapsed,
  passed,
  onAddTime,
  onReset,
}: {
  durationSeconds: number;
  elapsed: number;
  passed: boolean;
  onAddTime: (seconds: number) => void;
  onReset: () => void;
}) {
  const [running, setRunning] = useState(false);
  // The timer only ticks while the drill is unfinished — no effect-driven
  // state reset needed; `active` simply derives to false once passed.
  const active = running && !passed;
  const onAddTimeRef = useRef(onAddTime);
  useEffect(() => {
    onAddTimeRef.current = onAddTime;
  }, [onAddTime]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => onAddTimeRef.current(1), 1000);
    return () => clearInterval(interval);
  }, [active]);

  const remaining = Math.max(0, durationSeconds - elapsed);

  return (
    <div className="text-center">
      <div className="tnum py-4" aria-live="polite">
        <span
          className={cn(
            "text-7xl font-bold sm:text-8xl",
            passed ? "text-accent-bright" : "text-fg",
          )}
        >
          {Math.floor(remaining / 60)}:{pad2(remaining % 60)}
        </span>
        <p className="microlabel mt-2">{passed ? "Time complete" : "Remaining"}</p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <motion.button
          type="button"
          onClick={() => setRunning(!active)}
          disabled={passed}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "flex min-h-[64px] min-w-[10rem] items-center justify-center gap-2 rounded-xl border text-sm font-semibold uppercase tracking-[0.15em] transition-colors",
            passed
              ? "cursor-not-allowed border-border text-faint"
              : active
                ? "border-border bg-surface-2 text-fg"
                : "border-accent/50 bg-accent-dim text-accent-bright hover:border-accent",
          )}
        >
          {active ? (
            <>
              <Pause className="size-5" aria-hidden /> Pause
            </>
          ) : (
            <>
              <Play className="size-5" aria-hidden /> Start
            </>
          )}
        </motion.button>
      </div>

      <button
        type="button"
        onClick={() => {
          setRunning(false);
          onReset();
        }}
        className="mx-auto mt-4 flex min-h-[44px] items-center gap-2 rounded-lg px-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted transition-colors hover:text-fg"
      >
        <RotateCcw className="size-3.5" aria-hidden /> Reset timer
      </button>
    </div>
  );
}
