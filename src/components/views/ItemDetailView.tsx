"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Gamepad2, Lock } from "lucide-react";
import type { Character, Stage, TrainingItem } from "@/types";
import { useProgress } from "@/hooks/use-progress";
import {
  allItems,
  drillTargetLabel,
  findItem,
  getItemProgress,
  getNextItem,
  isItemUnlocked,
  isStageComplete,
} from "@/lib/progression";
import { pad2 } from "@/lib/utils";
import { FrameDataPanel } from "@/components/FrameDataPanel";
import { Notation } from "@/components/Notation";
import { NotationPlayer } from "@/components/NotationPlayer";
import { StatusBadge } from "@/components/StatusBadge";
import { DrillPanel } from "@/components/DrillPanel";
import {
  CompletionOverlay,
  type StageCompleteInfo,
} from "@/components/CompletionOverlay";

export function ItemDetailView({
  character,
  stage,
  item,
}: {
  character: Character;
  stage: Stage;
  item: TrainingItem;
}) {
  const { state } = useProgress();
  const router = useRouter();
  const progress = state.characters[character.id];
  const itemProgress = getItemProgress(progress, item.id);
  const unlocked = isItemUnlocked(character, progress, item.id);

  /* Detect the not-started → learned transition to fire the overlay.
     Armed only after hydration — otherwise restoring a learned item from
     storage would read as a fresh pass and replay the ceremony on reload.
     Skipped when we are about to navigate straight to the next item, so
     completing does not flash a ceremony on a page that is unmounting. */
  const [celebrate, setCelebrate] = useState(false);
  const skipCelebration = useRef(false);
  const prevStatus = useRef<typeof itemProgress.status | null>(null);
  useEffect(() => {
    if (!state.hydrated) return;
    if (
      prevStatus.current !== null &&
      prevStatus.current !== "learned" &&
      itemProgress.status === "learned" &&
      !skipCelebration.current
    ) {
      setCelebrate(true);
    }
    prevStatus.current = itemProgress.status;
  }, [itemProgress.status, state.hydrated]);

  const stageComplete: StageCompleteInfo | null = useMemo(() => {
    if (!celebrate) return null;
    if (!isStageComplete(stage, progress)) return null;
    const nextStage =
      character.stages.find((s) => s.number === stage.number + 1) ?? null;
    return {
      stageName: stage.name,
      learned: stage.items.length,
      total: stage.items.length,
      nextStageName: nextStage?.name ?? null,
      nextStageHref: nextStage
        ? `/training/${character.id}/stage/${nextStage.number}`
        : null,
    };
  }, [celebrate, character, stage, progress]);

  const nextItem = useMemo(() => {
    const next = getNextItem(character, progress);
    return next && next.id !== item.id ? next : null;
  }, [character, progress, item.id]);

  const nextHref = nextItem
    ? `/training/${character.id}/stage/${findItem(character, nextItem.id)?.stage.number ?? stage.number}/item/${nextItem.id}`
    : null;

  /* Finishing this item would clear the whole stage — that milestone gets the
     overlay (which carries its own next-stage link) instead of a silent jump. */
  const finishesStage = useMemo(
    () =>
      itemProgress.status !== "learned" &&
      stage.items.every(
        (i) =>
          i.id === item.id ||
          getItemProgress(progress, i.id).status === "learned",
      ),
    [stage, item.id, progress, itemProgress.status],
  );

  /* Where "next" goes when you finish this item. Deliberately positional
     rather than getNextItem(), which returns the next UNLEARNED item — while
     you are training this one, that is this one. */
  const nextInOrder = useMemo(() => {
    const items = allItems(character);
    const idx = items.findIndex((i) => i.id === item.id);
    return idx >= 0 ? (items[idx + 1] ?? null) : null;
  }, [character, item.id]);

  const nextInOrderHref = nextInOrder
    ? `/training/${character.id}/stage/${findItem(character, nextInOrder.id)?.stage.number ?? stage.number}/item/${nextInOrder.id}`
    : null;

  const advance = () => {
    if (!nextInOrderHref) return;
    skipCelebration.current = true;
    router.push(nextInOrderHref);
  };

  if (state.hydrated && !unlocked) {
    return <LockedView character={character} stage={stage} item={item} />;
  }

  return (
    <div>
      <nav className="mb-6" aria-label="Breadcrumb">
        <Link
          href={`/training/${character.id}/stage/${stage.number}`}
          className="inline-flex min-h-[40px] items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Stage {pad2(stage.number)} · {stage.name}
        </Link>
      </nav>

      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="flex flex-wrap items-center gap-3">
          <p className="microlabel">
            {pad2(stage.items.findIndex((i) => i.id === item.id) + 1)} /{" "}
            {pad2(stage.items.length)}
          </p>
          <StatusBadge state={itemProgress.status} />
          {item.difficulty && (
            <span className="microlabel text-faint">{item.difficulty}</span>
          )}
        </div>
        <h1 className="display-title mt-2 text-4xl uppercase tracking-tight sm:text-5xl">
          {item.name}
        </h1>
        {item.notation && item.notation !== "—" && (
          <div className="mt-4">
            <Notation value={item.notation} size="lg" />
            <NotationPlayer notation={item.notation} />
          </div>
        )}
        {item.tags && item.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Properties">
            {item.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border bg-surface-2 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </motion.header>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <InfoSection title="What it does" body={item.purpose} />
        <InfoSection title="When to use it" body={item.whenToUse} />
        <InfoSection
          title="Leverless tip"
          body={item.leverlessTip}
          icon={<Gamepad2 className="size-3.5" aria-hidden />}
        />
      </div>

      {item.moveKeys && item.moveKeys.length > 0 && (
        <FrameDataPanel
          characterId={character.id}
          moveKeys={item.moveKeys}
          now={state.hydratedAt}
        />
      )}

      {item.verifyInGame && (
        <p className="mb-6 clip-row border border-border bg-surface-2 p-3 text-xs text-muted">
          <span className="font-semibold text-fg">Verify in game:</span>{" "}
          {item.verifyInGame}
        </p>
      )}

      <DrillPanel
        character={character}
        item={item}
        onAdvance={nextInOrder && !finishesStage ? advance : undefined}
        advanceLabel={nextInOrder ? `Next: ${nextInOrder.name}` : undefined}
      />

      {/* Fallback link for the stage-clearing case, where the drill panel
          hands off to the completion overlay instead of a Next button. */}
      {itemProgress.status === "learned" && finishesStage && nextHref && nextItem && (
        <div className="mt-6">
          <Link
            href={nextHref}
            className="group flex items-center justify-between gap-4 clip-panel border border-border bg-surface p-4 transition-colors hover:border-border-strong sm:p-5"
          >
            <div>
              <p className="microlabel">Next in curriculum</p>
              <p className="mt-1 font-semibold">{nextItem.name}</p>
            </div>
            <ArrowRight
              className="size-4 text-faint transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      )}

      <CompletionOverlay
        open={celebrate}
        itemName={item.name}
        passLabel={drillTargetLabel(item.drill)}
        stageComplete={stageComplete}
        onContinue={() => setCelebrate(false)}
        continueHref={nextHref}
        continueLabel={nextItem ? `Next: ${nextItem.name}` : "Continue"}
      />
    </div>
  );
}

function InfoSection({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon?: React.ReactNode;
}) {
  return (
    <section className="clip-panel border border-border bg-surface p-5">
      <h2 className="microlabel flex items-center gap-1.5">
        {icon}
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-fg/90">{body}</p>
    </section>
  );
}

function LockedView({
  character,
  stage,
  item,
}: {
  character: Character;
  stage: Stage;
  item: TrainingItem;
}) {
  return (
    <div className="py-20 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-border bg-surface-2">
        <Lock className="size-5 text-muted" aria-hidden />
      </span>
      <h1 className="mt-5 text-2xl font-bold uppercase tracking-tight">
        {item.name} is locked
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
        The curriculum is strictly ordered — learn everything before this item
        in Stage {pad2(stage.number)} ({stage.name}) to unlock it.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={`/training/${character.id}`}
          className="clip-row border border-border px-5 py-3 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-fg"
        >
          View stages
        </Link>
        <Link
          href="/training"
          className="clip-row bg-accent px-5 py-3 text-sm font-semibold uppercase tracking-wider text-bg transition-colors hover:bg-accent-bright"
        >
          Go to next item
        </Link>
      </div>
    </div>
  );
}
