import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Archivo } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/hooks/use-progress";
import { LiveFramesProvider } from "@/hooks/use-live-frames";
import { AppShell } from "@/components/AppShell";
import { LightningStrikes } from "@/components/effects/LightningStrikes";
import { AccentScope } from "@/components/AccentScope";
import { DynamicFavicon } from "@/components/DynamicFavicon";
import { ServiceWorker } from "@/components/ServiceWorker";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
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
  appleWebApp: {
    capable: true,
    title: "Dojo Sequence",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#070709",
  // Let the app paint under the notch and home indicator once installed.
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[420px]" />
        <ProgressProvider>
          <LiveFramesProvider>
            <AccentScope>
              <DynamicFavicon />
              <LightningStrikes />
              <AppShell>{children}</AppShell>
            </AccentScope>
          </LiveFramesProvider>
        </ProgressProvider>
        {/* Aggregate traffic only — cookieless, no identifiers, and the
            dashboard sits behind the Vercel account. Production only: in dev
            the package loads its debug script from va.vercel-scripts.com,
            which the CSP blocks, and local browsing would otherwise pollute
            the real numbers. */}
        {process.env.NODE_ENV === "production" && <Analytics />}
        <ServiceWorker />
      </body>
    </html>
  );
}
