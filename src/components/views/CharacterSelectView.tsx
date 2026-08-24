"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Bird,
  CloudLightning,
  Coffee,
  Cross,
  Crosshair,
  Crown,
  Dumbbell,
  Feather,
  Flame,
  Flower2,
  Footprints,
  HandMetal,
  Lock,
  PawPrint,
  Shield,
  Skull,
  Snowflake,
  Sparkles,
  Sword,
  Swords,
  Tornado,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { characters, comingSoon } from "@/data/characters";
import { useProgress } from "@/hooks/use-progress";
import { summarizeCharacter } from "@/lib/progression";
import { rankFor } from "@/lib/ranks";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ProgressBar";

interface Tile {
  id: string;
  name: string;
  style: string;
  available: boolean;
}

/**
 * Original thematic glyphs per fighter — no game assets, just an icon that
 * evokes each character's identity.
 */
const characterIcons: Record<string, LucideIcon> = {
  kazuya: Zap, // the Electric
  lars: CloudLightning, // Lightning Storm
  jin: Flame, // flame motif
  reina: Tornado, // Taido spins
  "devil-jin": Feather, // black wings
  king: Crown,
  dragunov: Snowflake, // the White Angel of Death
  paul: Dumbbell,
  law: HandMetal,
  hwoarang: Footprints, // Taekwondo
  xiaoyu: PawPrint, // Panda
  bryan: Skull,
  steve: Shield, // guard-and-counter boxing
  nina: Crosshair, // assassin
  asuka: Bird, // Kazama style
  jun: Sparkles,
  lili: Flower2,
  yoshimitsu: Sword,
  claudio: Cross, // exorcist
  victor: Swords,
  azucena: Coffee, // the coffee queen
};

