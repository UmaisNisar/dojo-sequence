import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { characters, getCharacter } from "@/data/characters";
import { getFrameData } from "@/data/frames";
import { MoveIndexView } from "@/components/views/MoveIndexView";

export function generateStaticParams() {
  return characters
    .filter((c) => getFrameData(c.id))
    .map((c) => ({ characterId: c.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/training/[characterId]/moves">): Promise<Metadata> {
  const { characterId } = await params;
  const character = getCharacter(characterId);
  const set = character ? getFrameData(character.id) : undefined;
  return {
    title: character ? `${character.name} — Movelist` : "Movelist",
    description: set
      ? `${Object.keys(set.moves).length} ${character?.name} moves with frame data verified against ${set.gameVersion}.`
      : "Searchable frame data.",
  };
}

export default async function MovesPage({
  params,
}: PageProps<"/training/[characterId]/moves">) {
  const { characterId } = await params;
  const character = getCharacter(characterId);
  if (!character || !getFrameData(character.id)) notFound();
  return <MoveIndexView character={character} />;
}
