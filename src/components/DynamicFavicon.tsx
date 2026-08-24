"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCharacter } from "@/data/characters";
import { useActiveCharacter } from "@/hooks/use-progress";

const FALLBACK = "#8b5cf6";

/** Same bolt mark as /icon.svg, tinted to the fighter. */
function svgFor(colour: string): string {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">',
    '<rect width="64" height="64" rx="14" fill="#070709"/>',
    `<rect width="64" height="64" rx="14" fill="none" stroke="${colour}" stroke-width="2" opacity="0.35"/>`,
    `<path d="M36 8 L18 36 H30 L26 56 L46 26 H33 Z" fill="${colour}"/>`,
    "</svg>",
  ].join("");
}

/**
 * Repaints the tab icon in the current fighter's colour.
 *
 * The favicon is per-document and the fighter is client state, so this swaps
 * the <link rel="icon"> href at runtime rather than shipping seven static
 * icons. Falls back to the bundled /icon.svg colour when a character has no
 * accent defined.
 */
export function DynamicFavicon() {
  const pathname = usePathname();
  const active = useActiveCharacter();
  const fromRoute = pathname.match(/^\/training\/([a-z0-9-]+)/)?.[1];
  const character = (fromRoute ? getCharacter(fromRoute) : undefined) ?? active;
  const colour = character.accent?.base ?? FALLBACK;

  useEffect(() => {
    const href = `data:image/svg+xml,${encodeURIComponent(svgFor(colour))}`;

    /* app/icon.svg was removed precisely so this is the only icon link:
       Next re-appended its static one after ours on every navigation, and the
       last link wins. Any stray is still swept, defensively. */
    document
      .querySelectorAll<HTMLLinkElement>(
        'link[rel~="icon"]:not([data-dynamic-favicon="true"])',
      )
      .forEach((el) => el.remove());

    let link = document.querySelector<HTMLLinkElement>(
      'link[data-dynamic-favicon="true"]',
    );
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      link.dataset.dynamicFavicon = "true";
    }
    link.href = href;
    // Always last in <head> so it wins if anything re-appears.
    document.head.appendChild(link);
  }, [colour, pathname]);

  return null;
}
