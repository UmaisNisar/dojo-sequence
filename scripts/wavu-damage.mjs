/**
 * Reading Wavu's `damage` column.
 *
 * Shared by the verifier and the sync script deliberately: the number the app
 * shows and the number the check compares against must come from the same
 * code, or the check is only testing that two bugs agree.
 *
 * The column is written several ways, and they do not mean the same thing:
 *
 *   "5,8,12"           per-hit damage for a string — these SUM to the total
 *   "45(50)"           base damage, with the perfect-input (bluespark) value
 *                      in brackets — an ALTERNATIVE, not an addition
 *   "23/27/34"         variants, e.g. Jaguar Step at three charge levels —
 *                      the first is the plain move
 *   "45(50)/70,5"      both at once
 *   "10-15,3-5,42-60"  a hit whose damage scales, as a RANGE per hit — Rage
 *                      Arts do more the lower your health
 *   "[12;12]"          damage; RECOVERABLE damage, the same bracket notation
 *                      the combo pages use — 12 damage, all of it grey health,
 *                      not 24
 *
 * Summing every digit — which is what this did first — turned King's Giant
 * Swing, a 45-damage throw, into 170, and Devil Jin's Rage Art into 135.
 *
 * Ranges take their LOW end, the same way startup ranges do: the figure that
 * is always true rather than the one that flatters the move.
 */
export function damageOf(value) {
  if (!value) return 0;
  const plain = String(value)
    .replace(/\([^)]*\)/g, "") // bracketed alternates
    .replace(/\[(\d+)[^\]]*\]/g, "$1") // "[12;12]" is damage; recoverable
    .split("/")[0]; // the plain variant
  // Commas separate hits, which add up; anything else inside a hit is a range.
  return plain.split(",").reduce((sum, hit) => {
    const first = /\d+/.exec(hit);
    return sum + (first ? Number(first[0]) : 0);
  }, 0);
}

/**
 * What the whole move does, walking Wavu's parent chain — a string row carries
 * only its own hit's damage, so "2,1" has to add the "2" that precedes it.
 *
 * `byId` maps a Wavu move id to a row with `damage` and `parent`.
 */
export function damageTotal(byId, wavuId) {
  let total = 0;
  let current = byId.get(wavuId);
  const seen = new Set();
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    total += damageOf(current.damage);
    current = current.parent ? byId.get(current.parent) : null;
  }
  return total > 0 ? total : null;
}
