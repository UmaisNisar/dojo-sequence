"use client";

/**
 * Ambient lightning strike engine.
 *
 * - Bolts draw top-down in ~110ms with branch forks, a bright core over a
 *   blurred glow pass, at random positions on a random cadence; ~1/3 span the
 *   full viewport with a faint scene flash.
 * - ~25% of bolt strikes double-tap: a second bolt lands ~90ms later nearby.
 * - ~15% of ambient events are horizontal cloud-to-cloud arcs across the top.
 * - The background grid "energizes" around every strike — accent-colored grid
 *   lines glow through a radial mask at the impact point.
 * - Electric curriculum pages (EWGF items, the 50/50) are supercharged:
 *   strikes come more often and always full-height.
 * - The character select gets one guaranteed entrance strike behind the
 *   ready fighter's tile.
 *
 * Renders nothing under reduced motion (OS setting or in-app toggle).
 * Debug: add `#strike` to any URL to fire every 1.5s.
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useReducedMotionSetting } from "@/hooks/use-progress";

interface BoltSpec {
  x: number;
  variant: number;
  flip: boolean;
  /** Seconds after the strike starts (double-tap echo). */
  delay: number;
}

interface Strike {
  id: number;
  kind: "bolt" | "arc";
  big: boolean;
  bolts: BoltSpec[];
  /** Arc geometry (kind === "arc"). */
  arcX?: number;
  arcWidth?: number;
  arcFlip?: boolean;
  /** Grid-glow epicenter, viewport percent. */
  gridX: number;
  gridY: number;
}

/** Bolt geometry in a 100×600 box, stretched to strike height. */
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

/** Horizontal cloud-to-cloud arc in a 600×80 box. */
const ARC_PATH =
  "M0 52 L64 40 L70 54 L150 34 L158 48 L252 28 L260 42 L356 26 L366 40 L462 22 L472 36 L600 18";
const ARC_BRANCH = "M260 42 L300 66 L292 70 L330 78";

/** Curriculum pages where the electric IS the lesson. */
const ELECTRIC_ROUTE =
  /\/item\/(ewgf-input|ewgf-consistency|ewgf-movement|fifty-fifty)$/;

let strikeSeq = 1;

