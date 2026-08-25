/**
 * Module resolution for running the app's TypeScript under plain Node.
 *
 * Node 24 strips types on its own, but it will not guess extensions or
 * understand the `@/` alias — both of which the bundler handles and the app
 * relies on. Rather than add a test runner and its config, this teaches Node
 * the two rules it is missing, in about twenty lines and no dependency:
 *
 *   "./store"   -> ./store.ts
 *   "@/types"   -> <repo>/src/types.ts (or /index.ts)
 *
 * Used by `npm test`. Nothing in the app or the build depends on it.
 */

import { existsSync } from "node:fs";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = resolvePath(dirname(fileURLToPath(import.meta.url)), "..", "src");
const CANDIDATES = [".ts", ".tsx", "/index.ts", "/index.tsx", ".js", ".mjs"];

function firstExisting(base) {
  if (existsSync(base) && !existsSync(base + ".ts")) {
    // A real file (or a JSON asset) — take it as written.
    if (!base.endsWith("/")) return base;
  }
  for (const ext of CANDIDATES) {
    const candidate = base + ext;
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  // "@/x" is the app's alias for "<repo>/src/x".
  if (specifier.startsWith("@/")) {
    const hit = firstExisting(resolvePath(SRC, specifier.slice(2)));
    if (hit) return nextResolve(pathToFileURL(hit).href, context);
  }

  // Extensionless relative specifiers, which the bundler resolves for us.
  if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
    const base = resolvePath(dirname(fileURLToPath(context.parentURL)), specifier);
    const hit = firstExisting(base);
    if (hit) return nextResolve(pathToFileURL(hit).href, context);
  }

  return nextResolve(specifier, context);
}
