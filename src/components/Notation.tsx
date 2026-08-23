import { cn } from "@/lib/utils";

/**
 * Move notation, always monospace with a distinct treatment.
 * Sizes: sm (rows/metadata), md (cards), lg (item detail hero).
 */
export function Notation({
  value,
  size = "md",
  className,
}: {
  value: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  if (!value || value === "—") {
    return (
      <span className={cn("font-mono text-faint", sizeClasses[size], className)}>
        —
      </span>
    );
  }
  return (
    <code
      className={cn(
        "inline-block rounded-[4px] border border-border bg-surface-2 font-mono font-medium tracking-tight text-accent-bright",
        sizeClasses[size],
        className,
      )}
    >
      {value}
    </code>
  );
}

const sizeClasses = {
  sm: "px-1.5 py-0.5 text-[11px]",
  md: "px-2 py-1 text-[13px]",
  lg: "px-3 py-1.5 text-base sm:text-lg",
};