export function LightningStrikes() {
  const pathname = usePathname();
  const osReduced = useReducedMotion();
  const appReduced = useReducedMotionSetting();
  const [strike, setStrike] = useState<Strike | null>(null);

  const reduced = Boolean(osReduced) || appReduced;
  const supercharged = ELECTRIC_ROUTE.test(pathname);

  /* Ambient scheduler. */
  useEffect(() => {
    if (reduced) return;
    let alive = true;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const debug =
      typeof window !== "undefined" && window.location.hash.includes("strike");

    const makeStrike = (): Strike => {
      const kind: Strike["kind"] =
        !supercharged && Math.random() < 0.15 ? "arc" : "bolt";
      if (kind === "arc") {
        const arcX = 4 + Math.random() * 40;
        const arcWidth = 34 + Math.random() * 22;
        return {
          id: strikeSeq++,
          kind,
          big: false,
          bolts: [],
          arcX,
          arcWidth,
          arcFlip: Math.random() < 0.5,
          gridX: arcX + arcWidth / 2,
          gridY: 8,
        };
      }
      const x = 4 + Math.random() * 88;
      const big = supercharged || Math.random() < 0.35;
      const bolts: BoltSpec[] = [
        {
          x,
          variant: Math.floor(Math.random() * BOLTS.length),
          flip: Math.random() < 0.5,
          delay: 0,
        },
      ];
      if (Math.random() < 0.25) {
        bolts.push({
          x: Math.min(94, Math.max(2, x + (Math.random() < 0.5 ? -1 : 1) * (4 + Math.random() * 6))),
          variant: Math.floor(Math.random() * BOLTS.length),
          flip: Math.random() < 0.5,
          delay: 0.09,
        });
      }
      return {
        id: strikeSeq++,
        kind,
        big,
        bolts,
        gridX: x,
        gridY: big ? 55 + Math.random() * 30 : 20 + Math.random() * 25,
      };
    };

    const schedule = (first: boolean) => {
      const delay = debug
        ? 1500
        : supercharged
          ? (first ? 1200 : 3500) + Math.random() * 5000
          : (first ? 3000 : 8000) + Math.random() * 14000;
      const t = setTimeout(() => {
        timers.delete(t);
        if (!alive) return;
        setStrike(makeStrike());
        const clear = setTimeout(() => {
          timers.delete(clear);
          if (alive) setStrike(null);
        }, 1000);
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
  }, [reduced, supercharged]);

  /* Entrance strike on the character select — once per visit to "/". */
  const enteredRef = useRef(false);
  useEffect(() => {
    if (reduced) return;
    if (pathname !== "/") {
      enteredRef.current = false;
      return;
    }
    if (enteredRef.current) return;
    enteredRef.current = true;
    const t = setTimeout(() => {
      setStrike({
        id: strikeSeq++,
        kind: "bolt",
        big: true,
        // Behind the ready fighter's tile (first in the grid).
        bolts: [{ x: 13, variant: 0, flip: false, delay: 0 }],
        gridX: 14,
        gridY: 30,
      });
      setTimeout(() => setStrike(null), 1000);
    }, 650);
    return () => clearTimeout(t);
  }, [pathname, reduced]);

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
            {strike.big && (
              <motion.div
                className="absolute inset-0 bg-accent"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.06, 0.02, 0] }}
                transition={{ duration: 0.55, times: [0, 0.12, 0.4, 1] }}
              />
            )}

            {/* Energized grid around the impact */}
            <motion.div
              className="bg-grid-accent absolute inset-0"
              style={{
                WebkitMaskImage: `radial-gradient(circle 300px at ${strike.gridX}% ${strike.gridY}%, black, transparent 72%)`,
                maskImage: `radial-gradient(circle 300px at ${strike.gridX}% ${strike.gridY}%, black, transparent 72%)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.55, 0.2, 0] }}
              transition={{ duration: 0.8, times: [0, 0.15, 0.5, 1] }}
            />

            {strike.kind === "bolt" &&
              strike.bolts.map((b, i) => (
                <Bolt key={i} spec={b} big={strike.big} echo={i > 0} />
              ))}

            {strike.kind === "arc" && <CloudArc strike={strike} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Bolt({
  spec,
  big,
  echo,
}: {
  spec: BoltSpec;
  big: boolean;
  echo: boolean;
}) {
  const bolt = BOLTS[spec.variant];
  const peak = echo ? 0.6 : big ? 1 : 0.8;
  const flicker = { opacity: [0, peak, peak * 0.5, peak * 0.85, 0] };
  const flickerTransition = {
    duration: big ? 0.75 : 0.6,
    times: [0, 0.15, 0.45, 0.6, 1] as number[],
    delay: spec.delay,
  };
  const draw = { duration: 0.11, ease: "easeIn" as const, delay: spec.delay };

  return (
    <svg
      className="absolute top-0"
      style={{
        left: `${spec.x}%`,
        height: big ? "100%" : `${38 + spec.variant * 8}%`,
        width: 130,
        transform: spec.flip ? "scaleX(-1)" : undefined,
      }}
      viewBox="0 0 100 600"
      preserveAspectRatio="none"
      fill="none"
    >
      <motion.path
        d={bolt.main}
        stroke="var(--accent)"
        strokeWidth={big ? 7 : 5}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ filter: "blur(4px)" }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, ...flicker }}
        transition={{ pathLength: draw, opacity: flickerTransition }}
      />
      <motion.path
        d={bolt.main}
        stroke="var(--accent-bright)"
        strokeWidth={big ? 2.2 : 1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, ...flicker }}
        transition={{ pathLength: draw, opacity: flickerTransition }}
      />
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
            pathLength: { duration: 0.09, ease: "easeIn", delay: spec.delay + 0.07 },
            opacity: {
              duration: 0.5,
              times: [0, 0.2, 0.6, 1],
              delay: spec.delay + 0.07,
            },
          }}
        />
      ))}
    </svg>
  );
}

function CloudArc({ strike }: { strike: Strike }) {
  return (
    <svg
      className="absolute"
      style={{
        left: `${strike.arcX}%`,
        top: "2%",
        width: `${strike.arcWidth}%`,
        height: 90,
        transform: strike.arcFlip ? "scaleX(-1)" : undefined,
      }}
      viewBox="0 0 600 80"
      preserveAspectRatio="none"
      fill="none"
    >
      <motion.path
        d={ARC_PATH}
        stroke="var(--accent)"
        strokeWidth={5}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ filter: "blur(4px)" }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 0.55, 0.25, 0.45, 0] }}
        transition={{
          pathLength: { duration: 0.14, ease: "easeIn" },
          opacity: { duration: 0.7, times: [0, 0.15, 0.45, 0.6, 1] },
        }}
      />
      <motion.path
        d={ARC_PATH}
        stroke="var(--accent-bright)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 0.8, 0.35, 0.65, 0] }}
        transition={{
          pathLength: { duration: 0.14, ease: "easeIn" },
          opacity: { duration: 0.7, times: [0, 0.15, 0.45, 0.6, 1] },
        }}
      />
      <motion.path
        d={ARC_BRANCH}
        stroke="var(--accent)"
        strokeWidth={1.1}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 0.6, 0.25, 0] }}
        transition={{
          pathLength: { duration: 0.1, ease: "easeIn", delay: 0.08 },
          opacity: { duration: 0.45, times: [0, 0.2, 0.6, 1], delay: 0.08 },
        }}
      />
    </svg>
  );
}
