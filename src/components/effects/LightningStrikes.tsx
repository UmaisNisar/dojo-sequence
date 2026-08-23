"use client";

/**
 * Procedural lightning storm.
 *
 * Every bolt is GENERATED at strike time — a displaced random walk with
 * elbow kinks and forking branches, built at actual pixel height (no
 * stretched template shapes; no two strikes are ever identical). Bolts
 * taper (thicker leader, thinner ground segment), flash a white-hot core
 * for the first frames, and land somewhere real: the grid glow and impact
 * burst anchor to the bolt's actual terminus, and the scene flash peaks at
 * the moment the draw completes.
 *
 * Pacing is a weather system, not a dice roll: long calms (with at most a
 * distant, dim bolt) broken by 20–30s storm fronts of 3–5 strikes with one
 * guaranteed full-height hit. Electric curriculum pages (EWGF items, the
 * 50/50) are a permanent front — frequent, always full-height. The
 * character select fires one guaranteed entrance strike.
 *
 * Renders nothing under reduced motion (OS or in-app toggle).
 * Debug: add `#strike` to any URL to fire every 1.5s.
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useReducedMotionSetting } from "@/hooks/use-progress";

/* ------------------------------------------------------------------ */
/* Geometry generation                                                 */
/* ------------------------------------------------------------------ */

interface RenderedBolt {
  leftPx: number;
  svgW: number;
  svgH: number;
  /** Tapered main channel: leader (top ~60%) and ground segment. */
  pathTop: string;
  pathBottom: string;
  pathFull: string;
  branches: string[];
  /** Terminus in viewport px. */
  endX: number;
  endY: number;
  /** Seconds after strike start (double-tap echo). */
  delay: number;
}

interface Strike {
  id: number;
  kind: "bolt" | "arc";
  big: boolean;
  distant: boolean;
  bolts: RenderedBolt[];
  arc?: { leftPct: number; widthPct: number; flip: boolean };
  /** Impact point in viewport px — grid glow + burst anchor here. */
  impactX: number;
  impactY: number;
}

let strikeSeq = 1;

const SVG_W = 220;

/** Displaced random walk from top to `heightPx`, with kinks and branches. */
function generateBolt(
  xPct: number,
  heightPx: number,
  vw: number,
  delay: number,
): RenderedBolt {
  const steps = Math.max(7, Math.round(heightPx / 55));
  const stepY = heightPx / steps;
  const amp = 15;

  let x = SVG_W / 2 + (Math.random() * 30 - 15);
  const verts: { x: number; y: number }[] = [{ x, y: 0 }];

  for (let i = 1; i <= steps; i++) {
    let y = stepY * i + (Math.random() * 10 - 5);
    // Occasional elbow: a sharp lateral jog, the signature lightning kink.
    if (Math.random() < 0.3 && i > 1 && i < steps) {
      const kx = Math.min(
        SVG_W - 16,
        Math.max(16, x + (Math.random() < 0.5 ? -1 : 1) * (10 + Math.random() * 16)),
      );
      verts.push({ x: kx, y: y - stepY * 0.3 });
      x = kx;
    }
    x = Math.min(SVG_W - 16, Math.max(16, x + (Math.random() * amp * 2 - amp)));
    y = Math.min(heightPx, y);
    verts.push({ x, y });
  }
  verts[verts.length - 1].y = heightPx;

  const toPath = (vs: { x: number; y: number }[]) =>
    vs.map((v, i) => `${i ? "L" : "M"}${v.x.toFixed(1)} ${v.y.toFixed(1)}`).join(" ");

  // Branches fork off random mid-channel vertices, thinning away.
  const branches: string[] = [];
  const branchCount = 1 + Math.floor(Math.random() * 3);
  for (let b = 0; b < branchCount; b++) {
    const origin =
      verts[2 + Math.floor(Math.random() * Math.max(1, verts.length - 5))];
    let bx = origin.x;
    let by = origin.y;
    const dir = Math.random() < 0.5 ? -1 : 1;
    const parts = [`M${bx.toFixed(1)} ${by.toFixed(1)}`];
    const bSteps = 3 + Math.floor(Math.random() * 3);
    for (let s = 0; s < bSteps; s++) {
      bx += dir * (8 + Math.random() * 16) + (Math.random() * 8 - 4);
      by += 14 + Math.random() * 26;
      parts.push(`L${bx.toFixed(1)} ${by.toFixed(1)}`);
    }
    branches.push(parts.join(" "));
  }

  const splitIdx = Math.min(verts.length - 2, Math.ceil(verts.length * 0.62));
  const end = verts[verts.length - 1];
  const leftPx = (xPct / 100) * vw - SVG_W / 2;

  return {
    leftPx,
    svgW: SVG_W,
    svgH: heightPx,
    pathTop: toPath(verts.slice(0, splitIdx + 1)),
    pathBottom: toPath(verts.slice(splitIdx)),
    pathFull: toPath(verts),
    branches,
    endX: leftPx + end.x,
    endY: end.y,
    delay,
  };
}

