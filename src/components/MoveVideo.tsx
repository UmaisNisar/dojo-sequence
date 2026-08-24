"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Silent looping demo of a single move, hotlinked from Wavu Wiki.
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
            className="size-full object-cover"
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
