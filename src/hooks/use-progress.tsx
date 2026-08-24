"use client";

/**
 * Central progress state. One reducer owns every mutation; the persistence
 * layer (ProgressStore) is the only thing that touches localStorage.
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import type {
  Character,
  CharacterProgress,
  DrillProgress,
  PersistedState,
  SessionItem,
} from "@/types";
import { emptyDrillProgress, emptyState, progressStore } from "@/lib/store";

import { characters, getCharacter } from "@/data/characters";
import { findItem } from "@/lib/progression";

interface ProgressState extends PersistedState {
  hydrated: boolean;
  /** Stable "now" captured at hydration — safe to use during render. */
  hydratedAt: number;
}

type Action =
  | { type: "hydrate"; state: PersistedState; at: number }
  | { type: "mark-learned"; characterId: string; itemId: string }
  | { type: "mark-reviewed"; characterId: string; itemId: string }
  | { type: "start-session"; characterId: string; items: SessionItem[] }
  | { type: "advance-session"; skipped: boolean }
  | { type: "exit-session" }
  | { type: "dismiss-session-result" }
  | { type: "record-quiz-run"; characterId: string; score: number; avgMs: number | null }
  | { type: "set-reduced-motion"; value: boolean }
  | { type: "set-active-character"; characterId: string }
  | { type: "import-characters"; characters: Record<string, CharacterProgress> }
  | { type: "reset-all" };

function updateItem(
  state: ProgressState,
  characterId: string,
  itemId: string,
  update: (p: DrillProgress) => DrillProgress,
): ProgressState {
  const existing = state.characters[characterId] ?? { characterId, items: {} };
  const current = existing.items[itemId] ?? emptyDrillProgress();
  const next = update(current);
  return {
    ...state,
    characters: {
      ...state.characters,
      [characterId]: {
        ...existing,
        items: { ...existing.items, [itemId]: next },
      },
    },
  };
}


function reducer(state: ProgressState, action: Action): ProgressState {
  switch (action.type) {
    case "hydrate":
      return { ...action.state, hydrated: true, hydratedAt: action.at };

    case "mark-learned": {
      // Nothing to validate — the reps happen in Practice mode, not here.
      const character = getCharacter(action.characterId);
      if (!character || !findItem(character, action.itemId)) return state;
      return updateItem(state, action.characterId, action.itemId, (p) => ({
        ...p,
        status: "learned",
        learnedAt: p.learnedAt ?? Date.now(),
        lastPracticedAt: Date.now(),
      }));
    }

    case "mark-reviewed":
      return updateItem(state, action.characterId, action.itemId, (p) => ({
        ...p,
        lastReviewedAt: Date.now(),
        lastPracticedAt: Date.now(),
      }));

    case "start-session":
      return {
        ...state,
        activeSession: {
          characterId: action.characterId,
          items: action.items,
          currentIndex: 0,
          startedAt: Date.now(),
        },
      };

    case "advance-session": {
      const session = state.activeSession;
      if (!session) return state;
      const items = session.items.map((item, i) =>
        i === session.currentIndex
          ? { ...item, completed: !action.skipped, skipped: action.skipped }
          : item,
      );
      const nextIndex = session.currentIndex + 1;
      if (nextIndex >= items.length) {
        // Session finished — snapshot it for the results screen.
        return {
          ...state,
          activeSession: null,
          lastSessionResult: {
            characterId: session.characterId,
            items,
            startedAt: session.startedAt,
            finishedAt: Date.now(),
          },
        };
      }
      return {
        ...state,
        activeSession: { ...session, items, currentIndex: nextIndex },
      };
    }

    case "exit-session":
      return { ...state, activeSession: null };

    case "dismiss-session-result":
      return { ...state, lastSessionResult: null };

    case "record-quiz-run": {
      const prev = state.quizStats[action.characterId] ?? {
        runs: 0,
        bestScore: 0,
        bestAvgMs: null,
      };
      // Best run = higher score; ties broken by faster average reaction.
      let bestScore = prev.bestScore;
      let bestAvgMs = prev.bestAvgMs;
      if (
        action.score > prev.bestScore ||
        (action.score === prev.bestScore &&
          action.avgMs !== null &&
          (bestAvgMs === null || action.avgMs < bestAvgMs))
      ) {
        bestScore = action.score;
        bestAvgMs = action.avgMs;
      }
      return {
        ...state,
        quizStats: {
          ...state.quizStats,
          [action.characterId]: { runs: prev.runs + 1, bestScore, bestAvgMs },
        },
      };
    }

    case "set-active-character":
      return { ...state, activeCharacterId: action.characterId };

    case "set-reduced-motion":
      return {
        ...state,
        settings: { ...state.settings, reducedMotion: action.value },
      };

    case "import-characters":
      return { ...state, characters: action.characters, activeSession: null };

    case "reset-all":
      return {
        ...emptyState(),
        activeCharacterId: state.activeCharacterId,
        hydrated: true,
        hydratedAt: state.hydratedAt,
      };
  }
}

interface ProgressContextValue {
  state: ProgressState;
  dispatch: (action: Action) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    ...emptyState(),
    hydrated: false,
    hydratedAt: 0,
  });

  // Hydrate once on the client.
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    dispatch({ type: "hydrate", state: progressStore.load(), at: Date.now() });
  }, []);

  // Persist every change after hydration.
  useEffect(() => {
    if (!state.hydrated) return;
    progressStore.save({
      schemaVersion: state.schemaVersion,
      activeCharacterId: state.activeCharacterId,
      characters: state.characters,
      activeSession: state.activeSession,
      lastSessionResult: state.lastSessionResult,
      quizStats: state.quizStats,
      settings: state.settings,
    });
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}

/** Convenience: progress for one character (possibly undefined). */
export function useCharacterProgress(
  characterId: string,
): CharacterProgress | undefined {
  const { state } = useProgress();
  return state.characters[characterId];
}

/**
 * The fighter currently being trained. Falls back to the first available
 * character if the stored id no longer exists (e.g. after a data change).
 */
export function useActiveCharacter(): Character {
  const { state } = useProgress();
  return getCharacter(state.activeCharacterId) ?? characters[0];
}

export function useReducedMotionSetting(): boolean {
  const { state } = useProgress();
  return state.settings.reducedMotion;
}

export type { Action as ProgressAction, ProgressState };
export type { Character };
