"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Lock, Timer } from "lucide-react";
import type { Character, Stage } from "@/types";
import { useProgress } from "@/hooks/use-progress";
import {
  getItemProgress,
  getStageStatus,
  isItemUnlocked,
} from "@/lib/progression";
import { pad2 } from "@/lib/utils";
import { ProgressBar } from "@/components/ProgressBar";
import { TrainingItemRow } from "@/components/TrainingItemRow";

export function StageView({
  character,
  stage,
}: {
  character: Character;
  stage: Stage;
}) {
  const { state } = useProgress();
  const progress = state.characters[character.id];
  const status = getStageStatus(character, progress, stage.id);
  const learnedCount = stage.items.filter(
    (i) => getItemProgress(progress, i.id).status === "learned",
  ).length;

  if (state.hydrated && status === "locked") {
    return (
      <div className="py-20 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-border bg-surface-2">
          <Lock className="size-5 text-muted" aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-bold uppercase tracking-tight">
          Stage {pad2(stage.number)} is locked
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
          Complete Stage {pad2(stage.number - 1)} to unlock{" "}
          <span className="font-semibold text-fg">{stage.name}</span>. Locked
          stages stay visible so you always know what&apos;s coming.
        </p>
        <Link
          href={`/training/${character.id}`}
          className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-accent-bright"
        >
          Back to stages
        </Link>
      </div>
    );
  }

  return (
    <div>
      <nav className="mb-6" aria-label="Breadcrumb">
        <Link
          href={`/training/${character.id}`}
          className="inline-flex min-h-[40px] items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          {character.name} — all stages
        </Link>
      </nav>

      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mb-8"
      >
        <p className="microlabel">Stage {pad2(stage.number)}</p>
        <h1 className="mt-1 text-4xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl">
          {stage.name}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {stage.description}
        </p>
        <div className="mt-5 flex items-center gap-4">
          <ProgressBar
            fraction={stage.items.length ? learnedCount / stage.items.length : 0}
            className="max-w-[12rem]"
            height={6}
            label={`${stage.name} progress`}
          />
          <p className="tnum text-sm font-semibold">
            {learnedCount} / {stage.items.length}{" "}
            <span className="font-medium text-muted">learned</span>
          </p>
        </div>
      </motion.header>

      {stage.id === "punishment" && character.punishQuiz && (
        <Link
          href={`/training/${character.id}/quiz`}
          className="group mb-4 flex items-center gap-4 rounded-xl border border-accent/40 bg-accent-dim p-4 transition-colors hover:border-accent sm:p-5"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-accent/50 text-accent-bright">
            <Timer className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em]">
              Punish reaction quiz
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              A frame situation flashes — tap the right punish before the window
              closes.
            </p>
          </div>
          <ArrowRight
            className="size-4 shrink-0 text-accent-bright transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      )}

      <ol className="flex flex-col gap-2">
        {stage.items.map((item, index) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.25, ease: "easeOut" }}
          >
            <TrainingItemRow
              characterId={character.id}
              stageNumber={stage.number}
              item={item}
              index={index}
              status={getItemProgress(progress, item.id).status}
              unlocked={isItemUnlocked(character, progress, item.id)}
            />
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
