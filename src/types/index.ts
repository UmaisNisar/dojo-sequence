/**
 * Core domain models for Dojo Sequence.
 *
 * Character → Stage → TrainingItem → Drill
 * Progress is tracked separately (per item) and persisted via a ProgressStore.
 */

/* ------------------------------------------------------------------ */
/* Drills                                                              */
/* ------------------------------------------------------------------ */

export type DrillType =
  | "consecutive-reps"
  | "total-reps"
  | "accuracy"
  | "manual"
  | "timed";

/** Perform N clean reps in a row. Dropping one resets the streak. */
export interface ConsecutiveRepsDrill {
  type: "consecutive-reps";
  target: number;
  /** What counts as one clean rep. */
  rep: string;
}

/** Accumulate N total reps. Misses don't reset progress. */
export interface TotalRepsDrill {
  type: "total-reps";
  target: number;
  rep: string;
}

/** Land at least `required` successes out of `attempts` tries. */
export interface AccuracyDrill {
  type: "accuracy";
  attempts: number;
  required: number;
  rep: string;
}

/** Conceptual work — the player checks off each point once internalized. */
export interface ManualDrill {
  type: "manual";
  checklist: string[];
}

/** Sustain an activity for a duration (e.g. wavedash across the stage for 30s). */
export interface TimedDrill {
  type: "timed";
  durationSeconds: number;
  rep: string;
}

export type Drill =
  | ConsecutiveRepsDrill
  | TotalRepsDrill
  | AccuracyDrill
  | ManualDrill
  | TimedDrill;

/* ------------------------------------------------------------------ */
/* Curriculum                                                          */
/* ------------------------------------------------------------------ */

export type ItemDifficulty = "easy" | "medium" | "hard" | "expert";

export interface TrainingItem {
  /** Stable id, unique within the character. Used in URLs. */
  id: string;
  stageId: string;
  name: string;
  /** Move notation, e.g. "f,n,d,df+2". Empty for pure concept items. */
  notation: string;
  /** One concise plain-English explanation of what this accomplishes. */
  purpose: string;
  /** The actual gameplay scenario in which to use it. */
  whenToUse: string;
  /** Execution advice specific to hitbox/leverless controllers. */
  leverlessTip: string;
  drill: Drill;
  difficulty?: ItemDifficulty;
  /** Small metadata tags shown in the UI, e.g. ["14f", "mid", "launcher"]. */
  tags?: string[];
  /** Keys into the character's frame-data table — renders a frame panel. */
  moveKeys?: string[];
  /** Frame data or facts that could not be fully verified. */
  verifyInGame?: string;
}

export interface Stage {
  id: string;
  /** 1-based display number. */
  number: number;
  name: string;
  /** Short tagline shown under the stage name. */
  focus: string;
  /** Longer description of what this stage teaches. */
  description: string;
  items: TrainingItem[];
}

export interface Character {
  id: string;
  name: string;
  /** e.g. "Mishima Style Fighting Karate" */
  style: string;
  /** Short positioning blurb. */
  tagline: string;
  available: boolean;
  /** Mishima-style electrics — drives the storm backdrop for this fighter. */
  electric?: boolean;
  /** Signature colour. Drives the accent for this fighter's whole curriculum. */
  accent?: { base: string; bright: string; deep: string };
  stages: Stage[];
  /** Timed reaction quiz for the punishment stage. */
  punishQuiz?: QuizQuestion[];
}

/** A character that appears in the selector but has no curriculum yet. */
export interface ComingSoonCharacter {
  id: string;
  name: string;
  style: string;
  available: false;
}

/* ------------------------------------------------------------------ */
/* Progress                                                            */
/* ------------------------------------------------------------------ */

export type ItemStatus = "not-started" | "learned";

export interface DrillProgress {
  status: ItemStatus;
  /** Epoch ms of the last time the item was practiced. */
  lastPracticedAt: number | null;
  /** Epoch ms of the last retention review after learning. */
  lastReviewedAt: number | null;
  /** Epoch ms when the item became learned. */
  learnedAt: number | null;
}

export interface CharacterProgress {
  characterId: string;
  items: Record<string, DrillProgress>;
}

/* ------------------------------------------------------------------ */
/* Session                                                             */
/* ------------------------------------------------------------------ */

export type SessionItemKind = "learn" | "retention";

export interface SessionItem {
  itemId: string;
  kind: SessionItemKind;
  /** Marked when the player moves past this item in the session. */
  completed: boolean;
  skipped: boolean;
}

export interface Session {
  characterId: string;
  items: SessionItem[];
  currentIndex: number;
  startedAt: number;
}

