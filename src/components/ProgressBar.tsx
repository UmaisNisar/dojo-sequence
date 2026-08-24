"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Health-bar meter. `fraction` is 0..1.
 *
 * A solid fill with dark notches drawn over it and a bright leading edge —
 * deliberately NOT a gapped gradient, which reads as a dotted line rather
 * than a bar once the height drops below ~10px.
 */
export function ProgressBar({
  fraction,
  className,
  height = 10,
  label,
  segment = 12,
}: {
  fraction: number;
  className?: string;
  height?: number;
  label?: string;
  /** Notch pitch in px. */
  segment?: number;
}) {
  const clamped = Math.min(1, Math.max(0, fraction));
  const full = clamped >= 1;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
      className={cn(
        "meter-skew relative w-full overflow-hidden bg-surface-3",
        className,
      )}
      style={{ height }}
    >
      {/* Empty track keeps a faint texture so the gauge reads as segmented
          even when barely filled. */}
      <span
        aria-hidden
        className="meter-notch absolute inset-0 opacity-40"
        style={{ ["--seg" as string]: `${segment}px` }}
      />

      <motion.div
        className={cn(
          "relative h-full",
          full ? "bg-accent-bright" : "bg-accent",
        )}
        initial={false}
        animate={{ width: `${clamped * 100}%` }}
        transition={{ type: "spring", stiffness: 170, damping: 26 }}
      >
        <span
          aria-hidden
          className="meter-notch absolute inset-0"
          style={{ ["--seg" as string]: `${segment}px` }}
        />
        {/* Bright leading edge — where the bar is "at". */}
        {clamped > 0 && !full && (
          <span
            aria-hidden
            className="absolute inset-y-0 right-0 w-[2px] bg-accent-bright"
          />
        )}
      </motion.div>
    </div>
  );
}
