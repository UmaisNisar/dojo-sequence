import type { Metadata } from "next";
import { TodayView } from "@/components/views/TodayView";

export const metadata: Metadata = {
  title: "Today",
  description: "What you should practice right now.",
};

export default function TodayPage() {
  return <TodayView />;
}
