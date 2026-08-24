/**
 * User bug reports and suggestions.
 *
 * Submissions go straight from the browser to Web3Forms, which forwards them
 * to the project owner's inbox. That keeps the app frontend-only: there is no
 * route of ours to POST to, nothing to store, and no endpoint of ours for
 * anyone to abuse.
 *
 * The access key is public by design — it identifies the destination inbox,
 * not the sender, and cannot be used to read anything back. It still lives in
 * an env var rather than the source so it can be rotated from the Vercel
 * dashboard without a commit.
 */

const ENDPOINT = "https://api.web3forms.com/submit";

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

/** False when no key is configured — the form says so rather than pretending to send. */
export const feedbackConfigured = ACCESS_KEY.length > 0;

export const REPORT_KINDS = [
  { id: "bug", label: "Something's broken" },
  { id: "idea", label: "Suggestion" },
  { id: "data", label: "Wrong frame data" },
] as const;

export type ReportKind = (typeof REPORT_KINDS)[number]["id"];

export interface FeedbackReport {
  kind: ReportKind;
  /** Character id, or "" for "not about one character". */
  characterId: string;
  message: string;
  /** Optional — only so the owner can reply. */
  email: string;
  /** Honeypot: bots fill hidden fields, humans never see them. */
  botcheck: boolean;
}

/** Browser details worth having on a bug report, gathered at submit time. */
function environmentLine(): string {
  if (typeof window === "undefined") return "unknown";
  const { userAgent, language } = window.navigator;
  return `${userAgent} · ${window.innerWidth}x${window.innerHeight} · ${language}`;
}

export class FeedbackError extends Error {}

const REPO = "https://github.com/UmaisNisar/dojo-sequence";

/**
 * Somewhere to send a report that failed to submit.
 *
 * A rejected access key (expired, or over the monthly quota) comes back
 * without CORS headers, so the browser blocks the response and the failure is
 * indistinguishable from being offline. Rather than tell someone to check a
 * connection that is fine, hand them a prefilled issue so the report is not
 * simply lost.
 */
export function githubFallbackUrl(report: FeedbackReport): string {
  const kindLabel =
    REPORT_KINDS.find((k) => k.id === report.kind)?.label ?? report.kind;
  const body = [
    `**Type:** ${kindLabel}`,
    `**Character:** ${report.characterId || "not specific"}`,
    "",
    report.message.trim(),
  ].join("\n");
  const params = new URLSearchParams({
    title: `${kindLabel}${report.characterId ? ` — ${report.characterId}` : ""}`,
    body,
  });
  return `${REPO}/issues/new?${params.toString()}`;
}

export async function submitFeedback(report: FeedbackReport): Promise<void> {
  if (!feedbackConfigured) {
    throw new FeedbackError("Feedback is not configured for this deployment.");
  }
  if (report.botcheck) {
    // Silently accept: telling a bot it failed only teaches it to try again.
    return;
  }
  const trimmed = report.message.trim();
  if (trimmed.length < 5) {
    throw new FeedbackError("Please describe what happened.");
  }

  const kindLabel =
    REPORT_KINDS.find((k) => k.id === report.kind)?.label ?? report.kind;
  const email = report.email.trim();

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: `Dojo Sequence — ${kindLabel}${report.characterId ? ` (${report.characterId})` : ""}`,
        // `replyto` is reserved: it sets the mail header, so hitting Reply in
        // an inbox answers the reporter directly. Omitted entirely when they
        // gave no address — an empty one would only muddy the header.
        ...(email ? { replyto: email } : {}),
        // Everything else is free-form and renders as rows in the email body.
        Type: kindLabel,
        Character: report.characterId || "not specific",
        Message: trimmed,
        "Reply to": email || "not provided",
        Browser: environmentLine(),
        botcheck: false,
      }),
    });
  } catch {
    // A CORS-blocked rejection and a dead connection look identical to fetch,
    // so only claim it is the network when the browser agrees it is.
    throw new FeedbackError(
      typeof navigator !== "undefined" && navigator.onLine === false
        ? "You appear to be offline. Your report has not been sent yet."
        : "The report could not be delivered.",
    );
  }

  if (!res.ok) {
    throw new FeedbackError(
      res.status === 429
        ? "Too many reports just now — please try again in a minute."
        : "The report could not be delivered.",
    );
  }
}
