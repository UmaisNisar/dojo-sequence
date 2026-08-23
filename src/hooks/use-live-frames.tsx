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

    let cancelled = false;
    const update = (characterId: string, state: LiveFramesState) => {
      if (!cancelled)
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

    return () => {
      cancelled = true;
    };
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
