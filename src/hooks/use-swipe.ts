"use client";

import { useEffect } from "react";

/**
 * Horizontal swipe navigation for touch devices.
 *
 * Deliberately hard to trigger by accident. A swipe only counts when it is
 * decisively sideways (twice as much horizontal travel as vertical), long
 * enough to be intentional, and quick enough not to be a slow drag while
 * reading. Anything that starts inside a horizontally scrollable element —
 * the frame table, a code block — is ignored outright, because there the
 * gesture already means something else.
 */
const MIN_DISTANCE = 64;
const MAX_DURATION = 700;
const DOMINANCE = 2;

function startedInScrollableX(target: EventTarget | null): boolean {
  let el = target instanceof Element ? target : null;
  while (el) {
    const style = getComputedStyle(el);
    const scrolls = /(auto|scroll)/.test(style.overflowX);
    if (scrolls && el.scrollWidth > el.clientWidth + 1) return true;
    el = el.parentElement;
  }
  return false;
}

export function useSwipe({
  onLeft,
  onRight,
  enabled = true,
}: {
  /** Swipe right-to-left — conventionally "forward". */
  onLeft?: () => void;
  /** Swipe left-to-right — conventionally "back". */
  onRight?: () => void;
  enabled?: boolean;
}): void {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    // Pointer-coarse only: a trackpad two-finger swipe is a browser gesture.
    if (!window.matchMedia("(hover: none)").matches) return;

    let startX = 0;
    let startY = 0;
    let startAt = 0;
    let ignore = false;

    const onStart = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      if (!t) return;
      ignore = startedInScrollableX(e.target);
      startX = t.clientX;
      startY = t.clientY;
      startAt = Date.now();
    };

    const onEnd = (e: TouchEvent) => {
      if (ignore) return;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Date.now() - startAt > MAX_DURATION) return;
      if (Math.abs(dx) < MIN_DISTANCE) return;
      if (Math.abs(dx) < Math.abs(dy) * DOMINANCE) return;
      if (dx < 0) onLeft?.();
      else onRight?.();
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [onLeft, onRight, enabled]);
}
