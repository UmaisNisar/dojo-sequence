"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowUp, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  /** Lowercased direction, e.g. "df". Undefined for pure button steps. */
  dir?: string;
  /** True when the notation holds the direction (uppercase, e.g. DF). */
  hold: boolean;
  /** True for an explicit neutral (n). */
  neutral: boolean;
  buttons: number[];
}

/** Rotation of an up-arrow per direction, clockwise degrees. */
const DIR_ROTATION: Record<string, number> = {
  u: 0,
  uf: 45,
  f: 90,
  df: 135,
  d: 180,
  db: 225,
  b: 270,
  ub: 315,
};

const TOKEN_RE = /^(uf|ub|df|db|[fbdun])?(?:\+?([1-4](?:\+[1-4])*))?$/i;

/**
 * Parse simple comma-separated notation ("f,n,d,df+2") into steps.
 * Anything with combo arrows, cancels (~), or held stances returns null —
 * those don't animate meaningfully.
 */
export function parseNotation(notation: string): Step[] | null {
  if (!notation || !/^[a-zA-Z0-9,+\s]+$/.test(notation)) return null;
  const tokens = notation.split(",").map((t) => t.trim());
  if (tokens.length < 2) return null;
  const steps: Step[] = [];
  for (const token of tokens) {
    const m = TOKEN_RE.exec(token);
    if (!m || (!m[1] && !m[2])) return null;
    const rawDir = m[1];
    const lower = rawDir?.toLowerCase();
    steps.push({
      dir: lower === "n" ? undefined : lower,
      hold: !!rawDir && rawDir !== rawDir.toLowerCase() && lower !== "n",
      neutral: lower === "n",
      buttons: m[2] ? m[2].split("+").map(Number) : [],
    });
  }
  return steps;
}

/**
 * Plays a parsed input sequence on loop — each step lights in order.
 * Renders nothing for notations it can't parse.
 */
export function NotationPlayer({ notation }: { notation: string }) {
  const steps = useMemo(() => parseNotation(notation), [notation]);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (!steps) return;
    // Cycle steps with a rest beat between loops.
    const interval = setInterval(() => {
      setActive((a) => (a + 1 >= steps.length + 1 ? -1 : a + 1));
    }, 420);
    return () => clearInterval(interval);
  }, [steps]);

  if (!steps) return null;

  return (
    <div
      aria-label={`Input sequence: ${notation}`}
      className="mt-3 flex flex-wrap items-center gap-1.5"
    >
      {steps.map((step, i) => {
        const isActive = active === i;
        return (
          <motion.span
            key={i}
            animate={{
              scale: isActive ? 1.12 : 1,
              y: isActive ? -2 : 0,
            }}
            transition={{ type: "spring", stiffness: 600, damping: 26 }}
            className={cn(
              "flex h-9 min-w-9 items-center justify-center gap-1 rounded-md border px-1.5 transition-colors",
              isActive
                ? "border-accent bg-accent-dim text-accent-bright"
                : "border-border bg-surface-2 text-muted",
            )}
          >
            {step.neutral && (
              <Circle className="size-2.5 opacity-70" aria-label="neutral" />
            )}
            {step.dir && (
              <ArrowUp
                className={cn("size-4", step.hold && "stroke-[3]")}
                style={{ transform: `rotate(${DIR_ROTATION[step.dir] ?? 0}deg)` }}
                aria-label={`${step.hold ? "hold " : ""}${step.dir}`}
              />
            )}
            {step.buttons.map((b) => (
              <span
                key={b}
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border font-mono text-[10px] font-bold",
                  isActive ? "border-accent-bright" : "border-border-strong",
                )}
                aria-label={`button ${b}`}
              >
                {b}
              </span>
            ))}
          </motion.span>
        );
      })}
      <span className="microlabel ml-2 text-[9px] text-faint">input sequence</span>
    </div>
  );
}
