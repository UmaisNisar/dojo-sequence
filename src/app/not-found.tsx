import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="microlabel">404</p>
      <h1 className="mt-2 text-3xl font-bold uppercase tracking-tight">
        Off the curriculum
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
        This page doesn&apos;t exist — maybe the character or item you&apos;re
        looking for hasn&apos;t been added yet.
      </p>
      <Link
        href="/today"
        className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-accent-bright"
      >
        Back to Today
      </Link>
    </div>
  );
}
