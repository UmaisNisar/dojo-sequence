import type { Metadata } from "next";
import { CharactersView } from "@/components/views/CharactersView";

export const metadata: Metadata = {
  title: "Characters",
  description: "Choose a character curriculum.",
};

export default function CharactersPage() {
  return <CharactersView />;
}
