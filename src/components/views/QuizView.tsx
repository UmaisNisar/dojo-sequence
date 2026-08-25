"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, Timer, X, Zap } from "lucide-react";
import type { Character, QuizQuestion } from "@/types";
import { useProgress, useHaptics } from "@/hooks/use-progress";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { Notation } from "@/components/Notation";
import { ProgressBar } from "@/components/ProgressBar";

/* Doubled from 4s after the ladder landed. The ladder removed the reading
   load, but scanning ten entries you have not memorised yet still costs
   more than a reaction, and 4s left no room for the decision itself. */
export const QUESTION_MS = 8000;

/**
 * The punish ladder — every answer this character's quiz can have, in a fixed
 * order, on screen the whole run.
 *
 * A player reported that the old drill measured reading speed rather than
 * reaction: four bespoke options appeared with the prompt, so the timer was
 * spent parsing 60-70 characters of unfamiliar notation and whatever was left
 * went to the decision. Holding one ladder constant fixes that at the root —
 * after the first round you are not reading it, you are reaching for a
 * position you already know, which is exactly what punishing is in a match.
 */
function buildLadder(questions: QuizQuestion[]): string[] {
  const seen = new Set<string>();
  const ladder: string[] = [];
  for (const q of questions) {
    const answer = q.options[q.correctIndex];
    if (answer && !seen.has(answer)) {
      seen.add(answer);
      ladder.push(answer);
    }
  }
  return ladder;
}

interface AnswerRecord {
  questionId: string;
  correct: boolean;
  timedOut: boolean;
  reactionMs: number | null;
}

