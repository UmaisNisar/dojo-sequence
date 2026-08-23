import { redirect } from "next/navigation";

/** Progress merged into the curriculum page — keep old links working. */
export default function ProgressPage() {
  redirect("/training");
}
