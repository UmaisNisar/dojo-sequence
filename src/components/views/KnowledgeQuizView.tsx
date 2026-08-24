"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Flame, RotateCcw, Trophy, X } from "lucide-react";
import type { Character, QuizItem } from "@/types";
import { useProgress } from "@/hooks/use-progress";
import { getFrameData } from "@/data/frames";
import { buildQuiz, QUIZ_LENGTH } from "@/lib/quiz-generator";
import { cn } from "@/lib/utils";
import { Notation } from "@/components/Notation";
import { ProgressBar } from "@/components/ProgressBar";

/** Categories whose options are move inputs, so they render as notation. */
const NOTATION_OPTIONS = new Set(["speed", "launcher", "notation"]);

interface Answer {
  question: QuizItem;
  picked: number;
  correct: boolean;
}

type Phase =
  | { name: "idle" }
  | { name: "question"; index: number }
  | { name: "feedback"; index: number; picked: number }
  | { name: "results" };

export function KnowledgeQuizView({ character }: { character: Character }) {
  const { state, dispatch } = useProgress();
  const progress = state.characters[character.id];
  const frames = getFrameData(character.id);
  const best = state.knowledgeStats[character.id];

  const [run, setRun] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [phase, setPhase] = useState<Phase>({ name: "idle" });

  /* Previewed on the idle screen so the mix is visible before starting —
     "12 questions, 8 from your training" is the whole pitch. */
  const preview = useMemo(
    () => buildQuiz(character, frames, progress, QUIZ_LENGTH),
    [character, frames, progress],
  );

  const score = answers.filter((a) => a.correct).length;
  const streak = useMemo(() => {
    let n = 0;
    for (const a of answers) n = a.correct ? n + 1 : 0;
    return n;
  }, [answers]);
  const bestStreak = useMemo(() => {
    let n = 0;
    let peak = 0;
    for (const a of answers) {
      n = a.correct ? n + 1 : 0;
      peak = Math.max(peak, n);
    }
    return peak;
  }, [answers]);

  const start = () => {
    const plan = buildQuiz(character, frames, progress, QUIZ_LENGTH);
    if (plan.questions.length === 0) return;
    setRun(plan.questions);
    setAnswers([]);
    setPhase({ name: "question", index: 0 });
  };

  const answer = (picked: number) => {
    if (phase.name !== "question") return;
    const q = run[phase.index];
    setAnswers((a) => [...a, { question: q, picked, correct: picked === q.correctIndex }]);
    setPhase({ name: "feedback", index: phase.index, picked });
  };

  const next = () => {
    if (phase.name !== "feedback") return;
    const nextIndex = phase.index + 1;
    if (nextIndex < run.length) {
      setPhase({ name: "question", index: nextIndex });
      return;
    }
    // Record on the way to results, when every answer is in.
    const finalScore = answers.filter((a) => a.correct).length;
    dispatch({
      type: "record-knowledge-run",
      characterId: character.id,
      score: finalScore,
      total: run.length,
      streak: bestStreak,
    });
    setPhase({ name: "results" });
  };

  if (!frames || preview.questions.length === 0) {
    return (
      <div className="clip-panel border border-border bg-surface p-8 text-center">
        <h1 className="display-title text-2xl uppercase">Quiz</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          There is no verified frame data for {character.name} yet, and every
          question here is built from it. Nothing is guessed.
        </p>
      </div>
    );
  }

  if (phase.name === "idle") {
    return <IdleCard character={character} preview={preview} best={best} onStart={start} />;
  }

  if (phase.name === "results") {
    return (
      <ResultsCard
        character={character}
        answers={answers}
        score={score}
        total={run.length}
        bestStreak={bestStreak}
        best={best}
        onRetry={start}
      />
    );
  }

  const q = run[phase.index];
  const inFeedback = phase.name === "feedback";
  const picked = inFeedback ? phase.picked : null;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="microlabel">
          Question {phase.index + 1} / {run.length}
        </p>
        <StreakPip streak={streak} />
      </div>
      <ProgressBar
        fraction={(phase.index + 1) / run.length}
        height={6}
        label="Quiz progress"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="mt-4"
        >
          <div className="clip-panel border border-border bg-surface p-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="microlabel">{q.categoryLabel}</span>
              {q.fromTraining && (
                <span className="clip-row border border-accent/50 bg-accent-dim px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-bright">
                  From your training
                </span>
              )}
            </div>
            <p className="mt-3 break-words font-mono text-3xl font-bold text-accent-bright sm:text-4xl">
              {q.prompt}
            </p>
            <p className="mx-auto mt-3 text-sm text-muted">{q.situation}</p>
          </div>

          <div
            className={cn(
              "mt-4 grid grid-cols-1 gap-2",
              q.options.length > 3 && "sm:grid-cols-2",
            )}
          >
            {q.options.map((option, i) => {
              const isCorrect = i === q.correctIndex;
              const isPicked = picked === i;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={inFeedback}
                  onClick={() => answer(i)}
                  className={cn(
                    "flex min-h-[60px] items-center justify-center gap-2 clip-panel border px-4 py-3 text-sm font-semibold transition-colors",
                    !inFeedback &&
                      "border-border bg-surface-2 text-fg hover:border-accent/60 hover:bg-accent-dim",
                    inFeedback &&
                      isCorrect &&
                      "border-accent bg-accent-dim text-accent-bright",
                    inFeedback &&
                      isPicked &&
                      !isCorrect &&
                      "border-danger/60 bg-danger/10 text-danger",
                    inFeedback &&
                      !isCorrect &&
                      !isPicked &&
                      "border-border bg-surface text-faint",
                  )}
                >
                  {NOTATION_OPTIONS.has(q.category) ? (
                    <Notation value={option} size="sm" />
                  ) : (
                    <span className="font-mono">{option}</span>
                  )}
                  {inFeedback && isCorrect && (
                    <Check className="size-4 shrink-0" strokeWidth={3} aria-hidden />
                  )}
                  {inFeedback && isPicked && !isCorrect && (
                    <X className="size-4 shrink-0" strokeWidth={3} aria-hidden />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {inFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-4 clip-panel border border-border bg-surface-2 p-4"
        >
          <p className="text-sm leading-relaxed text-fg">{q.explain}</p>
          {q.fromItemId && q.fromStageNumber !== undefined && (
            <Link
              href={`/training/${character.id}/stage/${q.fromStageNumber}/item/${q.fromItemId}`}
              className="mt-2 inline-block text-xs text-muted underline decoration-dotted underline-offset-2 transition-colors hover:text-accent-bright"
            >
              Revisit the lesson this came from
            </Link>
          )}
          <button
            type="button"
            onClick={next}
            autoFocus
            className="mt-4 flex w-full items-center justify-center gap-2 clip-row border border-accent bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-bg transition-opacity hover:opacity-90"
          >
            {phase.index + 1 < run.length ? "Next question" : "See results"}
            <ArrowRight className="size-3.5" aria-hidden />
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function StreakPip({ streak }: { streak: number }) {
  if (streak < 2) return <span className="text-[11px] text-faint">no streak yet</span>;
  return (
    <motion.span
      key={streak}
      initial={{ scale: 0.8, opacity: 0.6 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      className={cn(
        "flex items-center gap-1.5 clip-row border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
        streak >= 5
          ? "border-accent bg-accent-dim text-accent-bright"
          : "border-border-strong text-muted",
      )}
    >
      <Flame className="size-3.5" aria-hidden />
      {streak} in a row
    </motion.span>
  );
}

function IdleCard({
  character,
  preview,
  best,
  onStart,
}: {
  character: Character;
  preview: ReturnType<typeof buildQuiz>;
  best: { bestScore: number; bestTotal: number; bestStreak: number; runs: number } | undefined;
  onStart: () => void;
}) {
  const total = preview.questions.length;
  return (
    <div className="clip-panel border border-border bg-surface p-6 sm:p-8">
      <p className="microlabel">{character.name}</p>
      <h1 className="display-title mt-1 text-3xl uppercase sm:text-4xl">Quiz</h1>

      {/* No width cap: the panel already bounds it, and a max-w here wrapped
          the line ~230px short of the available space. */}
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {preview.coldStart ? (
          <>
            You have not marked anything learned yet, so this round is general
            knowledge about {character.name}. As you complete training, questions
            start coming from the moves you have actually worked on.
          </>
        ) : (
          <>
            {total} questions — {preview.fromTraining} drawn from moves you have
            trained, the rest general knowledge about {character.name}. Every
            answer comes from the verified frame table.
          </>
        )}
      </p>

      <dl className="mt-5 grid grid-cols-3 gap-2">
        <Stat label="Questions" value={String(total)} />
        <Stat
          label="Best"
          value={best && best.bestTotal ? `${best.bestScore}/${best.bestTotal}` : "—"}
        />
        <Stat label="Best streak" value={best?.bestStreak ? String(best.bestStreak) : "—"} />
      </dl>

      <button
        type="button"
        onClick={onStart}
        className="mt-6 flex w-full items-center justify-center gap-2 clip-row border border-accent bg-accent px-6 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-bg transition-opacity hover:opacity-90"
      >
        Start quiz
        <ArrowRight className="size-3.5" aria-hidden />
      </button>
      <p className="mt-2 text-center text-[11px] text-faint">
        No timer. Take as long as you want — every answer explains itself.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="clip-row border border-border bg-surface-2 px-3 py-2.5 text-center">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-faint">
        {label}
      </dt>
      <dd className="tnum mt-0.5 text-lg font-bold text-fg">{value}</dd>
    </div>
  );
}

function ResultsCard({
  character,
  answers,
  score,
  total,
  bestStreak,
  best,
  onRetry,
}: {
  character: Character;
  answers: Answer[];
  score: number;
  total: number;
  bestStreak: number;
  best: { bestScore: number; bestTotal: number } | undefined;
  onRetry: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  /* Only a personal best if there was something to beat. Calling a first
     attempt a "personal best" is technically true and emotionally worthless —
     worse than saying nothing, because it cheapens the badge when it is real. */
  const isBest =
    !!best && best.bestTotal > 0 && score / total > best.bestScore / best.bestTotal;
  const missed = answers.filter((a) => !a.correct);

  const verdict =
    pct === 100
      ? "Flawless. You know this character."
      : pct >= 80
        ? "Strong. The gaps left are worth a look."
        : pct >= 50
          ? "Solid base — the misses below are the fastest way up."
          : "Early days. Every miss below links to the lesson for it.";

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="clip-panel border border-accent/40 bg-accent-dim p-6 text-center sm:p-8"
      >
        {isBest && (
          <span className="mx-auto mb-3 flex w-fit items-center gap-1.5 clip-row border border-accent/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-bright">
            <Trophy className="size-3.5" aria-hidden /> Personal best
          </span>
        )}
        <p className="tnum text-6xl font-bold text-accent-bright">
          {score}
          <span className="text-3xl text-muted">/{total}</span>
        </p>
        <p className="mt-2 text-sm text-muted">{verdict}</p>
        <div className="mx-auto mt-5 grid max-w-sm grid-cols-2 gap-2">
          <Stat label="Accuracy" value={`${pct}%`} />
          <Stat label="Best streak" value={String(bestStreak)} />
        </div>
      </motion.div>

      {missed.length > 0 && (
        <section className="mt-6">
          <h2 className="microlabel mb-3">Worth reviewing</h2>
          <ol className="flex flex-col gap-2">
            {missed.map((a) => (
              <li
                key={a.question.id}
                className="clip-row border border-border bg-surface p-4"
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="microlabel">{a.question.categoryLabel}</span>
                  <span className="font-mono text-xs font-semibold text-fg">
                    {a.question.subject}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  {a.question.explain}
                </p>
                {a.question.fromItemId && a.question.fromStageNumber !== undefined && (
                  <Link
                    href={`/training/${character.id}/stage/${a.question.fromStageNumber}/item/${a.question.fromItemId}`}
                    className="mt-1.5 inline-block text-[11px] text-muted underline decoration-dotted underline-offset-2 transition-colors hover:text-accent-bright"
                  >
                    Back to the lesson
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="flex flex-1 items-center justify-center gap-2 clip-row border border-accent bg-accent px-6 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-bg transition-opacity hover:opacity-90"
        >
          <RotateCcw className="size-3.5" aria-hidden /> New questions
        </button>
        <Link
          href={`/training/${character.id}`}
          className="flex flex-1 items-center justify-center clip-row border border-border bg-surface px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted transition-colors hover:border-border-strong hover:text-fg"
        >
          Back to curriculum
        </Link>
      </div>
    </div>
  );
}
