import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { characters, getCharacter } from "@/data/characters";
import { getFrameData } from "@/data/frames";
import { getPunishers } from "@/data/punishers";
import { PunishSheetView } from "@/components/views/PunishSheetView";

export function generateStaticParams() {
  return characters
    .filter((c) => getPunishers(c.id) && getFrameData(c.id))
    .map((c) => ({ characterId: c.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/training/[characterId]/punish">): Promise<Metadata> {
  const { characterId } = await params;
  const character = getCharacter(characterId);
  return {
    title: character ? `${character.name} — Punishers` : "Punishers",
    description: character
      ? `What ${character.name} punishes with, by frames of disadvantage.`
      : "Punish reference.",
  };
}

export default async function PunishPage({
  params,
}: PageProps<"/training/[characterId]/punish">) {
  const { characterId } = await params;
  const character = getCharacter(characterId);
  if (!character || !getPunishers(character.id) || !getFrameData(character.id)) {
    notFound();
  }
  return <PunishSheetView character={character} />;
}
