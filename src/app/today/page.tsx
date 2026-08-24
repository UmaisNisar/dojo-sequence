import { redirect } from "next/navigation";

/** Today merged into the curriculum page — keep old links working. */
export default function TodayPage() {
  redirect("/training");
}
