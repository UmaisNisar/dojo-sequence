"use client";

/**
 * Background frame-data freshness check.
 *
 * Deliberately demand-driven: a check runs only for a character whose frame
 * data is actually on screen, and only once per session. Checking all seven
 * curricula on app open meant every first-time visitor fired ~32 Cargo queries
 * at a volunteer-run wiki before rendering anything — fine for one developer,
 * antisocial at the scale of a link being shared publicly. Someone who lands
 * on the roster and leaves now costs Wavu nothing.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getFrameData } from "@/data/frames";
import {
  checkLiveFrames,
  isCheckFresh,
  loadCachedCheck,
  saveCachedCheck,
  type LiveFramesState,
} from "@/lib/live-frames";

type LiveFramesMap = Record<string, LiveFramesState>;

interface LiveFramesContextValue {
  map: LiveFramesMap;
  /** Idempotent: starts this character's check the first time it is asked for. */
  request: (characterId: string) => void;
}

const LiveFramesContext = createContext<LiveFramesContextValue>({
  map: {},
  request: () => {},
});

export function LiveFramesProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<LiveFramesMap>({});
  const startedRef = useRef<Set<string>>(new Set());

  const request = useCallback((characterId: string) => {
    // The ref — not state — is what makes this run-once, so StrictMode's double
    // invoke and repeat renders both collapse to a single check. No cancellation
    // flag on purpose: cancelling on cleanup would strand the UI on "checking"
    // when pass two skips re-starting.
    const started = startedRef.current;
    if (started.has(characterId)) return;
    const set = getFrameData(characterId);
    if (!set) return;
    started.add(characterId);

    const update = (state: LiveFramesState) =>
      setMap((m) => ({ ...m, [characterId]: state }));

    const cached = loadCachedCheck(characterId);
    if (cached && isCheckFresh(cached, Date.now())) {
      update({
        status: cached.ok ? "ok" : "error",
        checkedAt: cached.checkedAt,
        overrides: cached.overrides,
      });
      return;
    }

    // Show the last known result (if any) while re-checking in the background.
    update({
      status: "checking",
      checkedAt: cached?.checkedAt ?? null,
      overrides: cached?.overrides ?? {},
    });

    checkLiveFrames(set)
      .then((overrides) => {
        const check = { checkedAt: Date.now(), ok: true, overrides };
        saveCachedCheck(characterId, check);
        update({ status: "ok", checkedAt: check.checkedAt, overrides });
      })
      .catch(() => {
        const check = {
          checkedAt: Date.now(),
          ok: false,
          overrides: cached?.overrides ?? {},
        };
        saveCachedCheck(characterId, check);
        update({
          status: "error",
          checkedAt: check.checkedAt,
          overrides: check.overrides,
        });
      });
  }, []);

  const value = useMemo(() => ({ map, request }), [map, request]);

  return (
    <LiveFramesContext.Provider value={value}>
      {children}
    </LiveFramesContext.Provider>
  );
}

const IDLE: LiveFramesState = { status: "idle", checkedAt: null, overrides: {} };

/** Reads one character's check, starting it if this is the first ask. */
export function useLiveFrames(characterId: string): LiveFramesState {
  const { map, request } = useContext(LiveFramesContext);
  useEffect(() => {
    request(characterId);
  }, [characterId, request]);
  return map[characterId] ?? IDLE;
}

/**
 * Whatever has been checked so far — for summarising in Settings.
 * Read-only on purpose: summarising must not itself trigger seven checks.
 */
export function useAllLiveFrames(): LiveFramesMap {
  return useContext(LiveFramesContext).map;
}
