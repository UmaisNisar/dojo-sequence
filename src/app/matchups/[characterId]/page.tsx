import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { characters, getCharacter } from "@/data/characters";
import { getFrameData } from "@/data/frames";
import { MatchupView } from "@/components/views/MatchupView";

export function generateStaticParams() {
  return characters
    .filter((c) => getFrameData(c.id))
    .map((c) => ({ characterId: c.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/matchups/[characterId]">): Promise<Metadata> {
  const { characterId } = await params;
  const character = getCharacter(characterId);
  return {
    title: character ? `Fighting ${character.name}` : "Matchup",
    description: character
      ? `${character.name}'s fast lows, plus frames, homing moves and launch-punishable moves.`
      : "Matchup reference.",
  };
}

export default async function MatchupPage({
  params,
}: PageProps<"/matchups/[characterId]">) {
  const { characterId } = await params;
  const character = getCharacter(characterId);
  if (!character || !getFrameData(character.id)) notFound();
  return <MatchupView opponent={character} />;
}
