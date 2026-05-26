"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type TimerStatus = "idle" | "running" | "paused" | "complete";

interface TimerState {
  durationMs: number;
  remainingMs: number;
  status: TimerStatus;
  selectedPresetSeconds: number | null;
}

interface TimerContextValue extends TimerState {
  progress: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setDuration: (ms: number) => void;
  setPreset: (seconds: number | null) => void;
  registerCompleteHandler: (handler: () => void) => () => void;
}

const TimerContext = createContext<TimerContextValue | null>(null);

const STORAGE_KEY = "atlas-timer:session";
const TICK_MS = 250;
const DEFAULT_DURATION_MS = 5 * 60 * 1000;

interface StoredSession {
  durationMs: number;
  endAt: number | null;
  remainingMs: number;
  status: TimerStatus;
  selectedPresetSeconds: number | null;
}

function readStored(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

function writeStored(session: StoredSession) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [durationMs, setDurationMsState] = useState(DEFAULT_DURATION_MS);
  const [remainingMs, setRemainingMs] = useState(DEFAULT_DURATION_MS);
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [selectedPresetSeconds, setSelectedPresetSeconds] = useState<number | null>(
    DEFAULT_DURATION_MS / 1000
  );

  const endAtRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const completeHandlersRef = useRef(new Set<() => void>());

  const persist = useCallback(
    (overrides: Partial<StoredSession> = {}) => {
      writeStored({
        durationMs,
        endAt: endAtRef.current,
        remainingMs,
        status,
        selectedPresetSeconds,
        ...overrides,
      });
    },
    [durationMs, remainingMs, status, selectedPresetSeconds]
  );

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (endAtRef.current === null) return;
    const remaining = endAtRef.current - Date.now();
    if (remaining <= 0) {
      endAtRef.current = null;
      clearTick();
      setRemainingMs(0);
      setStatus("complete");
      persist({ endAt: null, remainingMs: 0, status: "complete" });
      completeHandlersRef.current.forEach((handler) => {
        try {
          handler();
        } catch {
          // ignore handler errors
        }
      });
      return;
    }
    setRemainingMs(remaining);
  }, [clearTick, persist]);

  const startInterval = useCallback(() => {
    clearTick();
    intervalRef.current = window.setInterval(tick, TICK_MS);
  }, [clearTick, tick]);

  // Hydration: restore from localStorage once on mount
  useEffect(() => {
    const stored = readStored();
    if (!stored) return;

    /* eslint-disable react-hooks/set-state-in-effect */
    setDurationMsState(stored.durationMs);
    setSelectedPresetSeconds(stored.selectedPresetSeconds);

    if (stored.status === "running" && stored.endAt) {
      const remaining = stored.endAt - Date.now();
      if (remaining > 0) {
        endAtRef.current = stored.endAt;
        setRemainingMs(remaining);
        setStatus("running");
        startInterval();
      } else {
        setRemainingMs(0);
        setStatus("complete");
      }
    } else if (stored.status === "paused") {
      setRemainingMs(stored.remainingMs);
      setStatus("paused");
    } else if (stored.status === "complete") {
      setRemainingMs(0);
      setStatus("complete");
    } else {
      setRemainingMs(stored.remainingMs || stored.durationMs);
      setStatus("idle");
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      clearTick();
    };
  }, [clearTick]);

  const start = useCallback(() => {
    const startFrom = status === "paused" ? remainingMs : durationMs;
    if (startFrom <= 0) return;
    const newEnd = Date.now() + startFrom;
    endAtRef.current = newEnd;
    setRemainingMs(startFrom);
    setStatus("running");
    writeStored({
      durationMs,
      endAt: newEnd,
      remainingMs: startFrom,
      status: "running",
      selectedPresetSeconds,
    });
    startInterval();
  }, [durationMs, remainingMs, selectedPresetSeconds, startInterval, status]);

  const pause = useCallback(() => {
    if (endAtRef.current === null) return;
    const remaining = Math.max(0, endAtRef.current - Date.now());
    endAtRef.current = null;
    clearTick();
    setRemainingMs(remaining);
    setStatus("paused");
    writeStored({
      durationMs,
      endAt: null,
      remainingMs: remaining,
      status: "paused",
      selectedPresetSeconds,
    });
  }, [clearTick, durationMs, selectedPresetSeconds]);

  const reset = useCallback(() => {
    clearTick();
    endAtRef.current = null;
    setRemainingMs(durationMs);
    setStatus("idle");
    writeStored({
      durationMs,
      endAt: null,
      remainingMs: durationMs,
      status: "idle",
      selectedPresetSeconds,
    });
  }, [clearTick, durationMs, selectedPresetSeconds]);

  const setDuration = useCallback(
    (ms: number) => {
      const safe = Math.max(0, ms);
      clearTick();
      endAtRef.current = null;
      setDurationMsState(safe);
      setRemainingMs(safe);
      setStatus("idle");
      writeStored({
        durationMs: safe,
        endAt: null,
        remainingMs: safe,
        status: "idle",
        selectedPresetSeconds,
      });
    },
    [clearTick, selectedPresetSeconds]
  );

  const setPreset = useCallback(
    (seconds: number | null) => {
      setSelectedPresetSeconds(seconds);
      if (seconds !== null) {
        setDuration(seconds * 1000);
      }
    },
    [setDuration]
  );

  const registerCompleteHandler = useCallback((handler: () => void) => {
    completeHandlersRef.current.add(handler);
    return () => {
      completeHandlersRef.current.delete(handler);
    };
  }, []);

  const progress = durationMs > 0 ? 1 - remainingMs / durationMs : 0;

  const value = useMemo<TimerContextValue>(
    () => ({
      durationMs,
      remainingMs,
      status,
      selectedPresetSeconds,
      progress,
      start,
      pause,
      reset,
      setDuration,
      setPreset,
      registerCompleteHandler,
    }),
    [
      durationMs,
      remainingMs,
      status,
      selectedPresetSeconds,
      progress,
      start,
      pause,
      reset,
      setDuration,
      setPreset,
      registerCompleteHandler,
    ]
  );

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}

export function useTimerStore() {
  const ctx = useContext(TimerContext);
  if (!ctx) {
    throw new Error("useTimerStore must be used inside TimerProvider");
  }
  return ctx;
}
