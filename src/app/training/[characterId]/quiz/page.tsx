import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { characters, getCharacter } from "@/data/characters";
import { QuizView } from "@/components/views/QuizView";

export function generateStaticParams() {
  return characters
    .filter((c) => c.punishQuiz && c.punishQuiz.length > 0)
    .map((c) => ({ characterId: c.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/training/[characterId]/quiz">): Promise<Metadata> {
  const { characterId } = await params;
  const character = getCharacter(characterId);
  return {
    title: character ? `${character.name} — Punish Reaction Quiz` : "Quiz",
    description: "Flash-card punishment recognition under a timer.",
  };
}

export default async function QuizPage({
  params,
}: PageProps<"/training/[characterId]/quiz">) {
  const { characterId } = await params;
  const character = getCharacter(characterId);
  if (!character || !character.punishQuiz?.length) notFound();
  return <QuizView character={character} />;
}
