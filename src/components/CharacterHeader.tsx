"use client";

import type { Character, CharacterSummary } from "@/types";
import { pad2 } from "@/lib/utils";
import { ProgressBar } from "./ProgressBar";

export function CharacterHeader({
  character,
  summary,
}: {
  character: Character;
  summary: CharacterSummary;
}) {
  return (
    <header className="mb-8">
      <p className="microlabel">{character.style}</p>
      <h1 className="mt-1 text-4xl font-bold uppercase tracking-tight sm:text-5xl">
        {character.name}
      </h1>
      <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3">
        <div>
          <p className="tnum text-sm font-semibold text-fg">
            {summary.learnedCount} / {summary.totalCount}{" "}
            <span className="font-medium text-muted">learned</span>
          </p>
        </div>
        <div>
          <p className="tnum text-sm font-semibold text-fg">
            Stage {pad2(summary.currentStageNumber)}{" "}
            <span className="font-medium text-muted">
              / {pad2(summary.stages.length)}
            </span>
          </p>
        </div>
        <div className="w-full max-w-xs">
          <ProgressBar
            fraction={
              summary.totalCount ? summary.learnedCount / summary.totalCount : 0
            }
            height={6}
            label={`${character.name} overall progress`}
          />
        </div>
      </div>
    </header>
  );
}
