"use client";

import { useEffect, useRef, useState } from "react";
import { useMirrorClips } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

/**
 * Silent looping demo of a single move, hotlinked from Wavu Wiki.
 *
 * Wavu records every clip from the P2 side — the character on the right,
 * facing left — and hosts no P1 variant (3,000+ T8-p2-* files, zero T8-p1-*).
 * Most players sit on P1, so a demo facing the wrong way has to be mentally
 * flipped before it is useful. Mirroring it costs one CSS transform and no
 * extra bandwidth. It does reverse the burned-in overlay text, but at the
 * 200px this renders at that text is illegible either way, while the facing
 * direction is the whole point of the clip.
 *
 * Loads nothing until it scrolls near the viewport — an item can reference
 * half a dozen moves and each clip is ~220 KB. If the clip 404s (renamed or
 * removed upstream) the whole block removes itself, so the row degrades to
 * frame data alone rather than showing a broken player. `npm run verify:videos`
 * is what stops that happening quietly.
 */
export function MoveVideo({
  src,
  label,
  className,
}: {
  src: string;
  label: string;
  className?: string;
}) {
  const mirror = useMirrorClips();
  const holderRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // No observer to lazy-load with: fall back to loading straight away,
      // deferred a tick so this is not a synchronous setState in an effect.
      const t = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (failed) return null;

  return (
    <div
      ref={holderRef}
      className={className}
      style={{ aspectRatio: "16 / 9" }}
    >
      <div className="relative size-full overflow-hidden clip-row border border-border bg-surface-2">
        {visible && (
          <video
            src={src}
            aria-label={`${label} — move demo`}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            onCanPlay={() => setReady(true)}
            onError={() => setFailed(true)}
            className={cn("size-full object-cover", mirror && "-scale-x-100")}
          />
        )}
        {!ready && (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold uppercase tracking-[0.15em] text-faint"
          >
            {visible ? "Loading…" : ""}
          </span>
        )}
      </div>
    </div>
  );
}
