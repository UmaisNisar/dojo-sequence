"use client";

import { usePathname } from "next/navigation";
import { getCharacter } from "@/data/characters";
import { useActiveCharacter } from "@/hooks/use-progress";

/**
 * Paints the app in the current fighter's signature colour.
 *
 * Every accent token is redefined on a wrapper, so anything using
 * `text-accent`, `bg-accent-dim`, `border-accent` and so on inherits the
 * character without knowing anything about them. The fighter is taken from
 * the URL when we are inside /training/<id>, otherwise from the active
 * selection — so Settings and Session are coloured too.
 */
export function AccentScope({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = useActiveCharacter();
  const fromRoute = pathname.match(/^\/training\/([a-z0-9-]+)/)?.[1];
  const character = (fromRoute ? getCharacter(fromRoute) : undefined) ?? active;
  const accent = character.accent;

  if (!accent) return <>{children}</>;

  return (
    <div
      className="contents"
      style={
        {
          "--accent": accent.base,
          "--accent-bright": accent.bright,
          "--accent-deep": accent.deep,
          "--accent-dim": `${accent.base}24`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
