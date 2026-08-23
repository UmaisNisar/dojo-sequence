import type { Metadata } from "next";
import { getCharacter, defaultCharacterId } from "@/data/characters";
import { TodayView } from "@/components/views/TodayView";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Today",
  description: "What you should practice right now.",
};

export default function TodayPage() {
  const character = getCharacter(defaultCharacterId);
  if (!character) notFound();
  return <TodayView character={character} />;
}
