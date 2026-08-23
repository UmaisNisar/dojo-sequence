import type { Metadata } from "next";
import { CharacterSelectView } from "@/components/views/CharacterSelectView";

export const metadata: Metadata = {
  title: "Dojo Sequence — Tekken 8 Training",
  description:
    "Choose your fighter. A structured training curriculum for learning Tekken 8 characters.",
};

export default function Home() {
  return <CharacterSelectView />;
}