type Phase =
  | { name: "idle" }
  | { name: "question"; index: number; startedAt: number }
  | { name: "feedback"; index: number; picked: number | null; timedOut: boolean }
  | { name: "results" };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function QuizView({ character }: { character: Character }) {
  const { state, dispatch } = useProgress();
  const questions = useMemo(() => character.punishQuiz ?? [], [character]);
  const stats = state.quizStats[character.id];
  const hapticsOn = useHaptics();

  /* Built from the full question set, not the shuffled run, so the ladder is
     identical every time — the muscle memory has to survive a restart. */
  const ladder = useMemo(() => buildLadder(questions), [questions]);

  const [run, setRun] = useState<QuizQuestion[]>([]);
  const [phase, setPhase] = useState<Phase>({ name: "idle" });
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [remainingMs, setRemainingMs] = useState(QUESTION_MS);

  const correctSlot = useCallback(
    (q: QuizQuestion) => ladder.indexOf(q.options[q.correctIndex]),
    [ladder],
  );

  /* Countdown while a question is live; timeout counts as a miss. */
  useEffect(() => {
    if (phase.name !== "question") return;
    const { startedAt, index } = phase;
    const tick = setInterval(() => {
      const left = QUESTION_MS - (Date.now() - startedAt);
      setRemainingMs(Math.max(0, left));
      if (left <= 0) {
        setAnswers((a) => [
          ...a,
          { questionId: run[index].id, correct: false, timedOut: true, reactionMs: null },
        ]);
        haptic("wrong", hapticsOn);
        setPhase({ name: "feedback", index, picked: null, timedOut: true });
      }
    }, 50);
    return () => clearInterval(tick);
  }, [phase, run, hapticsOn]);

  const start = () => {
    setRun(shuffle(questions));
    setAnswers([]);
    setRemainingMs(QUESTION_MS);
    setPhase({ name: "question", index: 0, startedAt: Date.now() });
  };

  const answer = useCallback(
    (slot: number) => {
      if (phase.name !== "question") return;
      const q = run[phase.index];
      const correct = slot === correctSlot(q);
      haptic(correct ? "correct" : "wrong", hapticsOn);
      setAnswers((a) => [
        ...a,
        {
          questionId: q.id,
          correct,
          timedOut: false,
          reactionMs: Date.now() - phase.startedAt,
        },
      ]);
      setPhase({ name: "feedback", index: phase.index, picked: slot, timedOut: false });
    },
    [phase, run, correctSlot, hapticsOn],
  );

  const next = useCallback(() => {
    if (phase.name !== "feedback") return;
    const nextIndex = phase.index + 1;
    if (nextIndex >= run.length) {
      const correct = answers.filter((a) => a.correct);
      const times = correct
        .map((a) => a.reactionMs)
        .filter((t): t is number => t !== null);
      dispatch({
        type: "record-quiz-run",
        characterId: character.id,
        score: correct.length,
        avgMs: times.length
          ? Math.round(times.reduce((s, t) => s + t, 0) / times.length)
          : null,
      });
      setPhase({ name: "results" });
    } else {
      setRemainingMs(QUESTION_MS);
      setPhase({ name: "question", index: nextIndex, startedAt: Date.now() });
    }
  }, [phase, run, answers, dispatch, character.id]);

  /* Number keys answer, Enter advances. Reaching for the mouse was itself
     part of the measured time, which is not the skill being trained. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase.name === "question") {
        const n = Number(e.key);
        if (Number.isInteger(n) && n >= 1 && n <= ladder.length) {
          e.preventDefault();
          answer(n - 1);
        }
        return;
      }
      if (phase.name === "feedback" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, ladder.length, answer, next]);

  /* Located by name, not by position. Punishment happens to be stage 4 in
     every curriculum today, and a hardcoded 4 would point somewhere plausible
     but wrong the moment one is ordered differently. */
  const punishStage = character.stages.find((s) => /punish/i.test(s.name));
  const studyHref = punishStage
    ? `/training/${character.id}/stage/${punishStage.number}`
    : `/training/${character.id}`;

  if (phase.name === "results") {
    return (
      <ResultsCard
        answers={answers}
        total={run.length}
        onRetry={start}
        studyHref={studyHref}
      />
    );
  }

  const live = phase.name === "question" || phase.name === "feedback";
  const q = live ? run[phase.index] : null;
  const inFeedback = phase.name === "feedback";
  const picked = inFeedback ? phase.picked : null;
  const answerSlot = q ? correctSlot(q) : -1;

  return (
    <div>
      {phase.name === "idle" ? (
        <div className="text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-accent/50 bg-accent-dim">
            <Timer className="size-6 text-accent-bright" aria-hidden />
          </span>
          <h1 className="display-title mt-5 text-4xl uppercase tracking-tight">
            Punish reaction
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            A situation flashes — answer with the ladder below before the window
            closes. {questions.length} rounds, {QUESTION_MS / 1000}s each.
            {" "}
            The ladder never changes, so learn it once and then stop reading it.
            Every entry is a real punisher; the answer is always the biggest one
            that still reaches.
          </p>
          {stats && stats.runs > 0 && (
            <p className="tnum mt-4 text-sm text-accent-bright">
              Best: {stats.bestScore} / {questions.length}
              {stats.bestAvgMs !== null && ` · avg ${(stats.bestAvgMs / 1000).toFixed(2)}s`}
            </p>
          )}
          <button
            type="button"
            onClick={start}
            className="mt-8 inline-flex min-h-[52px] items-center gap-2 clip-panel bg-accent px-8 text-sm font-semibold uppercase tracking-[0.15em] text-bg transition-colors hover:bg-accent-bright"
          >
            <Zap className="size-4" aria-hidden /> Start
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="microlabel">
              Round {phase.index + 1} / {run.length}
            </p>
            <div className="w-32">
              <ProgressBar
                fraction={remainingMs / QUESTION_MS}
                height={5}
                label="Time remaining"
              />
            </div>
          </div>

          <motion.div
            key={q?.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="clip-panel border border-border bg-surface p-6 text-center"
          >
            <p className="tnum text-5xl font-bold text-accent-bright sm:text-6xl">
              {q?.prompt}
            </p>
            <p className="mt-2 text-sm text-muted">{q?.situation}</p>
          </motion.div>
        </div>
      )}

      {/* The ladder. Present in every phase, including before you start, so
          the first round is not the one where you are still learning it. */}
      <section className="mt-6" aria-label="Punish ladder">
        <p className="microlabel mb-2">
          {character.name}&apos;s punish ladder
          <span className="ml-2 normal-case tracking-normal text-faint">
            press 1–{ladder.length}
          </span>
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {ladder.map((entry, slot) => {
            const isAnswer = inFeedback && slot === answerSlot;
            const isWrongPick = inFeedback && picked === slot && slot !== answerSlot;
            return (
              <button
                key={entry}
                type="button"
                disabled={phase.name !== "question"}
                onClick={() => answer(slot)}
                aria-label={`${slot + 1}: ${entry}`}
                className={cn(
                  "flex min-h-[56px] items-center justify-center gap-2 clip-row border px-2 py-2 transition-colors",
                  phase.name === "question" &&
                    "border-border bg-surface-2 hover:border-accent/60 hover:bg-accent-dim",
                  phase.name === "idle" && "border-border bg-surface",
                  isAnswer && "border-accent bg-accent-dim",
                  isWrongPick && "border-danger/60 bg-danger/10",
                  inFeedback && !isAnswer && !isWrongPick && "border-border bg-surface opacity-50",
                )}
              >
                <span
                  className={cn(
                    "tnum shrink-0 text-[10px] font-bold",
                    isAnswer ? "text-accent-bright" : "text-faint",
                  )}
                >
                  {slot + 1}
                </span>
                <Notation value={entry} size="sm" />
                {isAnswer && (
                  <Check className="size-3.5 shrink-0 text-accent-bright" strokeWidth={3} aria-hidden />
                )}
                {isWrongPick && (
                  <X className="size-3.5 shrink-0 text-danger" strokeWidth={3} aria-hidden />
                )}
              </button>
            );
          })}
        </div>
      </section>

      <div aria-live="polite">
        {inFeedback && q && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-4 overflow-hidden clip-panel border border-border bg-surface p-4"
          >
            {picked === answerSlot && (
              <CorrectArc reactionMs={answers[answers.length - 1]?.reactionMs ?? null} />
            )}
            <p
              className={cn(
                "flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider",
                picked === answerSlot ? "text-accent-bright" : "text-danger",
              )}
            >
              {picked === answerSlot ? (
                <>
                  <Check className="size-4" aria-hidden /> Correct
                </>
              ) : phase.timedOut ? (
                <>
                  <Timer className="size-4" aria-hidden /> Too slow
                </>
              ) : (
                <>
                  <X className="size-4" aria-hidden /> Wrong
                </>
              )}
              <span className="ml-2 font-mono normal-case tracking-normal text-fg">
                <Notation value={q.options[q.correctIndex]} size="sm" />
              </span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{q.explain}</p>
            <button
              type="button"
              onClick={next}
              autoFocus
              className="mt-4 flex min-h-[48px] w-full items-center justify-center clip-row bg-accent text-sm font-semibold uppercase tracking-[0.15em] text-bg transition-colors hover:bg-accent-bright"
            >
              {phase.index + 1 >= run.length ? "See results" : "Next round"}
              <span className="ml-2 text-[10px] opacity-70">ENTER</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/**
 * Electric arc across the feedback card on a correct answer — faster
 * reactions earn a longer, brighter arc.
 */
function CorrectArc({ reactionMs }: { reactionMs: number | null }) {
  // 0 = slow, 1 = decent, 2 = instant recognition.
  const tier = reactionMs === null ? 0 : reactionMs < 1200 ? 2 : reactionMs < 2500 ? 1 : 0;
  const width = ["45%", "70%", "100%"][tier];
  const peak = [0.45, 0.65, 0.95][tier];
  const path =
    "M0 26 L70 20 L76 30 L170 16 L178 26 L280 14 L288 24 L390 12 L400 22 L500 10 L510 20 L600 8";
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 h-5"
      style={{ width }}
      viewBox="0 0 600 40"
      preserveAspectRatio="none"
      fill="none"
    >
      <motion.path
        d={path}
        stroke="var(--accent)"
        strokeWidth={4}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ filter: "blur(3px)" }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, peak * 0.6, peak * 0.25, 0] }}
        transition={{
          pathLength: { duration: 0.12, ease: "easeIn" },
          opacity: { duration: 0.7, times: [0, 0.2, 0.55, 1] },
        }}
      />
      <motion.path
        d={path}
        stroke="var(--accent-bright)"
        strokeWidth={1.4}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, peak, peak * 0.4, 0] }}
        transition={{
          pathLength: { duration: 0.12, ease: "easeIn" },
          opacity: { duration: 0.7, times: [0, 0.2, 0.55, 1] },
        }}
      />
    </svg>
  );
}

