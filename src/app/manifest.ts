import type { MetadataRoute } from "next";

/**
 * Web app manifest.
 *
 * The point of installing this one is vertical space: a curriculum read beside
 * a console competes with the browser's address bar for the only screen
 * dimension that matters on a phone. `standalone` gets it back. Everything is
 * already static and stored in localStorage, so an installed copy behaves the
 * same as the tab it came from.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dojo Sequence — Tekken 8 Training",
    short_name: "Dojo Sequence",
    description:
      "A structured training curriculum for learning Tekken 8 characters, with frame data verified against Wavu Wiki.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#070709",
    theme_color: "#070709",
    categories: ["games", "education"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Android crops to its own shape; this one has the safe-zone padding.
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
