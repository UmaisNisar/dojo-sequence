import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { characters, getCharacter } from "@/data/characters";
import { ItemDetailView } from "@/components/views/ItemDetailView";

export function generateStaticParams() {
  return characters.flatMap((c) =>
    c.stages.flatMap((s) =>
      s.items.map((item) => ({
        characterId: c.id,
        stageNumber: String(s.number),
        itemId: item.id,
      })),
    ),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/training/[characterId]/stage/[stageNumber]/item/[itemId]">): Promise<Metadata> {
  const { characterId, stageNumber, itemId } = await params;
  const character = getCharacter(characterId);
  const stage = character?.stages.find((s) => String(s.number) === stageNumber);
  const item = stage?.items.find((i) => i.id === itemId);
  return {
    title: item ? item.name : "Training item",
    description: item?.purpose,
  };
}

export default async function ItemPage({
  params,
}: PageProps<"/training/[characterId]/stage/[stageNumber]/item/[itemId]">) {
  const { characterId, stageNumber, itemId } = await params;
  const character = getCharacter(characterId);
  if (!character) notFound();
  const stage = character.stages.find((s) => String(s.number) === stageNumber);
  if (!stage) notFound();
  const item = stage.items.find((i) => i.id === itemId);
  if (!item) notFound();
  return <ItemDetailView character={character} stage={stage} item={item} />;
}
