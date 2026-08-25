/**
 * Registers the resolver in scripts/ts-resolver.mjs.
 * Used as `node --import ./scripts/register-ts.mjs ...` — see `npm test`.
 */
import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./ts-resolver.mjs", pathToFileURL(import.meta.filename));
