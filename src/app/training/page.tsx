import type { Metadata } from "next";
import { TrainingRedirect } from "@/components/views/TrainingRedirect";

export const metadata: Metadata = {
  title: "Training",
  description: "Your active character's curriculum.",
};

/**
 * "Training" goes straight to the curriculum of whichever fighter you
 * selected — the roster lives under /characters.
 */
export default function TrainingPage() {
  return <TrainingRedirect />;
}
