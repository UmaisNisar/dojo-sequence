import type { Metadata } from "next";
import { FeedbackView } from "@/components/views/FeedbackView";

export const metadata: Metadata = {
  title: "Report",
  description:
    "Report a bug, suggest an improvement, or flag frame data that does not match the game.",
};

export default function FeedbackPage() {
  return <FeedbackView />;
}
