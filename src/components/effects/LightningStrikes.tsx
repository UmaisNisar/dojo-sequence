"use client";

/**
 * Ambient lightning, done properly: every so often a bolt STRIKES — drawn
 * top-down in ~100ms with branch forks and a glow pass, at a random
 * horizontal position. Roughly a third of strikes span the full viewport
 * height and light the scene with a faint flash.
 *
 * Renders nothing under reduced motion (OS setting or in-app toggle).
 * Debug: open any page with `#strike` in the URL to strike every 1.5s.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useReducedMotionSetting } from "@/hooks/use-progress";

interface Strike {
  id: number;
  /** Horizontal position, percent of viewport width. */
  x: number;
  /** Full-viewport-height strike (with scene flash). */
  big: boolean;
  flip: boolean;
  variant: number;
}

/**
 * Bolt geometry in a 100×600 box, stretched to the strike's height with
 * `preserveAspectRatio="none"`; `vector-effect: non-scaling-stroke` keeps
 * stroke widths honest while the shape stretches.
 */
const BOLTS: { main: string; branches: string[] }[] = [
  {
    main: "M54 0 L44 88 L58 96 L38 210 L56 222 L30 370 L48 380 L36 470 L44 476 L28 600",
    branches: [
      "M58 96 L84 150 L76 154 L94 210",
      "M56 222 L28 290 L36 296 L16 350",
    ],
  },
  {
    main: "M46 0 L58 70 L44 80 L64 190 L46 200 L66 320 L50 332 L70 440 L56 450 L72 600",
    branches: [
      "M44 80 L20 140 L28 146 L10 196",
      "M50 332 L82 400 L74 406 L92 460",
    ],
  },
  {
    main: "M50 0 L40 60 L56 66 L34 160 L52 170 L26 280 L50 292 L34 400 L52 410 L40 520 L50 530 L38 600",
    branches: [
      "M56 66 L78 120 L70 126 L86 170",
      "M50 292 L20 350 L30 356 L14 410",
      "M52 410 L74 470 L66 476 L80 520",
    ],
  },
];

export function LightningStrikes() {
  const osReduced = useReducedMotion();
  const appReduced = useReducedMotionSetting();
  const [strike, setStrike] = useState<Strike | null>(null);

  const reduced = Boolean(osReduced) || appReduced;

  useEffect(() => {
    if (reduced) return;
    let alive = true;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const debug =
      typeof window !== "undefined" && window.location.hash.includes("strike");

    const schedule = (first: boolean) => {
      const delay = debug
        ? 1500
        : (first ? 3000 : 8000) + Math.random() * (first ? 6000 : 14000);
      const t = setTimeout(() => {
        timers.delete(t);
        if (!alive) return;
        setStrike({
          id: Date.now(),
          x: 4 + Math.random() * 88,
          big: Math.random() < 0.35,
          flip: Math.random() < 0.5,
          variant: Math.floor(Math.random() * BOLTS.length),
        });
        const clear = setTimeout(() => {
          timers.delete(clear);
          if (alive) setStrike(null);
        }, 900);
        timers.add(clear);
        schedule(false);
      }, delay);
      timers.add(t);
    };

    schedule(true);
    return () => {
      alive = false;
      for (const t of timers) clearTimeout(t);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <AnimatePresence>
        {strike && (
          <motion.div
            key={strike.id}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Faint scene flash on full-height strikes */}
            {strike.big && (
              <motion.div
                className="absolute inset-0 bg-accent"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.06, 0.02, 0] }}
                transition={{ duration: 0.55, times: [0, 0.12, 0.4, 1] }}
              />
            )}
            <Bolt strike={strike} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Bolt({ strike }: { strike: Strike }) {
  const bolt = BOLTS[strike.variant];
  const flicker = {
    opacity: strike.big ? [0, 1, 0.5, 0.9, 0] : [0, 0.8, 0.4, 0.7, 0],
  };
  const flickerTransition = {
    duration: strike.big ? 0.75 : 0.6,
    times: [0, 0.15, 0.45, 0.6, 1],
  };

  return (
    <svg
      className="absolute top-0"
      style={{
        left: `${strike.x}%`,
        height: strike.big ? "100%" : `${38 + strike.variant * 8}%`,
        width: 130,
        transform: strike.flip ? "scaleX(-1)" : undefined,
      }}
      viewBox="0 0 100 600"
      preserveAspectRatio="none"
      fill="none"
    >
      {/* Glow pass */}
      <motion.path
        d={bolt.main}
        stroke="var(--accent)"
        strokeWidth={strike.big ? 7 : 5}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ filter: "blur(4px)" }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, ...flicker }}
        transition={{
          pathLength: { duration: 0.11, ease: "easeIn" },
          opacity: flickerTransition,
        }}
      />
      {/* Bright core */}
      <motion.path
        d={bolt.main}
        stroke="var(--accent-bright)"
        strokeWidth={strike.big ? 2.2 : 1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, ...flicker }}
        transition={{
          pathLength: { duration: 0.11, ease: "easeIn" },
          opacity: flickerTransition,
        }}
      />
      {/* Branch forks, a beat behind the leader */}
      {bolt.branches.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="var(--accent)"
          strokeWidth={1.2}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.7, 0.3, 0] }}
          transition={{
            pathLength: { duration: 0.09, ease: "easeIn", delay: 0.07 },
            opacity: { duration: 0.5, times: [0, 0.2, 0.6, 1], delay: 0.07 },
          }}
        />
      ))}
    </svg>
  );
}
