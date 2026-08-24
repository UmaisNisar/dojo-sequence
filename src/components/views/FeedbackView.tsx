"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, Send, AlertTriangle } from "lucide-react";
import { characters } from "@/data/characters";
import {
  REPORT_KINDS,
  feedbackConfigured,
  githubFallbackUrl,
  submitFeedback,
  type ReportKind,
} from "@/lib/feedback";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "clip-row w-full border border-border bg-surface px-3 py-2.5 text-sm text-fg " +
  "outline-none transition-colors placeholder:text-faint " +
  "focus:border-accent focus:ring-1 focus:ring-accent";

export function FeedbackView() {
  const [kind, setKind] = useState<ReportKind>("bug");
  const [characterId, setCharacterId] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [botcheck, setBotcheck] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      await submitFeedback({ kind, characterId, message, email, botcheck });
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const reset = () => {
    setMessage("");
    setCharacterId("");
    setStatus("idle");
    setError("");
  };

  if (status === "sent") {
    return (
      <div>
        <Header />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="clip-panel border border-accent/40 bg-accent-dim p-6 text-center"
        >
          <span className="mx-auto flex size-10 items-center justify-center clip-row border border-accent/60 text-accent-bright">
            <Check className="size-5" strokeWidth={3} aria-hidden />
          </span>
          <h2 className="mt-3 text-lg font-bold uppercase tracking-tight">
            Report sent
          </h2>
          <p className="mx-auto mt-1.5 max-w-sm text-xs text-muted">
            Thank you &mdash; genuinely. Reports like yours are the only way the
            frame data and the curricula get corrected.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 clip-row border border-border bg-surface px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted transition-colors hover:border-border-strong hover:text-fg"
          >
            Send another
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      {!feedbackConfigured && (
        <p
          role="status"
          className="mb-5 flex items-start gap-2 clip-row border border-danger/40 bg-surface p-3 text-xs text-muted"
        >
          <AlertTriangle
            className="mt-0.5 size-3.5 shrink-0 text-danger"
            aria-hidden
          />
          Reporting is not wired up on this deployment yet, so the form below is
          disabled rather than quietly dropping what you write.
        </p>
      )}

      <form onSubmit={send} className="flex flex-col gap-5">
        <fieldset>
          <legend className="microlabel mb-2">What kind of report?</legend>
          <div className="flex flex-wrap gap-2">
            {REPORT_KINDS.map((k) => {
              const active = kind === k.id;
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setKind(k.id)}
                  aria-pressed={active}
                  className={cn(
                    "clip-row border px-4 py-2 text-[13px] font-semibold transition-colors",
                    active
                      ? "border-accent bg-accent text-bg"
                      : "border-border bg-surface text-muted hover:border-border-strong hover:text-fg",
                  )}
                >
                  {k.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="fb-character" className="microlabel mb-2 block">
            Which character? <span className="text-faint">&mdash; optional</span>
          </label>
          <select
            id="fb-character"
            value={characterId}
            onChange={(e) => setCharacterId(e.target.value)}
            className={fieldClass}
          >
            <option value="">Not about one character</option>
            {characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="fb-message" className="microlabel mb-2 block">
            What happened?
          </label>
          <textarea
            id="fb-message"
            required
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What you expected, what happened instead, and where. For frame data, the move and the value you believe is correct."
            className={cn(fieldClass, "resize-y leading-relaxed")}
          />
        </div>

        <div>
          <label htmlFor="fb-email" className="microlabel mb-2 block">
            Email{" "}
            <span className="text-faint">
              &mdash; optional, only so you can be replied to
            </span>
          </label>
          <input
            id="fb-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={fieldClass}
          />
        </div>

        {/* Honeypot. Hidden from people and from screen readers; bots fill it in. */}
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          checked={botcheck}
          onChange={(e) => setBotcheck(e.target.checked)}
          className="absolute left-[-9999px] size-0 opacity-0"
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={status === "sending" || !feedbackConfigured}
            className="flex items-center gap-2 clip-row border border-accent bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="size-3.5" aria-hidden />
            {status === "sending" ? "Sending…" : "Send report"}
          </button>
          <p className="text-[11px] text-faint">
            Your browser and screen size are attached to help reproduce bugs.
            Nothing else &mdash; no training progress, no identifiers.
          </p>
        </div>

        <div role="status" aria-live="polite">
          {status === "error" && (
            <div className="clip-row border border-danger/40 bg-surface p-3 text-xs">
              <p className="text-danger">{error}</p>
              {/* Never a dead end: what they typed is already in this link. */}
              <p className="mt-1.5 text-muted">
                Nothing you wrote is lost.{" "}
                <a
                  href={githubFallbackUrl({
                    kind,
                    characterId,
                    message,
                    email,
                    botcheck,
                  })}
                  target="_blank"
                  rel="noreferrer"
                  className="text-fg underline decoration-dotted underline-offset-2 transition-colors hover:text-accent-bright"
                >
                  Open it as a GitHub issue instead
                </a>{" "}
                &mdash; it comes prefilled &mdash; or try again in a moment.
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

function Header() {
  return (
    <div className="mb-6">
      <p className="microlabel">Bugs &amp; suggestions</p>
      <h1 className="display-title mt-1 text-3xl uppercase sm:text-4xl">
        Report
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Found something broken, or frame data that does not match the game? Tell
        me here. No account needed.
      </p>
    </div>
  );
}
