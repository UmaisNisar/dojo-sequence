import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { characters, getCharacter } from "@/data/characters";
import { CharacterView } from "@/components/views/CharacterView";

export function generateStaticParams() {
  return characters.map((c) => ({ characterId: c.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/training/[characterId]">): Promise<Metadata> {
  const { characterId } = await params;
  const character = getCharacter(characterId);
  return {
    title: character ? `${character.name} — Training` : "Training",
    description: character
      ? `The full ${character.name} curriculum, stage by stage.`
      : undefined,
  };
}

export default async function CharacterPage({
  params,
}: PageProps<"/training/[characterId]">) {
  const { characterId } = await params;
  const character = getCharacter(characterId);
  if (!character) notFound();
  return <CharacterView character={character} />;
}
