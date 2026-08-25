import type { FrameDataSet } from "@/types";
import kazuyaFrames from "./characters/kazuya.frames.json";
import larsFrames from "./characters/lars.frames.json";
import bryanFrames from "./characters/bryan.frames.json";
import jinFrames from "./characters/jin.frames.json";
import kingFrames from "./characters/king.frames.json";
import dragunovFrames from "./characters/dragunov.frames.json";
import steveFrames from "./characters/steve.frames.json";
import hwoarangFrames from "./characters/hwoarang.frames.json";

/**
 * Frame-data registry — the ONLY place frame numbers live.
 * Each table is stamped with the game version + verification date and is
 * diffable against Wavu Wiki's live database via `npm run verify:frames`.
 */
const frameData: Record<string, FrameDataSet> = {
  kazuya: kazuyaFrames as FrameDataSet,
  lars: larsFrames as FrameDataSet,
  bryan: bryanFrames as FrameDataSet,
  jin: jinFrames as FrameDataSet,
  king: kingFrames as FrameDataSet,
  dragunov: dragunovFrames as FrameDataSet,
  steve: steveFrames as FrameDataSet,
  hwoarang: hwoarangFrames as FrameDataSet,
};

export function getFrameData(characterId: string): FrameDataSet | undefined {
  return frameData[characterId];
}

/** Days after which unverified data is flagged as possibly outdated. */
const STALE_AFTER_DAYS = 120;

export function frameDataAgeDays(set: FrameDataSet, now: number): number {
  const verified = Date.parse(set.verifiedAt);
  if (Number.isNaN(verified)) return Infinity;
  return Math.floor((now - verified) / 86_400_000);
}

/**
 * True when a Tekken patch has plausibly shipped since verification —
 * the UI then says so instead of presenting numbers as current.
 */
export function isFrameDataStale(set: FrameDataSet, now: number): boolean {
  return frameDataAgeDays(set, now) > STALE_AFTER_DAYS;
}
