"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** Animated horizontal progress bar. `fraction` is 0..1. */
export function ProgressBar({
  fraction,
  className,
  height = 4,
  label,
}: {
  fraction: number;
  className?: string;
  height?: number;
  label?: string;
}) {
  const clamped = Math.min(1, Math.max(0, fraction));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
      className={cn("w-full overflow-hidden rounded-full bg-surface-3", className)}
      style={{ height }}
    >
      <motion.div
        className={cn(
          "h-full rounded-full",
          clamped >= 1 ? "bg-accent-bright" : "bg-accent",
        )}
        initial={false}
        animate={{ width: `${clamped * 100}%` }}
        transition={{ type: "spring", stiffness: 160, damping: 26 }}
      />
    </div>
  );
}
