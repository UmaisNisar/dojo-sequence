import type { Metadata } from "next";
import { CharacterSelectView } from "@/components/views/CharacterSelectView";

export const metadata: Metadata = {
  title: "Characters",
  description: "Choose a character curriculum.",
};

/** Same roster as the entry screen — just inside the app chrome. */
export default function CharactersPage() {
  return <CharacterSelectView embedded />;
}
