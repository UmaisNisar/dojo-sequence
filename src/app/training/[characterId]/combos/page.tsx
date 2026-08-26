import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { characters, getCharacter } from "@/data/characters";
import { getCombos } from "@/data/combos";
import { ComboListView } from "@/components/views/ComboListView";

export function generateStaticParams() {
  return characters
    .filter((c) => getCombos(c.id))
    .map((c) => ({ characterId: c.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/training/[characterId]/combos">): Promise<Metadata> {
  const { characterId } = await params;
  const character = getCharacter(characterId);
  return {
    title: character ? `${character.name} — Combos` : "Combos",
    description: character
      ? `${character.name} combo routes with damage and wall carry, grouped by launcher.`
      : "Combo reference.",
  };
}

export default async function CombosPage({
  params,
}: PageProps<"/training/[characterId]/combos">) {
  const { characterId } = await params;
  const character = getCharacter(characterId);
  if (!character || !getCombos(character.id)) notFound();
  return <ComboListView character={character} />;
}
