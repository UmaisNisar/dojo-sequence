"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MotionConfig } from "motion/react";
import { Zap, Swords, Users, Settings, MessageSquare, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActiveCharacter, useReducedMotionSetting } from "@/hooks/use-progress";

const isQuiz = (pathname: string) => pathname.endsWith("/quiz");

/**
 * Nav is built per render because Quiz is character-scoped: it points straight
 * at the active fighter's quiz rather than at a /quiz stub that would bounce
 * through a redirect, the same reasoning as the wordmark below.
 *
 * Each item carries its own active test. Prefix matching alone would light up
 * Training on the quiz route, since /training/king/quiz sits underneath it.
 */
function buildNav(quizHref: string) {
  return [
    {
      href: "/training",
      label: "Training",
      icon: Swords,
      active: (p: string) => p.startsWith("/training") && !isQuiz(p),
    },
    { href: quizHref, label: "Quiz", icon: Brain, active: isQuiz },
    {
      href: "/characters",
      label: "Characters",
      icon: Users,
      active: (p: string) => p === "/characters",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: (p: string) => p === "/settings",
    },
    {
      href: "/feedback",
      label: "Report",
      icon: MessageSquare,
      active: (p: string) => p === "/feedback",
    },
  ];
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotionSetting();
  const activeCharacter = useActiveCharacter();

  /* Point the wordmark straight at the curriculum rather than at /training,
     which would bounce through a redirect. When you are already there it is
     not a link at all — clicking it used to re-navigate and read as a
     pointless page refresh. */
  const home = `/training/${activeCharacter.id}`;
  const atHome = pathname === home;
  const navItems = useMemo(
    () => buildNav(`/training/${activeCharacter.id}/quiz`),
    [activeCharacter.id],
  );

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
          {(() => {
            const mark = (
              <>
                <span className="flex size-6 items-center justify-center clip-slant bg-accent text-bg">
                  <Zap className="size-3.5" strokeWidth={2.5} aria-hidden />
                </span>
                <span className="text-sm uppercase tracking-[0.18em]">
                  Dojo <span className="text-accent-bright">Sequence</span>
                </span>
              </>
            );
            return atHome ? (
              <span
                aria-label="Dojo Sequence"
                className="flex items-center gap-2 font-semibold tracking-tight"
              >
                {mark}
              </span>
            ) : (
              <Link
                href={home}
                aria-label="Dojo Sequence — back to training"
                className="flex items-center gap-2 font-semibold tracking-tight"
              >
                {mark}
              </Link>
            );
          })()}
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navItems.map(({ href, label, active: match }) => {
                const active = match(pathname);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "clip-row px-3 py-1.5 text-[13px] font-medium transition-colors",
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
          {navItems.map(({ href, label, icon: Icon, active: match }) => {
            const active = match(pathname);
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
