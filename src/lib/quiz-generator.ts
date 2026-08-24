/**
 * Builds a quiz from the verified frame tables and the player's own progress.
 *
 * Questions are generated rather than hand-written so every character gets a
 * deep pool without anyone authoring hundreds of answers by hand — but that
 * only works if generation is conservative. The same rule as the frame tables
 * applies: never invent an answer. Anything whose data cannot be parsed
 * unambiguously is skipped rather than guessed at, which is why the pools here
 * are smaller than the move tables they come from.
 *
 * Two failure modes are guarded against explicitly, because either would make
 * the quiz worse than useless:
 *
 *   - a distractor that is also correct (two right answers)
 *   - a distractor that is distinguishable by formatting rather than knowledge
 *
 * `npm run verify:quiz` re-checks both across every character.
 */

import type {
  Character,
  CharacterProgress,
  FrameDataSet,
  MoveFrames,
  QuizItem,
} from "@/types";

/* This module deliberately has no runtime imports. Type-only imports are
   erased, so `node scripts/verify-quiz.mjs` can execute it directly against
   every character rather than the checks living only in the browser. */

export const QUIZ_LENGTH = 12;

/* ------------------------------------------------------------------ */
/* Parsing — strict, because a wrong question teaches a wrong answer    */
/* ------------------------------------------------------------------ */

/** Leading frame count, e.g. "i15~16" → 15. Null when not parseable. */
function startupFrames(move: MoveFrames): number | null {
  const m = /^i(\d+)/.exec(move.startup ?? "");
  return m ? Number(m[1]) : null;
}

/** Only clean integers like "-13" or "+1"; "+9c" and friends are skipped. */
function blockValue(move: MoveFrames): string | null {
  const v = (move.block ?? "").trim();
  return /^[+-]\d+$/.test(v) ? v : null;
}

/**
 * Single-hit level only.
 *
 * A comma means a multi-hit string, where "the" level is ambiguous. Uppercase
 * codes carry a meaning in Wavu's schema that this app does not model, so they
 * are skipped rather than guessed at.
 */
function hitLevel(move: MoveFrames): "High" | "Mid" | "Low" | null {
  const v = move.level ?? "";
  if (v === "h") return "High";
  if (v === "m") return "Mid";
  if (v === "l") return "Low";
  return null;
}

