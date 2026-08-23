import type { Metadata } from "next";
import { SessionView } from "@/components/views/SessionView";

export const metadata: Metadata = {
  title: "Session",
  description: "Focused practice session.",
};

export default function SessionPage() {
  return <SessionView />;
}
