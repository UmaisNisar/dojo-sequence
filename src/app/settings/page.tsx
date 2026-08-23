import type { Metadata } from "next";
import { SettingsView } from "@/components/views/SettingsView";

export const metadata: Metadata = {
  title: "Settings",
  description: "Export, import, and reset your training progress.",
};

export default function SettingsPage() {
  return <SettingsView />;
}
