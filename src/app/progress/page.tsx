import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCharacter, defaultCharacterId } from "@/data/characters";
import { ProgressView } from "@/components/views/ProgressView";

export const metadata: Metadata = {
  title: "Progress",
  description: "Your curriculum progress at a glance.",
};

export default function ProgressPage() {
  const character = getCharacter(defaultCharacterId);
  if (!character) notFound();
  return <ProgressView character={character} />;
}
