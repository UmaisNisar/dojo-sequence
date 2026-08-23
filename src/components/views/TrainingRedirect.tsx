"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActiveCharacter, useProgress } from "@/hooks/use-progress";

/**
 * Sends /training to the active fighter's curriculum. Waits for hydration
 * so a stored selection isn't overwritten by the default on first paint.
 */
export function TrainingRedirect() {
  const { state } = useProgress();
  const character = useActiveCharacter();
  const router = useRouter();

  useEffect(() => {
    if (!state.hydrated) return;
    router.replace(`/training/${character.id}`);
  }, [state.hydrated, character.id, router]);

  return (
    <p className="py-20 text-center text-sm text-muted" role="status">
      Opening your curriculum…
    </p>
  );
}