/** Snapshot kept when a session finishes, for the results screen. */
export interface SessionResult {
  characterId: string;
  items: SessionItem[];
  startedAt: number;
  finishedAt: number;
}

/* ------------------------------------------------------------------ */
/* Punish quiz                                                         */
/* ------------------------------------------------------------------ */

export interface QuizQuestion {
  id: string;
  /** Big flashed prompt, e.g. "-13" or "WHIFF". */
  prompt: string;
  /** One-line situation description. */
  situation: string;
  options: string[];
  correctIndex: number;
  /** Shown after answering — the why, including near-miss notes. */
  explain: string;
}

export interface QuizStats {
  runs: number;
  bestScore: number;
  bestAvgMs: number | null;
}

/** Where a generated question came from — drives the label and the review link. */
export type QuizCategory =
  | "block"
  | "speed"
  | "level"
  | "launcher"
  | "notation";

/**
 * A question built from the verified frame table, not hand-authored.
 * See `src/lib/quiz-generator.ts` for the rules that keep them honest.
 */
export interface QuizItem {
  id: string;
  category: QuizCategory;
  /** Short eyebrow, e.g. "On block". */
  categoryLabel: string;
  prompt: string;
  situation: string;
  /** "Name · input" — identifies the move where the question wording is gone. */
  subject: string;
  options: string[];
  correctIndex: number;
  explain: string;
  /** True when the move belongs to an item the player has marked learned. */
  fromTraining?: boolean;
  /** Set for trained moves, so a miss can link straight back to the lesson. */
  fromItemId?: string;
  fromStageNumber?: number;
}

export interface KnowledgeStats {
  runs: number;
  bestScore: number;
  /** What bestScore was out of, so the display stays honest if length changes. */
  bestTotal: number;
  bestStreak: number;
}

/* ------------------------------------------------------------------ */
/* Frame data — single source of truth for every number in the UI     */
/* ------------------------------------------------------------------ */

export interface MoveFrames {
  /** Row id in Wavu Wiki's Move table — what the patch verifier diffs against. */
  wavuId: string;
  input: string;
  name: string;
  level: string;
  /** Wavu-exact startup string (string moves store the listed hit's value). Null for non-attacks such as a parry. */
  startup: string | null;
  /** Human display when the wavu-exact startup is a string-continuation. */
  displayStartup?: string;
  /** Null when the move cannot be blocked at all (unblockables, parries). */
  block: string | null;
  /** Null for non-attacks that have no hit frames of their own. */
  hit: string | null;
  ch: string | null;
  notes: string[];
  /** Wavu Wiki move-demo clip, resolved at authoring time by
      scripts/fetch-move-videos.mjs. Absent when no clip exists. */
  video?: string;
}

export interface FrameDataSet {
  characterId: string;
  game: string;
  gameVersion: string;
  /** ISO date this table was last verified against live sources. */
  verifiedAt: string;
  sources: { name: string; url: string }[];
  moves: Record<string, MoveFrames>;
}

/* ------------------------------------------------------------------ */
/* Persisted state (everything the store owns)                         */
/* ------------------------------------------------------------------ */

export interface PersistedState {
  schemaVersion: number;
  /** The fighter the app is currently training — set on character select. */
  activeCharacterId: string;
  characters: Record<string, CharacterProgress>;
  activeSession: Session | null;
  lastSessionResult: SessionResult | null;
  /** Per-character reaction quiz stats. */
  quizStats: Record<string, QuizStats>;
  knowledgeStats: Record<string, KnowledgeStats>;
  settings: {
    reducedMotion: boolean;
    /** Mirror move clips so they read as the left (P1) side. */
    mirrorClips: boolean;
    /** Vibrate on answers and milestones. Android only; iOS has no web API. */
    haptics: boolean;
  };
}

/** Export envelope written to / read from JSON files. */
export interface ExportedProgress {
  app: "dojo-sequence";
  schemaVersion: number;
  exportedAt: string;
  characters: Record<string, CharacterProgress>;
}

/* ------------------------------------------------------------------ */
/* Derived/engine types                                                */
/* ------------------------------------------------------------------ */

export type StageStatus = "locked" | "unlocked" | "complete";

export interface StageSummary {
  stage: Stage;
  status: StageStatus;
  learnedCount: number;
  totalCount: number;
}

export interface CharacterSummary {
  learnedCount: number;
  totalCount: number;
  /** 1-based number of the furthest unlocked (not complete) stage; equals stage count when done. */
  currentStageNumber: number;
  stages: StageSummary[];
}

export interface TodayPlan {
  /** Next unlearned items in curriculum order (first is "the" next item). */
  nextUp: TrainingItem[];
  /** Learned items due for review. */
  retention: TrainingItem[];
}