function buildBoltStrike(
  vw: number,
  vh: number,
  opts: { xPct?: number; big?: boolean; distant?: boolean; allowEcho?: boolean },
): Strike {
  const big = opts.big ?? false;
  const distant = opts.distant ?? false;
  const xPct = opts.xPct ?? 4 + Math.random() * 88;
  const heightPx = big
    ? vh
    : vh * (0.3 + Math.random() * 0.25) * (distant ? 0.75 : 1);

  const bolts = [generateBolt(xPct, heightPx, vw, 0)];
  if ((opts.allowEcho ?? true) && !distant && Math.random() < 0.25) {
    const echoX = Math.min(94, Math.max(2, xPct + (Math.random() < 0.5 ? -1 : 1) * (4 + Math.random() * 7)));
    bolts.push(generateBolt(echoX, heightPx * (0.7 + Math.random() * 0.3), vw, 0.09));
  }

  return {
    id: strikeSeq++,
    kind: "bolt",
    big,
    distant,
    bolts,
    impactX: bolts[0].endX,
    impactY: bolts[0].endY,
  };
}

function buildArcStrike(vw: number, vh: number): Strike {
  const leftPct = 4 + Math.random() * 40;
  const widthPct = 34 + Math.random() * 22;
  return {
    id: strikeSeq++,
    kind: "arc",
    big: false,
    distant: false,
    bolts: [],
    arc: { leftPct, widthPct, flip: Math.random() < 0.5 },
    impactX: ((leftPct + widthPct / 2) / 100) * vw,
    impactY: 0.07 * vh,
  };
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const ELECTRIC_ROUTE =
  /\/item\/(ewgf-input|ewgf-consistency|ewgf-movement|fifty-fifty)$/;

/** Seconds until the leader reaches ground — flash/burst fire then. */
const DRAW_S = 0.11;

export function LightningStrikes() {
  const pathname = usePathname();
  const osReduced = useReducedMotion();
  const appReduced = useReducedMotionSetting();
  const [strike, setStrike] = useState<Strike | null>(null);

  const reduced = Boolean(osReduced) || appReduced;
  const supercharged = ELECTRIC_ROUTE.test(pathname);

  /* Weather system. */
  useEffect(() => {
    if (reduced) return;
    let alive = true;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const at = (ms: number, fn: () => void) => {
      const t = setTimeout(() => {
        timers.delete(t);
        if (alive) fn();
      }, ms);
      timers.add(t);
    };
    const debug =
      typeof window !== "undefined" && window.location.hash.includes("strike");

    const fire = (opts: { big?: boolean; distant?: boolean; arcAllowed?: boolean }) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const strike =
        (opts.arcAllowed ?? true) && !opts.big && !opts.distant && Math.random() < 0.18
          ? buildArcStrike(vw, vh)
          : buildBoltStrike(vw, vh, opts);
      setStrike(strike);
      at(1100, () => setStrike(null));
    };

    if (debug) {
      const loop = () => at(1500, () => {
        fire({ big: Math.random() < 0.5 });
        loop();
      });
      loop();
    } else if (supercharged) {
      // Electric pages: a permanent storm front, always full-height.
      const loop = (first: boolean) =>
        at((first ? 1200 : 3500) + Math.random() * 5000, () => {
          fire({ big: true });
          loop(false);
        });
      loop(true);
    } else {
      // Calm → front → calm. Calms may carry one distant, dim bolt.
      const front = () => {
        const count = 3 + Math.floor(Math.random() * 3);
        const span = 20000 + Math.random() * 10000;
        const bigIndex = Math.floor(Math.random() * count);
        for (let i = 0; i < count; i++) {
          at((span * (i + Math.random() * 0.6)) / count, () =>
            fire({ big: i === bigIndex || Math.random() < 0.25 }),
          );
        }
        at(span + 2000, () => calm(false));
      };
      const calm = (first: boolean) => {
        const duration = first
          ? 5000 + Math.random() * 8000
          : 55000 + Math.random() * 35000;
        if (!first && Math.random() < 0.6) {
          at(Math.random() * duration, () => fire({ distant: true, arcAllowed: false }));
        }
        at(duration, front);
      };
      calm(true);
    }

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
      setStrike(
        buildBoltStrike(window.innerWidth, window.innerHeight, {
          xPct: 13.5,
          big: true,
          allowEcho: false,
        }),
      );
      setTimeout(() => setStrike(null), 1100);
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
            {/* Scene flash — peaks at impact, not at leader start */}
            {strike.big && (
              <motion.div
                className="absolute inset-0 bg-accent"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.07, 0.02, 0] }}
                transition={{
                  delay: DRAW_S,
                  duration: 0.5,
                  times: [0, 0.12, 0.4, 1],
                }}
              />
            )}

            {/* Energized grid, anchored to the real terminus */}
            {!strike.distant && (
              <motion.div
                className="bg-grid-accent absolute inset-0"
                style={{
                  WebkitMaskImage: `radial-gradient(circle ${strike.big ? 320 : 240}px at ${strike.impactX}px ${strike.impactY}px, black, transparent 72%)`,
                  maskImage: `radial-gradient(circle ${strike.big ? 320 : 240}px at ${strike.impactX}px ${strike.impactY}px, black, transparent 72%)`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.55, 0.2, 0] }}
                transition={{
                  delay: DRAW_S * 0.7,
                  duration: 0.8,
                  times: [0, 0.15, 0.5, 1],
                }}
              />
            )}

            {/* Impact burst at the terminus */}
            {strike.kind === "bolt" && !strike.distant && (
              <motion.div
                className="absolute rounded-full"
                style={{
                  left: strike.impactX - (strike.big ? 70 : 45),
                  top: strike.impactY - (strike.big ? 70 : 45),
                  width: strike.big ? 140 : 90,
                  height: strike.big ? 140 : 90,
                  background:
                    "radial-gradient(closest-side, rgba(167,139,250,0.55), rgba(139,92,246,0.18) 55%, transparent)",
                }}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: [0, 0.9, 0], scale: [0.3, 1.25, 1.45] }}
                transition={{ delay: DRAW_S, duration: 0.45, times: [0, 0.25, 1] }}
              />
            )}

            {strike.kind === "bolt" &&
              strike.bolts.map((bolt, i) => (
                <BoltSvg
                  key={i}
                  bolt={bolt}
                  big={strike.big}
                  distant={strike.distant}
                  echo={i > 0}
                />
              ))}

            {strike.kind === "arc" && strike.arc && <CloudArc arc={strike.arc} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

function BoltSvg({
  bolt,
  big,
  distant,
  echo,
}: {
  bolt: RenderedBolt;
  big: boolean;
  distant: boolean;
  echo: boolean;
}) {
  const peak = (echo ? 0.6 : big ? 1 : 0.8) * (distant ? 0.35 : 1);
  const flicker = { opacity: [0, peak, peak * 0.5, peak * 0.85, 0] };
  const flickerT = {
    duration: big ? 0.75 : 0.6,
    times: [0, 0.15, 0.45, 0.6, 1] as number[],
    delay: bolt.delay,
  };
  const draw = { duration: DRAW_S, ease: "easeIn" as const, delay: bolt.delay };
  const coreTopW = distant ? 1.3 : big ? 2.6 : 2;
  const coreBottomW = distant ? 0.9 : big ? 1.6 : 1.2;

  return (
    <svg
      className="absolute top-0"
      style={{
        left: bolt.leftPx,
        width: bolt.svgW,
        height: bolt.svgH,
        overflow: "visible",
        filter: distant ? "blur(1px)" : undefined,
      }}
      viewBox={`0 0 ${bolt.svgW} ${bolt.svgH}`}
      fill="none"
    >
      {/* Glow channel */}
      <motion.path
        d={bolt.pathFull}
        stroke="var(--accent)"
        strokeWidth={big ? 7 : 5}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ filter: "blur(4px)" }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, ...flicker }}
        transition={{ pathLength: draw, opacity: flickerT }}
      />
      {/* Tapered core: leader, then thinner ground segment */}
      <motion.path
        d={bolt.pathTop}
        stroke="var(--accent-bright)"
        strokeWidth={coreTopW}
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, ...flicker }}
        transition={{
          pathLength: { duration: DRAW_S * 0.62, ease: "easeIn", delay: bolt.delay },
          opacity: flickerT,
        }}
      />
      <motion.path
        d={bolt.pathBottom}
        stroke="var(--accent-bright)"
        strokeWidth={coreBottomW}
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, ...flicker }}
        transition={{
          pathLength: {
            duration: DRAW_S * 0.38,
            ease: "easeOut",
            delay: bolt.delay + DRAW_S * 0.62,
          },
          opacity: flickerT,
        }}
      />
      {/* White-hot core — spikes for the first frames, then hands off */}
      {!distant && (
        <motion.path
          d={bolt.pathFull}
          stroke="#f6f3ff"
          strokeWidth={big ? 1.2 : 0.9}
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, peak, peak * 0.15, 0] }}
          transition={{
            pathLength: draw,
            opacity: {
              duration: 0.45,
              times: [0, 0.14, 0.45, 1],
              delay: bolt.delay,
            },
          }}
        />
      )}
      {/* Branch forks, a beat behind the leader */}
      {bolt.branches.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="var(--accent)"
          strokeWidth={distant ? 0.8 : 1.2}
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, peak * 0.7, peak * 0.3, 0] }}
          transition={{
            pathLength: { duration: 0.09, ease: "easeIn", delay: bolt.delay + 0.07 },
            opacity: {
              duration: 0.5,
              times: [0, 0.2, 0.6, 1],
              delay: bolt.delay + 0.07,
            },
          }}
        />
      ))}
    </svg>
  );
}

const ARC_PATH =
  "M0 52 L64 40 L70 54 L150 34 L158 48 L252 28 L260 42 L356 26 L366 40 L462 22 L472 36 L600 18";
const ARC_BRANCH = "M260 42 L300 66 L292 70 L330 78";

function CloudArc({
  arc,
}: {
  arc: { leftPct: number; widthPct: number; flip: boolean };
}) {
  return (
    <svg
      className="absolute"
      style={{
        left: `${arc.leftPct}%`,
        top: "2%",
        width: `${arc.widthPct}%`,
        height: 90,
        transform: arc.flip ? "scaleX(-1)" : undefined,
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
