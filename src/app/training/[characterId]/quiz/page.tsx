import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { characters, getCharacter } from "@/data/characters";
import { getFrameData } from "@/data/frames";
import { QuizHub } from "@/components/views/QuizHub";

/**
 * Every character with a frame table gets a quiz now, not only the ones with a
 * hand-written punish set — the knowledge questions are generated from the
 * table itself.
 */
export function generateStaticParams() {
  return characters
    .filter((c) => getFrameData(c.id) || c.punishQuiz?.length)
    .map((c) => ({ characterId: c.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/training/[characterId]/quiz">): Promise<Metadata> {
  const { characterId } = await params;
  const character = getCharacter(characterId);
  return {
    title: character ? `${character.name} — Quiz` : "Quiz",
    description:
      "Test what you have trained, with every answer taken from verified frame data.",
  };
}

export default async function QuizPage({
  params,
}: PageProps<"/training/[characterId]/quiz">) {
  const { characterId } = await params;
  const character = getCharacter(characterId);
  if (!character) notFound();
  if (!getFrameData(character.id) && !character.punishQuiz?.length) notFound();
  return <QuizHub character={character} />;
}
