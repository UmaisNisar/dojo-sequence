"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MotionConfig } from "motion/react";
import { Zap, Swords, Users, Settings, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotionSetting } from "@/hooks/use-progress";

const navItems = [
  { href: "/today", label: "Today", icon: Sun },
  { href: "/training", label: "Training", icon: Swords },
  { href: "/characters", label: "Characters", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotionSetting();

  // Mirror the in-app setting onto <html> so CSS transitions obey it too.
  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
  }, [reducedMotion]);

  // The root route is the character select — a full-screen gate with no chrome.
  if (pathname === "/") {
    return (
      <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>
        {children}
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>
      {/* Desktop / tablet top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            aria-label="Dojo Sequence — character select"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="flex size-6 items-center justify-center rounded-[5px] bg-accent text-bg">
              <Zap className="size-3.5" strokeWidth={2.5} aria-hidden />
            </span>
            <span className="text-sm uppercase tracking-[0.18em]">
              Dojo <span className="text-accent-bright">Sequence</span>
            </span>
          </Link>
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navItems.map(({ href, label }) => {
                const active = isActive(pathname, href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                        active
                          ? "bg-surface-3 text-fg"
                          : "text-muted hover:bg-surface-2 hover:text-fg",
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-6 sm:px-6 md:pb-16">
        {children}
      </main>

      {/* Mobile bottom navigation — large touch targets */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      >
        <ul className="flex items-stretch justify-around">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-[60px] flex-col items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider transition-colors",
                    active ? "text-accent-bright" : "text-muted",
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.4 : 2} aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </MotionConfig>
  );
}
