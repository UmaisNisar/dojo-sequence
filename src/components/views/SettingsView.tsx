"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  RadioTower,
  Download,
  Info,
  RotateCcw,
  Upload,
  Zap,
} from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { useAllLiveFrames } from "@/hooks/use-live-frames";
import { buildExport, downloadJson, parseImport } from "@/lib/export";
import { getFrameData } from "@/data/frames";
import { characters } from "@/data/characters";
import { cn, formatRelativeTime } from "@/lib/utils";

type Notice = { kind: "success" | "error"; message: string } | null;

export function SettingsView() {
  const { state, dispatch } = useProgress();
  const [notice, setNotice] = useState<Notice>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadJson(`dojo-sequence-progress-${stamp}.json`, buildExport(state));
    setNotice({ kind: "success", message: "Progress exported." });
  };

  const handleImportFile = async (file: File) => {
    try {
      const text = await file.text();
      const result = parseImport(text);
      if (!result.ok) {
        setNotice({ kind: "error", message: result.error });
        return;
      }
      dispatch({ type: "import-characters", characters: result.characters });
      setNotice({
        kind: "success",
        message: `Imported progress for ${result.itemCount} training item${result.itemCount === 1 ? "" : "s"}.`,
      });
    } catch {
      setNotice({ kind: "error", message: "Couldn't read that file." });
    }
  };

  return (
    <div>
      <header className="mb-8">
        <p className="microlabel">Data &amp; preferences</p>
        <h1 className="display-title mt-1 text-4xl uppercase tracking-tight sm:text-5xl">
          Settings
        </h1>
      </header>

      <div aria-live="polite">
        <AnimatePresence>
          {notice && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "mb-6 clip-row border p-3 text-sm",
                notice.kind === "success"
                  ? "border-accent/40 bg-accent-dim text-accent-bright"
                  : "border-danger/40 bg-danger/10 text-danger",
              )}
            >
              {notice.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-3">
        {/* Export */}
        <SettingRow
          icon={<Download className="size-4" aria-hidden />}
          title="Export progress"
          description="Download your full training progress as a JSON file."
        >
          <ActionButton onClick={handleExport}>Export</ActionButton>
        </SettingRow>

        {/* Import */}
        <SettingRow
          icon={<Upload className="size-4" aria-hidden />}
          title="Import progress"
          description="Restore from a previously exported file. The file is validated before anything is applied — this replaces current progress."
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            aria-label="Import progress file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImportFile(file);
              e.target.value = "";
            }}
          />
          <ActionButton onClick={() => fileInputRef.current?.click()}>
            Import
          </ActionButton>
        </SettingRow>

        {/* Reduced motion */}
        <SettingRow
          icon={<Zap className="size-4" aria-hidden />}
          title="Reduce motion"
          description="Minimize animations throughout the app. Your OS-level setting is always respected regardless."
        >
          <button
            type="button"
            role="switch"
            aria-checked={state.settings.reducedMotion}
            aria-label="Reduce motion"
            onClick={() =>
              dispatch({
                type: "set-reduced-motion",
                value: !state.settings.reducedMotion,
              })
            }
            className={cn(
              "relative h-7 w-12 rounded-full border transition-colors",
              state.settings.reducedMotion
                ? "border-accent bg-accent"
                : "border-border-strong bg-surface-3",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-5 rounded-full bg-white transition-[left]",
                state.settings.reducedMotion ? "left-6" : "left-0.5",
              )}
            />
          </button>
        </SettingRow>

        {/* Reset */}
        <SettingRow
          icon={<RotateCcw className="size-4" aria-hidden />}
          title="Reset all progress"
          description="Wipe every drill, rep, and learned state. This cannot be undone."
          danger
        >
          <ActionButton danger onClick={() => setConfirmReset(true)}>
            Reset
          </ActionButton>
        </SettingRow>

        {/* About */}
        <div className="clip-panel border border-border bg-surface p-5">
          <h2 className="microlabel flex items-center gap-1.5">
            <Info className="size-3.5" aria-hidden /> About
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            <span className="font-semibold text-fg">Dojo Sequence</span> teaches
            Tekken 8 characters as a strict, ordered curriculum — learn, drill,
            pass, unlock. All progress lives in your browser; nothing is sent
            anywhere. Dojo Sequence is a fan-made training tool and is not
            affiliated with Bandai Namco.
          </p>
          <FrameDataProvenance now={state.hydratedAt} />
        </div>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset all progress?"
        body="Every learned item, drill count, and session will be permanently erased. Consider exporting first."
        confirmLabel="Reset everything"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          dispatch({ type: "reset-all" });
          setConfirmReset(false);
          setNotice({ kind: "success", message: "All progress has been reset." });
        }}
      />
    </div>
  );
}

