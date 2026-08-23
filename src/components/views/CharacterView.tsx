"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import type { Character } from "@/types";
import { useProgress } from "@/hooks/use-progress";
import { summarizeCharacter } from "@/lib/progression";
import { CharacterHeader } from "@/components/CharacterHeader";
import { StageCard } from "@/components/StageCard";

export function CharacterView({ character }: { character: Character }) {
  const { state } = useProgress();
  const progress = state.characters[character.id];
  const summary = useMemo(
    () => summarizeCharacter(character, progress),
    [character, progress],
  );

  const nextStageId = summary.stages.find((s) => s.status === "unlocked")?.stage.id;

  return (
    <div>
      <CharacterHeader character={character} summary={summary} />
      <ol className="flex flex-col gap-2">
        {summary.stages.map((s, index) => (
          <motion.li
            key={s.stage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.25, ease: "easeOut" }}
          >
            <StageCard
              characterId={character.id}
              summary={s}
              isNext={s.stage.id === nextStageId}
            />
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
