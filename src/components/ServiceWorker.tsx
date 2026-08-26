"use client";

import { useEffect } from "react";

/**
 * Registers the offline worker.
 *
 * Deliberately after `load`: registration competes with the first render for
 * bandwidth, and precaching five routes on a phone that is still painting is
 * the wrong trade. Nothing on screen depends on it.
 *
 * Localhost is excluded because a worker there caches across every `next dev`
 * and `next start` on port 3000, which has cost this project a whole debugging
 * session before — a stale shell asking for chunk hashes a rebuild had already
 * replaced.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    if (
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1"
    ) {
      return;
    }

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Offline support is an enhancement; a failure here changes nothing
        // the user can see, so there is nothing worth reporting.
      });
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });

    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
