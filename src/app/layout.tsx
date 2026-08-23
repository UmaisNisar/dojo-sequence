import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/hooks/use-progress";
import { LiveFramesProvider } from "@/hooks/use-live-frames";
import { AppShell } from "@/components/AppShell";
import { LightningStrikes } from "@/components/effects/LightningStrikes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dojo Sequence — Tekken 8 Training",
    template: "%s · Dojo Sequence",
  },
  description:
    "A structured training curriculum for learning Tekken 8 characters. Learn, drill, pass, unlock — one skill at a time.",
  openGraph: {
    title: "Dojo Sequence — Tekken 8 Training",
    description:
      "A structured training curriculum for learning Tekken 8 characters. Learn, drill, pass, unlock — one skill at a time.",
    type: "website",
    siteName: "Dojo Sequence",
  },
};

export const viewport: Viewport = {
  themeColor: "#070709",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[420px]" />
        <ProgressProvider>
          <LiveFramesProvider>
            <LightningStrikes />
            <AppShell>{children}</AppShell>
          </LiveFramesProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
