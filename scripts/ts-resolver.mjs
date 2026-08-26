/**
 * Module resolution for running the app's TypeScript under plain Node.
 *
 * Node 24 strips types on its own, but it will not guess extensions, resolve
 * the `@/` alias, or import JSON without an attribute — all three of which the
 * bundler does and the app relies on. Rather than add a test runner and its
 * config, this teaches Node the rules it is missing, in about thirty lines and
 * no dependency:
 *
 *   "./store"        -> ./store.ts
 *   "@/types"        -> <repo>/src/types.ts (or /index.ts)
 *   "./frames.json"  -> the same, with { type: "json" } supplied
 *
 * Used by `npm test`. Nothing in the app or the build depends on it.
 */

import { existsSync, statSync } from "node:fs";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = resolvePath(dirname(fileURLToPath(import.meta.url)), "..", "src");
const CANDIDATES = [".ts", ".tsx", "/index.ts", "/index.tsx", ".js", ".mjs"];

const isFile = (path) => {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
};

function firstExisting(base) {
  // A real file (or a JSON asset) — take it as written. A DIRECTORY must not
  // qualify: "@/data/characters" is a folder, and returning it hands Node a
  // directory import instead of its index.
  if (isFile(base) && !existsSync(base + ".ts")) return base;
  for (const ext of CANDIDATES) {
    const candidate = base + ext;
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * The frame, punisher and combo tables are imported as plain JSON, which the
 * bundler allows and Node requires an attribute for. Supplying it here keeps
 * the app's imports free of a `with { type: "json" }` that exists only to
 * satisfy the test runner.
 */
async function resolveTo(path, context, nextResolve) {
  const url = pathToFileURL(path).href;
  if (!path.endsWith(".json")) return nextResolve(url, context);
  // The attribute has to be on the RESULT — Node validates what the resolver
  // returns, not what was passed down to it.
  return {
    url,
    format: "json",
    importAttributes: { type: "json" },
    shortCircuit: true,
  };
}

export async function resolve(specifier, context, nextResolve) {
  // "@/x" is the app's alias for "<repo>/src/x".
  if (specifier.startsWith("@/")) {
    const hit = firstExisting(resolvePath(SRC, specifier.slice(2)));
    if (hit) return resolveTo(hit, context, nextResolve);
  }

  // Extensionless relative specifiers, which the bundler resolves for us.
  if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
    const base = resolvePath(dirname(fileURLToPath(context.parentURL)), specifier);
    const hit = firstExisting(base);
    if (hit) return resolveTo(hit, context, nextResolve);
  }

  return nextResolve(specifier, context);
}