/** Frame-data provenance + live-check status for one character. */
/**
 * One line about where the frame data comes from — not one per character.
 * Every table is verified together against the same patch, so seven identical
 * rows was just noise. Splits only if the tables ever disagree.
 */
function FrameDataProvenance({ now }: { now: number }) {
  const live = useAllLiveFrames();

  const groups = new Map<string, { version: string; verifiedAt: string; ids: string[] }>();
  for (const c of characters) {
    const set = getFrameData(c.id);
    if (!set) continue;
    const key = `${set.gameVersion}|${set.verifiedAt}`;
    const g = groups.get(key) ?? {
      version: set.gameVersion,
      verifiedAt: set.verifiedAt,
      ids: [],
    };
    g.ids.push(c.id);
    groups.set(key, g);
  }
  if (groups.size === 0) return null;

  const states = characters.map((c) => live[c.id]?.status ?? "idle");
  const ok = states.filter((s) => s === "ok").length;
  const checking = states.filter((s) => s === "checking").length;
  const failed = states.filter((s) => s === "error").length;
  const checkedAt = characters
    .map((c) => live[c.id]?.checkedAt)
    .filter((t): t is number => typeof t === "number");
  const oldest = checkedAt.length ? Math.min(...checkedAt) : null;
  const changed = characters.reduce(
    (n, c) => n + Object.keys(live[c.id]?.overrides ?? {}).length,
    0,
  );

  return (
    <div className="mt-4 clip-row border border-border px-4 py-3">
      {[...groups.values()].map((g) => (
        <p key={g.version + g.verifiedAt} className="text-[11px] leading-relaxed text-faint">
          {groups.size > 1 && (
            <span className="font-semibold text-muted">
              {g.ids.join(", ")}:{" "}
            </span>
          )}
          Verified against Tekken 8 {g.version} on {g.verifiedAt} ·{" "}
          <a
            href="https://wavu.wiki"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-dotted underline-offset-2 transition-colors hover:text-fg"
          >
            Wavu Wiki
          </a>{" "}
          ·{" "}
          <a
            href="https://tekkendocs.com"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-dotted underline-offset-2 transition-colors hover:text-fg"
          >
            TekkenDocs
          </a>
        </p>
      ))}
      <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-faint">
        <RadioTower className="size-3 shrink-0" aria-hidden />
        {checking > 0
          ? "Live-checking against Wavu Wiki…"
          : failed > 0
            ? `${failed} table${failed === 1 ? "" : "s"} could not be live-checked — bundled values shown.`
            : ok > 0
              ? `${ok} of ${characters.length} tables live-checked ${formatRelativeTime(oldest, now)}${
                  changed > 0
                    ? ` — ${changed} value${changed === 1 ? "" : "s"} changed by a patch and shown live.`
                    : " — every checked value matches the bundled table."
                }`
              : "Each table is live-checked against Wavu Wiki the first time you open that character."}
      </p>
    </div>
  );
}

function SettingRow({
  icon,
  title,
  description,
  danger,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 clip-panel border bg-surface p-5",
        danger ? "border-danger/30" : "border-border",
      )}
    >
      <div className="min-w-0">
        <h2
          className={cn(
            "microlabel flex items-center gap-1.5",
            danger && "text-danger",
          )}
        >
          {icon} {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function ActionButton({
  onClick,
  danger,
  children,
}: {
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-[44px] clip-row border px-5 text-sm font-semibold transition-colors",
        danger
          ? "border-danger/40 text-danger hover:bg-danger/10"
          : "border-border text-fg hover:border-border-strong hover:bg-surface-2",
      )}
    >
      {children}
    </button>
  );
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/85 p-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="alertdialog"
          aria-modal="true"
          aria-label={title}
          onClick={onCancel}
        >
          <motion.div
            className="w-full max-w-sm clip-panel border border-border bg-surface p-6"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                autoFocus
                className="min-h-[44px] clip-row border border-border px-4 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-fg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="min-h-[44px] clip-row bg-danger px-4 text-sm font-semibold text-white transition-colors hover:opacity-90"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