function ResultsCard({
  answers,
  total,
  onRetry,
  studyHref,
}: {
  answers: AnswerRecord[];
  total: number;
  onRetry: () => void;
  studyHref: string;
}) {
  const correct = answers.filter((a) => a.correct).length;
  const times = answers
    .map((a) => a.reactionMs)
    .filter((t): t is number => t !== null);
  const avg = times.length
    ? times.reduce((s, t) => s + t, 0) / times.length / 1000
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <p className="microlabel">Results</p>
      <p className="tnum mt-4 text-7xl font-bold text-accent-bright">
        {correct}
        <span className="text-3xl text-muted"> / {total}</span>
      </p>
      {avg !== null && (
        <p className="tnum mt-2 text-sm text-muted">
          average reaction {avg.toFixed(2)}s
        </p>
      )}
      <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">
        {correct === total
          ? "Perfect recognition. Now make your hands match it in ranked."
          : correct >= total * 0.7
            ? "Solid — the gaps are specific, and the explanations above told you where."
            : "Recognition comes before execution. Re-read the punishment stage and run it again."}
      </p>
      <div className="mt-8 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex min-h-[52px] w-full max-w-xs items-center justify-center gap-2 clip-panel bg-accent text-sm font-semibold uppercase tracking-[0.15em] text-bg transition-colors hover:bg-accent-bright"
        >
          <Zap className="size-4" aria-hidden /> Run it again
        </button>
        <Link
          href={studyHref}
          className="inline-flex min-h-[48px] w-full max-w-xs items-center justify-center clip-panel border border-border text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-fg"
        >
          Study the punishment stage
        </Link>
      </div>
    </motion.div>
  );
}
