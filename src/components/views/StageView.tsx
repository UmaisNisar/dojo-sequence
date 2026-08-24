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
  const totalStages = character.stages.length;
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

  const accent = character.accent;

  return (
    <div
      style={
        accent
          ? ({
              ["--accent" as string]: accent.base,
              ["--accent-bright" as string]: accent.bright,
              ["--accent-deep" as string]: accent.deep,
              ["--accent-dim" as string]: `${accent.base}24`,
            } as React.CSSProperties)
          : undefined
      }
    >
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <span className="clip-slant bg-accent px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-bg">
            Stage {pad2(stage.number)}
          </span>
          <span className="h-px flex-1 bg-border-strong" aria-hidden />
          <span className="tnum font-mono text-[10px] font-bold tracking-[0.2em] text-faint">
            {pad2(stage.number)} / {pad2(totalStages)}
          </span>
        </div>

        <h1 className="display-title mt-3 text-5xl uppercase leading-[0.92] sm:text-[4.25rem]">
          {stage.name}
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-muted">
          {stage.description}
        </p>

        {/* Segmented meter — a health bar, not a progress bar. */}
        <div className="mt-6 flex items-center gap-4">
          <div
            className="h-2.5 flex-1 overflow-hidden border border-border-strong bg-surface"
            role="img"
            aria-label={`${stage.name} progress: ${learnedCount} of ${stage.items.length}`}
          >
            <div
              className="meter-seg h-full text-accent transition-[width] duration-500"
              style={{
                width: `${stage.items.length ? (learnedCount / stage.items.length) * 100 : 0}%`,
                ["--seg" as string]: "10px",
              }}
            />
          </div>
          <p className="tnum shrink-0 font-mono text-xs font-bold tracking-wider">
            <span className="text-accent-bright">{pad2(learnedCount)}</span>
            <span className="text-faint"> / {pad2(stage.items.length)}</span>
            <span className="ml-2 font-sans text-[10px] uppercase tracking-[0.18em] text-muted">
              learned
            </span>
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
