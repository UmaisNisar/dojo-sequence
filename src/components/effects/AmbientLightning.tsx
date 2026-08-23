/**
 * Decorative lightning arcs that flicker occasionally in the background.
 * Pure CSS animation over inline SVG — rests invisible, so reduced motion
 * (OS or in-app) simply never shows it.
 */
export function AmbientLightning() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] overflow-hidden"
    >
      <svg
        className="arc absolute left-[8%] top-6 h-64 w-24 text-accent"
        viewBox="0 0 100 300"
        fill="none"
      >
        <path
          d="M62 0 L38 96 L58 102 L22 210 L46 216 L30 300"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M62 0 L38 96 L58 102 L22 210 L46 216 L30 300"
          stroke="currentColor"
          strokeWidth="7"
          opacity="0.25"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        className="arc arc-slow absolute right-[12%] top-0 h-56 w-20 text-accent-bright"
        viewBox="0 0 100 300"
        fill="none"
      >
        <path
          d="M44 0 L66 84 L46 90 L74 188 L52 194 L70 300"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        className="arc arc-fast absolute left-[46%] top-10 h-40 w-16 text-accent"
        viewBox="0 0 100 300"
        fill="none"
      >
        <path
          d="M54 0 L40 110 L60 118 L44 300"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
