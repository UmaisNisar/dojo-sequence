"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { characters, comingSoon } from "@/data/characters";
import { useProgress } from "@/hooks/use-progress";
import { summarizeCharacter } from "@/lib/progression";
import { ProgressBar } from "@/components/ProgressBar";

export function CharactersView() {
  const { state, dispatch } = useProgress();

  const available = useMemo(
    () =>
      characters.map((character) => ({
        character,
        summary: summarizeCharacter(character, state.characters[character.id]),
      })),
    [state.characters],
  );

  return (
    <div>
      <header className="mb-8">
        <p className="microlabel">Characters</p>
        <h1 className="mt-1 text-4xl font-bold uppercase tracking-tight sm:text-5xl">
          Roster
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Each character is a full curriculum — movement to gameplan, in strict
          order. One at a time is the fastest way up.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {available.map(({ character, summary }, index) => (
          <motion.div
            key={character.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
          >
            <Link
              href={`/training/${character.id}`}
              onClick={() =>
                dispatch({
                  type: "set-active-character",
                  characterId: character.id,
                })
              }
              className="group flex h-full flex-col rounded-xl border border-accent/40 bg-surface p-5 transition-colors hover:border-accent sm:p-6"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="microlabel">{character.style}</p>
                {state.activeCharacterId === character.id && (
                  <span className="microlabel text-accent-bright">training</span>
                )}
              </div>
              <h2 className="mt-1 text-3xl font-bold uppercase tracking-tight">
                {character.name}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {character.tagline}
              </p>
              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <ProgressBar
                    fraction={
                      summary.totalCount
                        ? summary.learnedCount / summary.totalCount
                        : 0
                    }
                    height={5}
                    label={`${character.name} progress`}
                  />
                </div>
                <span className="tnum text-xs font-semibold text-muted">
                  {summary.learnedCount} / {summary.totalCount}
                </span>
                <ArrowRight
                  className="size-4 text-accent-bright transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </div>
            </Link>
          </motion.div>
        ))}

        {comingSoon.map((c, index) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: (available.length + index) * 0.05,
              duration: 0.3,
              ease: "easeOut",
            }}
            className="flex h-full flex-col rounded-xl border border-border bg-surface p-5 opacity-60 sm:p-6"
            aria-label={`${c.name} — coming soon`}
          >
            <p className="microlabel">{c.style}</p>
            <h2 className="mt-1 text-3xl font-bold uppercase tracking-tight text-muted">
              {c.name}
            </h2>
            <p className="microlabel mt-auto pt-5 text-faint">Coming soon</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