/** Wavu marks an aerial/launch state with a trailing "a" on the hit value. */
function isLauncher(move: MoveFrames): boolean {
  return /[+-]?\d+a\b/.test(move.hit ?? "");
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sample<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

/** A move's display label, used identically for answers and distractors. */
function label(move: MoveFrames): string {
  return move.input;
}

/**
 * Assembles options so the answer cannot be spotted by shape alone.
 * Returns null when there are not enough genuinely-distinct distractors.
 */
function buildOptions(
  correct: string,
  candidates: string[],
  count = 4,
): { options: string[]; correctIndex: number } | null {
  const distinct: string[] = [];
  for (const c of candidates) {
    if (c === correct) continue;
    if (distinct.includes(c)) continue;
    distinct.push(c);
    if (distinct.length === count - 1) break;
  }
  if (distinct.length < count - 1) return null;
  const options = shuffle([correct, ...distinct]);
  return { options, correctIndex: options.indexOf(correct) };
}

/* ------------------------------------------------------------------ */
/* Question builders — one per category                                */
/* ------------------------------------------------------------------ */

type Builder = (move: MoveFrames, pool: MoveFrames[]) => QuizItem | null;

const askBlock: Builder = (move, pool) => {
  const answer = blockValue(move);
  if (!answer) return null;
  const others = pool
    .map(blockValue)
    .filter((v): v is string => v !== null && v !== answer);
  const opts = buildOptions(answer, shuffle(others));
  if (!opts) return null;

  const frames = Number(answer);
  const verdict =
    frames <= -15
      ? "That is launch-punishable — a hard read for the opponent to take."
      : frames <= -10
        ? "That is punishable by most of the cast."
        : frames >= 0
          ? "That leaves you at advantage."
          : "That is safe against standard punishers.";

  return {
    id: `block:${move.wavuId}`,
    category: "block",
    categoryLabel: "On block",
    prompt: move.input,
    situation: `Opponent blocks ${move.name}. Where does it leave you?`,
    options: opts.options,
    correctIndex: opts.correctIndex,
    subject: `${move.name} · ${move.input}`,
    explain: `${move.name} (${move.input}) is ${answer} on block. ${verdict}`,
  };
};

const askLevel: Builder = (move) => {
  const answer = hitLevel(move);
  if (!answer) return null;
  const options = ["High", "Mid", "Low"];
  const meaning: Record<string, string> = {
    High: "Highs can be ducked entirely, which is what makes them a risk.",
    Mid: "Mids cannot be ducked — this is what beats a crouching opponent.",
    Low: "Lows must be blocked crouching, and are usually launch-punishable.",
  };
  return {
    id: `level:${move.wavuId}`,
    category: "level",
    categoryLabel: "Hit level",
    prompt: move.input,
    situation: `What does ${move.name} hit as?`,
    options,
    correctIndex: options.indexOf(answer),
    subject: `${move.name} · ${move.input}`,
    explain: `${move.name} (${move.input}) is a ${answer.toLowerCase()}. ${meaning[answer]}`,
  };
};

const askSpeed: Builder = (move, pool) => {
  const mine = startupFrames(move);
  if (mine === null) return null;
  // Every distractor must be strictly slower, or there is no single answer.
  const slower = pool.filter((m) => {
    const f = startupFrames(m);
    return f !== null && f > mine && m.wavuId !== move.wavuId;
  });
  const opts = buildOptions(label(move), sample(slower, 8).map(label));
  if (!opts) return null;
  return {
    id: `speed:${move.wavuId}`,
    category: "speed",
    categoryLabel: "Fastest option",
    prompt: "WHICH IS FASTEST?",
    situation: "You need the quickest of these four.",
    options: opts.options,
    correctIndex: opts.correctIndex,
    subject: `${move.name} · ${move.input}`,
    explain: `${move.name} (${move.input}) starts up in i${mine} — the fastest of the four. Speed is what decides your punishes and who wins a trade.`,
  };
};

const askLauncher: Builder = (move, pool) => {
  if (!isLauncher(move)) return null;
  const grounded = pool.filter((m) => !isLauncher(m) && m.hit);
  const opts = buildOptions(label(move), sample(grounded, 8).map(label));
  if (!opts) return null;
  return {
    id: `launch:${move.wavuId}`,
    category: "launcher",
    categoryLabel: "Launcher",
    prompt: "WHICH ONE LAUNCHES?",
    situation: "Only one of these puts them in the air on a normal hit.",
    options: opts.options,
    correctIndex: opts.correctIndex,
    subject: `${move.name} · ${move.input}`,
    explain: `${move.name} (${move.input}) launches on hit (${move.hit}). Launchers are how a read turns into real damage.`,
  };
};

const askNotation: Builder = (move, pool) => {
  const opts = buildOptions(
    label(move),
    sample(
      pool.filter((m) => m.wavuId !== move.wavuId),
      8,
    ).map(label),
  );
  if (!opts) return null;
  return {
    id: `input:${move.wavuId}`,
    category: "notation",
    categoryLabel: "Know the input",
    prompt: move.name.toUpperCase(),
    situation: "Which input gives you this move?",
    options: opts.options,
    correctIndex: opts.correctIndex,
    subject: `${move.name} · ${move.input}`,
    explain: `${move.name} is ${move.input}.`,
  };
};

const BUILDERS: Builder[] = [
  askBlock,
  askSpeed,
  askLevel,
  askLauncher,
  askNotation,
];

/* ------------------------------------------------------------------ */
/* Assembly                                                            */
/* ------------------------------------------------------------------ */

export interface QuizPlan {
  questions: QuizItem[];
  /** How many came from moves the player has actually trained. */
  fromTraining: number;
  /** True when nothing is learned yet and the quiz is all general knowledge. */
  coldStart: boolean;
}

interface LessonRef {
  itemId: string;
  stageNumber: number;
}

/**
 * Every move key referenced by items the player has marked learned, with the
 * lesson each one came from so a miss can link back to it.
 *
 * The walk is inlined rather than borrowed from `progression.ts` to keep this
 * module free of runtime imports — see the note at the top.
 */
function learnedMoveKeys(
  character: Character,
  progress: CharacterProgress | undefined,
): { keys: Set<string>; lessonFor: Map<string, LessonRef> } {
  const keys = new Set<string>();
  const lessonFor = new Map<string, LessonRef>();
  for (const stage of character.stages) {
    for (const item of stage.items) {
      if (progress?.items?.[item.id]?.status !== "learned") continue;
      for (const key of item.moveKeys ?? []) {
        keys.add(key);
        if (!lessonFor.has(key)) {
          lessonFor.set(key, { itemId: item.id, stageNumber: stage.number });
        }
      }
    }
  }
  return { keys, lessonFor };
}

/**
 * Builds a run.
 *
 * Weighted towards what the player has trained — that is the part they can be
 * fairly held to — then topped up with general knowledge about the character
 * so the quiz never runs short and always teaches something new.
 */
export function buildQuiz(
  character: Character,
  frames: FrameDataSet | undefined,
  progress: CharacterProgress | undefined,
  length = QUIZ_LENGTH,
): QuizPlan {
  if (!frames) return { questions: [], fromTraining: 0, coldStart: true };

  const entries = Object.entries(frames.moves);
  const everyMove = entries.map(([, m]) => m);

  /* An input that names two moves cannot be a fair option or a fair prompt:
     Kazuya's Wind God Fist and its just-frame Electric share an input but not
     their frames, so a question about "f,n,d,df+2" would have had two truthful
     answers. The frame tables distinguish them, and `npm run verify:quiz`
     fails if a new one ever slips in — this filter is the belt to that
     braces, so a data regression degrades the quiz instead of corrupting it. */
  const seenInput = new Map<string, number>();
  for (const m of everyMove) {
    seenInput.set(m.input, (seenInput.get(m.input) ?? 0) + 1);
  }
  const unambiguous = ([, m]: [string, MoveFrames]) =>
    (seenInput.get(m.input) ?? 0) === 1;

  const usable = entries.filter(unambiguous);
  const all = usable.map(([, m]) => m);
  const { keys, lessonFor } = learnedMoveKeys(character, progress);

  const trained = usable.filter(([k]) => keys.has(k));
  const untrained = usable.filter(([k]) => !keys.has(k));

  const made = new Map<string, QuizItem>();

  const harvest = (source: [string, MoveFrames][], limit: number) => {
    for (const [key, move] of shuffle(source)) {
      if (made.size >= limit) return;
      for (const build of shuffle(BUILDERS)) {
        const q = build(move, all);
        if (!q || made.has(q.id)) continue;
        const lesson = lessonFor.get(key);
        made.set(q.id, {
          ...q,
          fromTraining: keys.has(key),
          fromItemId: lesson?.itemId,
          fromStageNumber: lesson?.stageNumber,
        });
        break; // one question per move per pass, for variety
      }
    }
  };

  // Two-thirds from trained material when there is enough of it.
  const trainedTarget = Math.min(Math.ceil(length * 0.66), trained.length);
  harvest(trained, trainedTarget);
  const fromTraining = made.size;
  harvest(untrained, length);
  // A short curriculum can leave gaps; a second pass over trained moves fills
  // them with a different question type rather than shipping a stubby quiz.
  if (made.size < length) harvest(trained, length);

  const questions = shuffle([...made.values()]).slice(0, length);
  return {
    questions,
    fromTraining: Math.min(fromTraining, questions.length),
    coldStart: keys.size === 0,
  };
}
