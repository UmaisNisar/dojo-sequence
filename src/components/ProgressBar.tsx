"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Segmented meter — a health bar, not a progress bar. `fraction` is 0..1.
 * Notched rather than smooth, so it reads as a fighting-game gauge.
 */
export function ProgressBar({
  fraction,
  className,
  height = 6,
  label,
  segment = 9,
}: {
  fraction: number;
  className?: string;
  height?: number;
  label?: string;
  /** Notch pitch in px. */
  segment?: number;
}) {
  const clamped = Math.min(1, Math.max(0, fraction));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
      className={cn(
        "w-full overflow-hidden border border-border-strong bg-surface",
        className,
      )}
      style={{ height }}
    >
      <motion.div
        className={cn(
          "meter-seg h-full",
          clamped >= 1 ? "text-accent-bright" : "text-accent",
        )}
        style={{ ["--seg" as string]: `${segment}px` }}
        initial={false}
        animate={{ width: `${clamped * 100}%` }}
        transition={{ type: "spring", stiffness: 160, damping: 26 }}
      />
    </div>
  );
}
