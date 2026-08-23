import type { Metadata } from "next";
import { CharactersView } from "@/components/views/CharactersView";

export const metadata: Metadata = {
  title: "Training",
  description: "Pick a character to train.",
};

export default function TrainingPage() {
  return <CharactersView />;
}
