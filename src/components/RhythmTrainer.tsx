"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Minus, Music4, Pause, Play, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const MIN_BPM = 50;
const MAX_BPM = 200;
const BEATS = 4;

/**
 * Visual metronome for execution drills — match each rep (dash, cancel,
 * electric) to the pulse, then push the tempo. No audio by design.
 */
export function RhythmTrainer() {
  const [bpm, setBpm] = useState(90);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(-1);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(
      () => setBeat((b) => (b + 1) % BEATS),
      60_000 / bpm,
    );
    return () => clearInterval(interval);
  }, [playing, bpm]);

  const accent = beat === 0;

  return (
    <section
      aria-label="Rhythm trainer"
      className="mt-6 rounded-xl border border-border bg-surface p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="microlabel flex items-center gap-1.5">
          <Music4 className="size-3.5" aria-hidden /> Rhythm trainer
        </h2>
        <p className="text-[11px] text-faint">
          One rep per pulse. Own a tempo before raising it.
        </p>
      </div>

      <div className="mt-5 flex items-center justify-center gap-6">
        {/* The pulse */}
        <div className="relative flex size-24 items-center justify-center sm:size-28">
          {playing && beat >= 0 && (
            <motion.span
              key={`${beat}-${bpm}`}
              aria-hidden
              className={cn(
                "absolute inset-0 rounded-full border-2",
                accent ? "border-accent-bright" : "border-accent/50",
              )}
              initial={{ scale: 0.55, opacity: 0.9 }}
              animate={{ scale: 1.15, opacity: 0 }}
              transition={{ duration: Math.min(0.5, 30 / bpm), ease: "easeOut" }}
            />
          )}
          <span
            className={cn(
              "flex size-16 items-center justify-center rounded-full border transition-colors sm:size-20",
              playing && accent
                ? "border-accent bg-accent-dim"
                : "border-border bg-surface-2",
            )}
          >
            <span className="tnum text-xl font-bold sm:text-2xl">{bpm}</span>
          </span>
        </div>

        {/* Beat dots */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2" aria-hidden>
            {Array.from({ length: BEATS }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "size-2.5 rounded-full transition-colors",
                  playing && beat === i
                    ? i === 0
                      ? "bg-accent-bright"
                      : "bg-accent"
                    : "bg-surface-3",
                )}
              />
            ))}
          </div>
          <p className="microlabel">BPM</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        <button
          type="button"
          aria-label="Slower"
          onClick={() => setBpm((b) => Math.max(MIN_BPM, b - 5))}
          className="flex size-12 items-center justify-center rounded-lg border border-border text-fg transition-colors hover:border-border-strong"
        >
          <Minus className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying((p) => !p);
            setBeat(-1);
          }}
          className={cn(
            "flex min-h-[48px] min-w-[8rem] items-center justify-center gap-2 rounded-lg border text-xs font-semibold uppercase tracking-[0.15em] transition-colors",
            playing
              ? "border-border bg-surface-2 text-fg"
              : "border-accent/50 bg-accent-dim text-accent-bright hover:border-accent",
          )}
        >
          {playing ? (
            <>
              <Pause className="size-4" aria-hidden /> Stop
            </>
          ) : (
            <>
              <Play className="size-4" aria-hidden /> Start
            </>
          )}
        </button>
        <button
          type="button"
          aria-label="Faster"
          onClick={() => setBpm((b) => Math.min(MAX_BPM, b + 5))}
          className="flex size-12 items-center justify-center rounded-lg border border-border text-fg transition-colors hover:border-border-strong"
        >
          <Plus className="size-5" aria-hidden />
        </button>
      </div>
    </section>
  );
}
