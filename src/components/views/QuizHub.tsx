"use client";

import { useState } from "react";
import type { Character } from "@/types";
import { cn } from "@/lib/utils";
import { KnowledgeQuizView } from "./KnowledgeQuizView";
import { QuizView } from "./QuizView";

type Mode = "knowledge" | "punish";

/**
 * One quiz destination, two things worth testing.
 *
 * The knowledge quiz asks what you know and gives you as long as you want.
 * The punish drill asks how fast you recognise a gap, on a four second timer.
 * They train different muscles, so neither replaces the other — but they are
 * both "the quiz" as far as anyone navigating the app is concerned.
 */
export function QuizHub({ character }: { character: Character }) {
  const hasPunish = (character.punishQuiz?.length ?? 0) > 0;
  const [mode, setMode] = useState<Mode>("knowledge");

  if (!hasPunish) return <KnowledgeQuizView character={character} />;

  const tabs: { id: Mode; label: string; hint: string }[] = [
    { id: "knowledge", label: "Knowledge", hint: "Untimed · your training" },
    { id: "punish", label: "Punish reaction", hint: "4s timer · reflexes" },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = mode === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setMode(t.id)}
              aria-pressed={active}
              className={cn(
                "clip-row border px-4 py-2 text-left transition-colors",
                active
                  ? "border-accent bg-accent-dim"
                  : "border-border bg-surface hover:border-border-strong",
              )}
            >
              <span
                className={cn(
                  "block text-[13px] font-bold uppercase tracking-wide",
                  active ? "text-accent-bright" : "text-muted",
                )}
              >
                {t.label}
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-faint">
                {t.hint}
              </span>
            </button>
          );
        })}
      </div>

      {mode === "knowledge" ? (
        <KnowledgeQuizView character={character} />
      ) : (
        <QuizView character={character} />
      )}
    </div>
  );
}
