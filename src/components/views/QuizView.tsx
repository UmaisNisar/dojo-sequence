"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Check, Timer, X, Zap } from "lucide-react";
import type { Character, QuizQuestion } from "@/types";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";
import { Notation } from "@/components/Notation";
import { ProgressBar } from "@/components/ProgressBar";

const QUESTION_MS = 4000;

interface RunQuestion extends QuizQuestion {
  /** Option order for this run (indices into `options`). */
  order: number[];
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

  const [run, setRun] = useState<RunQuestion[]>([]);
  const [phase, setPhase] = useState<Phase>({ name: "idle" });
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [remainingMs, setRemainingMs] = useState(QUESTION_MS);

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
          {
            questionId: run[index].id,
            correct: false,
            timedOut: true,
            reactionMs: null,
          },
        ]);
        setPhase({ name: "feedback", index, picked: null, timedOut: true });
      }
    }, 50);
    return () => clearInterval(tick);
  }, [phase, run]);

  const start = () => {
    const shuffled = shuffle(questions).map((q) => ({
      ...q,
      order: shuffle(q.options.map((_, i) => i)),
    }));
    setRun(shuffled);
    setAnswers([]);
    setRemainingMs(QUESTION_MS);
    setPhase({ name: "question", index: 0, startedAt: Date.now() });
  };

  const answer = (optionIndex: number) => {
    if (phase.name !== "question") return;
    const q = run[phase.index];
    const correct = optionIndex === q.correctIndex;
    setAnswers((a) => [
      ...a,
      {
        questionId: q.id,
        correct,
        timedOut: false,
        reactionMs: Date.now() - phase.startedAt,
      },
    ]);
    setPhase({
      name: "feedback",
      index: phase.index,
      picked: optionIndex,
      timedOut: false,
    });
  };

  const next = () => {
    if (phase.name !== "feedback") return;
    const nextIndex = phase.index + 1;
    if (nextIndex >= run.length) {
      // Record the run as we land on results — answers are all in by now.
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
  };

  const backHref = `/training/${character.id}/stage/4`;

  return (
    <div className="mx-auto max-w-xl">
      <nav className="mb-6" aria-label="Breadcrumb">
        <Link
          href={backHref}
          className="inline-flex min-h-[40px] items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> Punishment stage
        </Link>
      </nav>

      {phase.name === "idle" && (
        <div className="text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-accent/50 bg-accent-dim">
            <Timer className="size-6 text-accent-bright" aria-hidden />
          </span>
          <h1 className="mt-5 text-4xl font-bold uppercase tracking-tight">
            Punish reaction
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
            A situation flashes — tap {character.name}&apos;s best answer before
            the window closes. {questions.length} rounds, {QUESTION_MS / 1000}s
            each. Frame data verified against the current punish table.
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
            className="mt-8 inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-accent px-8 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-accent-bright"
          >
            <Zap className="size-4" aria-hidden /> Start
          </button>
        </div>
      )}

      {(phase.name === "question" || phase.name === "feedback") && (
        <QuestionCard
          run={run}
          phase={phase}
          remainingMs={remainingMs}
          onAnswer={answer}
          onNext={next}
        />
      )}

      {phase.name === "results" && (
        <ResultsCard
          answers={answers}
          total={run.length}
          onRetry={start}
          backHref={backHref}
        />
      )}
    </div>
  );
}

function QuestionCard({
  run,
  phase,
  remainingMs,
  onAnswer,
  onNext,
}: {
  run: RunQuestion[];
  phase: Extract<Phase, { name: "question" } | { name: "feedback" }>;
  remainingMs: number;
  onAnswer: (i: number) => void;
  onNext: () => void;
}) {
  const q = run[phase.index];
  const inFeedback = phase.name === "feedback";
  const picked = inFeedback ? phase.picked : null;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="microlabel">
          Round {phase.index + 1} / {run.length}
        </p>
        <div className="w-28">
          <ProgressBar
            fraction={remainingMs / QUESTION_MS}
            height={5}
            label="Time remaining"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="rounded-xl border border-border bg-surface p-6 text-center"
        >
          <motion.p
            className="tnum text-6xl font-bold text-accent-bright sm:text-7xl"
            initial={{ scale: 1.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 24 }}
          >
            {q.prompt}
          </motion.p>
          <p className="mt-3 text-sm text-muted">{q.situation}</p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {q.order.map((optionIndex) => {
          const isCorrect = optionIndex === q.correctIndex;
          const isPicked = picked === optionIndex;
          return (
            <button
              key={optionIndex}
              type="button"
              disabled={inFeedback}
              onClick={() => onAnswer(optionIndex)}
              className={cn(
                "flex min-h-[60px] items-center justify-center rounded-xl border px-4 font-mono text-sm font-semibold transition-colors",
                !inFeedback &&
                  "border-border bg-surface-2 text-fg hover:border-accent/60 hover:bg-accent-dim",
                inFeedback && isCorrect &&
                  "border-accent bg-accent-dim text-accent-bright",
                inFeedback && isPicked && !isCorrect &&
                  "border-danger/60 bg-danger/10 text-danger",
                inFeedback && !isPicked && !isCorrect &&
                  "border-border text-faint",
              )}
            >
              {q.options[optionIndex]}
            </button>
          );
        })}
      </div>

      <div aria-live="polite">
        {inFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-border bg-surface p-4"
          >
            <p
              className={cn(
                "flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider",
                picked === q.correctIndex ? "text-accent-bright" : "text-danger",
              )}
            >
              {picked === q.correctIndex ? (
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
              onClick={onNext}
              autoFocus
              className="mt-4 flex min-h-[48px] w-full items-center justify-center rounded-lg bg-accent text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-accent-bright"
            >
              {phase.index + 1 >= run.length ? "See results" : "Next round"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ResultsCard({
  answers,
  total,
  onRetry,
  backHref,
}: {
  answers: AnswerRecord[];
  total: number;
  onRetry: () => void;
  backHref: string;
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
          className="inline-flex min-h-[52px] w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-accent-bright"
        >
          <Zap className="size-4" aria-hidden /> Run it again
        </button>
        <Link
          href={backHref}
          className="inline-flex min-h-[48px] w-full max-w-xs items-center justify-center rounded-xl border border-border text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-fg"
        >
          Back to Punishment
        </Link>
      </div>
    </motion.div>
  );
}
