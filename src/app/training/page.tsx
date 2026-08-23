import { redirect } from "next/navigation";
import { defaultCharacterId } from "@/data/characters";

/**
 * "Training" goes straight to your active curriculum — the roster lives
 * under /characters.
 */
export default function TrainingPage() {
  redirect(`/training/${defaultCharacterId}`);
}
