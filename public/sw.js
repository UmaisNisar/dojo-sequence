/**
 * Dojo Sequence service worker.
 *
 * The app already installs to a home screen — `app/manifest.ts` declares
 * standalone display and the icons — but a cold launch with no network showed
 * the browser's error page. This is the piece that makes it work at a locals
 * with bad wifi, which is exactly where a phone-next-to-controller app gets
 * used.
 *
 * Two strategies, chosen by what the request is:
 *
 *   /_next/static/**  cache-first. Filenames are content-hashed, so a cached
 *                     one is never stale — a new build asks for new names.
 *   everything else   network-first, falling back to the cache.
 *
 * That asymmetry is deliberate. Serving an HTML document cache-first is how
 * you end up handing someone last week's shell, which then requests chunk
 * hashes that no longer exist and leaves the app broken in a way a reload
 * does not fix. The network wins whenever it is there; the cache only
 * answers when it is not.
 *
 * Move clips stream from wavu.wiki and are deliberately NOT cached: they are
 * cross-origin and opaque, so the browser would charge us their full padded
 * size against the origin's quota without ever letting us read them. The
 * frame data, notes, punishers and combos those clips illustrate are all in
 * the JS bundle, so everything except the video works offline.
 */

const VERSION = "v1";
const SHELL_CACHE = `dojo-shell-${VERSION}`;
const PAGE_CACHE = `dojo-pages-${VERSION}`;

/** Enough to boot the app offline from a cold start. */
const SHELL = ["/", "/training", "/characters", "/settings", "/matchups"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      // One bad URL must not fail the whole install, so they are added singly.
      .then((cache) =>
        Promise.all(SHELL.map((url) => cache.add(url).catch(() => undefined))),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== SHELL_CACHE && key !== PAGE_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

const isStaticAsset = (url) =>
  url.pathname.startsWith("/_next/static/") ||
  url.pathname.startsWith("/icon-") ||
  url.pathname === "/favicon.ico" ||
  url.pathname === "/apple-touch-icon.png";

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(SHELL_CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(PAGE_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    // A navigation with nothing cached still deserves the app rather than the
    // browser's error page — every route renders from data in the bundle.
    if (request.mode === "navigate") {
      const shell = await caches.match("/training");
      if (shell) return shell;
    }
    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Cross-origin: the wiki's clips and its Cargo API. Both must stay live —
  // a cached frame-data check would defeat the point of checking.
  if (url.origin !== self.location.origin) return;
  // Never hand back a cached copy of the worker itself.
  if (url.pathname === "/sw.js") return;

  event.respondWith(
    isStaticAsset(url) ? cacheFirst(request) : networkFirst(request),
  );
});
