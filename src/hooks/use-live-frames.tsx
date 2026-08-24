"use client";

/**
 * Background frame-data freshness check, run once when the app opens.
 * Cached daily; every FrameDataPanel reads the result from this context.
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { characters } from "@/data/characters";
import { getFrameData } from "@/data/frames";
import {
  checkLiveFrames,
  isCheckFresh,
  loadCachedCheck,
  saveCachedCheck,
  type LiveFramesState,
} from "@/lib/live-frames";

type LiveFramesMap = Record<string, LiveFramesState>;

const LiveFramesContext = createContext<LiveFramesMap>({});

export function LiveFramesProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<LiveFramesMap>({});
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // No cancellation flag here on purpose. `startedRef` already guarantees the
    // checks run exactly once per provider, so a cleanup that invalidated them
    // would strand the UI on "checking" forever: under StrictMode's double
    // invoke, pass one starts the fetches, the cleanup cancels them, and pass
    // two skips re-starting because the ref is already set.
    const update = (characterId: string, state: LiveFramesState) => {
      setMap((m) => ({ ...m, [characterId]: state }));
    };

    for (const character of characters) {
      const set = getFrameData(character.id);
      if (!set) continue;

      const cached = loadCachedCheck(character.id);
      const now = Date.now();

      if (cached && isCheckFresh(cached, now)) {
        update(character.id, {
          status: cached.ok ? "ok" : "error",
          checkedAt: cached.checkedAt,
          overrides: cached.overrides,
        });
        continue;
      }

      // Show last-known result (if any) while re-checking in the background.
      update(character.id, {
        status: "checking",
        checkedAt: cached?.checkedAt ?? null,
        overrides: cached?.overrides ?? {},
      });

      checkLiveFrames(set)
        .then((overrides) => {
          const check = { checkedAt: Date.now(), ok: true, overrides };
          saveCachedCheck(character.id, check);
          update(character.id, {
            status: "ok",
            checkedAt: check.checkedAt,
            overrides,
          });
        })
        .catch(() => {
          const check = {
            checkedAt: Date.now(),
            ok: false,
            overrides: cached?.overrides ?? {},
          };
          saveCachedCheck(character.id, check);
          update(character.id, {
            status: "error",
            checkedAt: check.checkedAt,
            overrides: check.overrides,
          });
        });
    }
  }, []);

  return (
    <LiveFramesContext.Provider value={map}>
      {children}
    </LiveFramesContext.Provider>
  );
}

const IDLE: LiveFramesState = { status: "idle", checkedAt: null, overrides: {} };

export function useLiveFrames(characterId: string): LiveFramesState {
  const map = useContext(LiveFramesContext);
  return map[characterId] ?? IDLE;
}

/** Every character's check at once — for summarising, without a hook per row. */
export function useAllLiveFrames(): LiveFramesMap {
  return useContext(LiveFramesContext);
}
