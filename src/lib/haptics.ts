/**
 * Short vibrations on the moments that deserve one.
 *
 * Android only, and deliberately so. iOS Safari does not implement the
 * Vibration API; the `<input type="checkbox" switch>` side-effect that stood in
 * for it worked from iOS 17.4 until Apple closed it in 26.5, and building on a
 * patched hack would mean shipping something that breaks on the next update.
 * So this is purely additive: Android users get a bit of feel, iPhone users get
 * exactly what they get today, and nothing in the app depends on it firing.
 */

export type Haptic = "tap" | "correct" | "wrong" | "complete" | "unlock";

/**
 * Patterns are short on purpose. A training app that buzzes for a third of a
 * second every answer stops being pleasant around round three.
 */
const PATTERNS: Record<Haptic, number | number[]> = {
  tap: 8,
  correct: [10, 30, 14],
  wrong: [26, 40, 26],
  complete: [12, 35, 20],
  unlock: [14, 35, 14, 35, 28],
};

/** True when the browser exposes the Vibration API at all. */
export function hapticsSupported(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

/**
 * Fires a pattern when the setting is on and the platform supports it.
 * Never throws: some browsers expose `vibrate` but reject it outside a user
 * gesture, and a failed buzz must not take a quiz answer down with it.
 */
export function haptic(kind: Haptic, enabled: boolean): void {
  if (!enabled || !hapticsSupported()) return;
  try {
    navigator.vibrate(PATTERNS[kind]);
  } catch {
    // Ignored — decorative by definition.
  }
}
