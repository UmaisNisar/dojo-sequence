import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { characters, getCharacter } from "@/data/characters";
import { StageView } from "@/components/views/StageView";

export function generateStaticParams() {
  return characters.flatMap((c) =>
    c.stages.map((s) => ({
      characterId: c.id,
      stageNumber: String(s.number),
    })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/training/[characterId]/stage/[stageNumber]">): Promise<Metadata> {
  const { characterId, stageNumber } = await params;
  const character = getCharacter(characterId);
  const stage = character?.stages.find((s) => String(s.number) === stageNumber);
  return {
    title: stage ? `Stage ${stage.number} — ${stage.name}` : "Stage",
    description: stage?.description,
  };
}

export default async function StagePage({
  params,
}: PageProps<"/training/[characterId]/stage/[stageNumber]">) {
  const { characterId, stageNumber } = await params;
  const character = getCharacter(characterId);
  if (!character) notFound();
  const stage = character.stages.find((s) => String(s.number) === stageNumber);
  if (!stage) notFound();
  return <StageView character={character} stage={stage} />;
}