/** Fallback monogram for a fighter without a glyph. */
function monogram(name: string): string {
  const words = name.split(" ");
  return words.length > 1
    ? (words[0][0] + words[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

export function CharacterSelectView({
  embedded = false,
}: {
  /** Rendered inside the app shell (the Characters tab) rather than as the
      full-screen entry gate at the root route. */
  embedded?: boolean;
} = {}) {
  const { state, dispatch } = useProgress();
  const router = useRouter();

  const tiles: Tile[] = useMemo(
    () => [
      ...characters.map((c) => ({
        id: c.id,
        name: c.name,
        style: c.style,
        available: true,
      })),
      ...comingSoon.map((c) => ({
        id: c.id,
        name: c.name,
        style: c.style,
        available: false,
      })),
    ],
    [],
  );

  const [focusedId, setFocusedId] = useState(tiles[0]?.id ?? "");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deniedId, setDeniedId] = useState<string | null>(null);

  const focused = tiles.find((t) => t.id === focusedId) ?? tiles[0];

  // Readout reflects whichever available fighter is under the cursor.
  const focusedCharacter = characters.find((c) => c.id === focusedId) ?? null;
  const focusedAccent = focusedCharacter?.accent;
  const summary = useMemo(
    () =>
      focusedCharacter
        ? summarizeCharacter(focusedCharacter, state.characters[focusedCharacter.id])
        : null,
    [focusedCharacter, state.characters],
  );

  const choose = (tile: Tile) => {
    if (!tile.available) {
      setDeniedId(tile.id);
      window.setTimeout(() => setDeniedId(null), 400);
      return;
    }
    if (selectedId) return;
    setSelectedId(tile.id);
    dispatch({ type: "set-active-character", characterId: tile.id });
    // Let the select flash play before entering the dojo.
    window.setTimeout(() => router.push("/training"), 450);
  };

  const Root = embedded ? "div" : "main";

  return (
    <Root
      className={
        embedded
          ? "flex w-full flex-col"
          : "mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-8 pt-10 sm:px-6"
      }
    >
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-8 text-center"
      >
        <p className="microlabel flex items-center justify-center gap-2">
          <span className="flex size-5 items-center justify-center clip-slant bg-accent text-bg">
            <Zap className="size-3" strokeWidth={2.5} aria-hidden />
          </span>
          Dojo Sequence
        </p>
        <h1 className="display-title mt-3 text-4xl uppercase tracking-tight sm:text-6xl">
          Choose your fighter
        </h1>
        <p className="mt-2 text-sm text-muted">
          Each fighter is a full curriculum, taught in strict order. More on the way.
        </p>
      </motion.header>

      <div
        role="listbox"
        aria-label="Character select"
        aria-activedescendant={`tile-${focusedId}`}
        className="grid flex-1 grid-cols-3 content-start gap-2 sm:grid-cols-5 sm:gap-3 lg:grid-cols-7"
      >
        {tiles.map((tile, i) => {
          const isFocused = tile.id === focusedId;
          const isSelected = tile.id === selectedId;
          const isDenied = tile.id === deniedId;
          const own = characters.find((c) => c.id === tile.id)?.accent;
          return (
            <motion.button
              key={tile.id}
              id={`tile-${tile.id}`}
              role="option"
              aria-selected={isFocused}
              aria-disabled={!tile.available}
              aria-label={
                tile.available ? tile.name : `${tile.name} — locked, coming soon`
              }
              type="button"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{
                opacity: 1,
                scale: isSelected ? 1.04 : 1,
                x: isDenied ? [0, -5, 5, -3, 3, 0] : 0,
              }}
              transition={{
                opacity: { delay: i * 0.02, duration: 0.25 },
                scale: { type: "spring", stiffness: 380, damping: 26 },
                x: { duration: 0.35 },
              }}
              whileHover={tile.available && !selectedId ? { scale: 1.03 } : undefined}
              whileTap={tile.available ? { scale: 0.97 } : undefined}
              onMouseEnter={() => setFocusedId(tile.id)}
              onFocus={() => setFocusedId(tile.id)}
              onClick={() => choose(tile)}
              style={
                own
                  ? ({
                      "--accent": own.base,
                      "--accent-bright": own.bright,
                      "--accent-deep": own.deep,
                      "--accent-dim": `${own.base}20`,
                    } as React.CSSProperties)
                  : undefined
              }
              className={cn(
                "group relative flex aspect-[5/6] flex-col items-center justify-center gap-2 overflow-hidden clip-panel border p-2 transition-colors sm:aspect-square",
                tile.available
                  ? "breathe border-accent/60 bg-accent-dim"
                  : "border-border bg-surface",
                isFocused && tile.available && "border-accent",
                isFocused && !tile.available && "border-border-strong",
                isSelected && "border-accent-bright shadow-lg shadow-accent/25",
              )}
            >
              {/* P1-style cursor frame on the focused tile */}
              {isFocused && (
                <motion.span
                  layoutId="cursor"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  className={cn(
                    "pointer-events-none absolute inset-0 clip-panel border-2",
                    tile.available ? "border-accent-bright" : "border-border-strong",
                  )}
                  aria-hidden
                />
              )}

              {/* Scanline sweep on the focused tile */}
              {isFocused && (
                <span
                  aria-hidden
                  className="scanline pointer-events-none absolute inset-x-1 top-0 h-10 bg-gradient-to-b from-transparent via-accent/12 to-transparent"
                />
              )}

              <span
                className={cn(
                  "flex size-12 items-center justify-center rounded-full border sm:size-14",
                  tile.available
                    ? "border-accent/40 bg-accent/15 text-accent-bright"
                    : "border-border bg-surface-2 text-faint",
                )}
                aria-hidden
              >
                {(() => {
                  const Icon = characterIcons[tile.id];
                  return Icon ? (
                    <Icon
                      className="size-6 sm:size-7"
                      strokeWidth={tile.available ? 2.2 : 1.8}
                    />
                  ) : (
                    <span className="font-mono text-lg font-bold">
                      {monogram(tile.name)}
                    </span>
                  );
                })()}
              </span>
              <span
                className={cn(
                  "line-clamp-1 px-1 text-center text-[10px] font-semibold uppercase tracking-[0.1em] sm:text-[11px]",
                  tile.available ? "text-fg" : "text-muted",
                )}
              >
                {tile.name}
              </span>

              {tile.available ? (
                <span className="microlabel text-[9px] text-accent-bright">
                  Ready
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-faint">
                  <Lock className="size-2.5" aria-hidden /> Locked
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Tekken-style readout — takes the focused fighter's colour */}
      <div
        className="mt-8 flex min-h-[92px] items-end justify-between gap-4 border-t border-border pt-5"
        aria-live="polite"
      
        style={
          focusedAccent
            ? ({
                "--accent": focusedAccent.base,
                "--accent-bright": focusedAccent.bright,
                "--accent-deep": focusedAccent.deep,
                "--accent-dim": `${focusedAccent.base}20`,
              } as React.CSSProperties)
            : undefined
        }
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="microlabel">{focused?.style}</p>
            {focusedCharacter &&
              state.activeCharacterId === focusedCharacter.id && (
                <span className="microlabel text-accent-bright">· training</span>
              )}
          </div>
          <p
            key={focused?.id}
            className={cn(
              "display-title truncate text-3xl uppercase sm:text-5xl",
              focused?.available ? "text-fg" : "text-faint",
            )}
          >
            {focused?.name}
          </p>
          {focusedCharacter?.tagline && (
            <p
              key={`${focused?.id}-tag`}
              className="mt-2 text-xs leading-relaxed text-muted"
            >
              {focusedCharacter.tagline}
            </p>
          )}
        </div>
        <div className="shrink-0 pb-1 text-right">
          {focused?.available && summary ? (
            <>
              <p className="microlabel text-accent-bright">
                {rankFor(summary.learnedCount, summary.totalCount).name}
              </p>
              <p className="tnum mt-1 text-sm font-semibold text-fg">
                {summary.learnedCount} / {summary.totalCount} learned
              </p>
              <div className="mt-2 w-36 sm:w-48">
                <ProgressBar
                  fraction={
                    summary.totalCount
                      ? summary.learnedCount / summary.totalCount
                      : 0
                  }
                  height={5}
                  label={`${focused.name} progress`}
                />
              </div>
              <p className="microlabel mt-2 text-faint">Select to enter the dojo</p>
            </>
          ) : (
            <p className="microlabel text-faint">Guide coming soon</p>
          )}
        </div>
      </div>
    </Root>
  );
}
