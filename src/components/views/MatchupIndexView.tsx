"use client";

import Link from "next/link";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { characters } from "@/data/characters";
import { getFrameData } from "@/data/frames";
import { useActiveCharacter } from "@/hooks/use-progress";
import { buildThreatSheet } from "@/lib/threats";

/**
 * Who you can look up. Only fighters with a verified frame table appear,
 * because a matchup sheet here is derived from that table and nothing else —
 * there is no hand-written matchup advice to fall back on, by design.
 */
export function MatchupIndexView() {
  const you = useActiveCharacter();

  return (
    <div>
      <header className="mb-8">
        <p className="microlabel">Defense</p>
        <h1 className="display-title mt-1 text-4xl uppercase tracking-tight sm:text-5xl">
          Matchups
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Every lesson in this app teaches your own character. This is the other
          half — what the fighter across from you is doing, which low you cannot
          react to, and what you get for blocking correctly. Punishes are shown
          for <span className="text-fg">{you.name}</span>, whoever you are
          reading about.
        </p>
      </header>

      <ul className="grid gap-2 sm:grid-cols-2">
        {characters
          .filter((c) => getFrameData(c.id))
          .map((opponent) => {
            const set = getFrameData(opponent.id)!;
            const groups = buildThreatSheet(set);
            const lows = groups.find((g) => g.kind === "fast-low")?.moves.length ?? 0;
            const launch =
              groups.find((g) => g.kind === "free-launch")?.moves.length ?? 0;
            return (
              <li key={opponent.id}>
                <Link
                  href={`/matchups/${opponent.id}`}
                  className="group flex items-center gap-3 clip-panel border border-border bg-surface p-4 transition-colors hover:border-border-strong"
                >
                  <span
                    className="flex size-9 shrink-0 items-center justify-center clip-row bg-surface-2"
                    style={{ color: opponent.accent?.bright }}
                  >
                    <ShieldAlert className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">
                      Fighting {opponent.name}
                      {opponent.id === you.id && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider text-faint">
                          mirror
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-muted">
                      {lows} fast {lows === 1 ? "low" : "lows"} · {launch}{" "}
                      launch-punishable
                    </span>
                  </span>
                  <ArrowRight
                    className="size-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
