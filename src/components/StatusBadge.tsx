import { Check, Lock } from "lucide-react";
import type { ItemStatus } from "@/types";
import { cn } from "@/lib/utils";

type BadgeState = ItemStatus | "locked";

const config: Record<
  BadgeState,
  { label: string; className: string }
> = {
  "not-started": {
    label: "Not started",
    className: "border-border text-faint",
  },
  drilling: {
    label: "Drilling",
    className: "border-accent-deep/60 text-accent-bright bg-accent-dim",
  },
  learned: {
    label: "Learned",
    className: "border-accent/50 text-accent-bright bg-accent-dim",
  },
  locked: {
    label: "Locked",
    className: "border-border text-faint",
  },
};

export function StatusBadge({
  state,
  className,
}: {
  state: BadgeState;
  className?: string;
}) {
  const c = config[state];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
        c.className,
        className,
      )}
    >
      {state === "learned" && <Check className="size-3" aria-hidden />}
      {state === "locked" && <Lock className="size-3" aria-hidden />}
      {c.label}
    </span>
  );
}
