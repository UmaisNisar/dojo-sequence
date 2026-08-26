import type { Metadata } from "next";
import { MatchupIndexView } from "@/components/views/MatchupIndexView";

export const metadata: Metadata = {
  title: "Matchups",
  description:
    "What the opponent is doing to you — fast lows, plus frames, and what you get for blocking.",
};

export default function MatchupsPage() {
  return <MatchupIndexView />;
}
