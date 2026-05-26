"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type TimerStatus = "idle" | "running" | "paused" | "complete";

interface UseTimerOptions {
  tickMs?: number;
  onComplete?: () => void;
}

export function useTimer(initialDurationMs: number, options: UseTimerOptions = {}) {
  const { tickMs = 250, onComplete } = options;

  const [durationMs, setDurationMs] = useState(initialDurationMs);
  const [remainingMs, setRemainingMs] = useState(initialDurationMs);
  const [status, setStatus] = useState<TimerStatus>("idle");

  const endTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const clearTick = useCallback(() => {
    if (rafRef.current !== null) {
      window.clearInterval(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (endTimeRef.current === null) return;
    const remaining = endTimeRef.current - Date.now();
    if (remaining <= 0) {
      setRemainingMs(0);
      setStatus("complete");
      endTimeRef.current = null;
      clearTick();
      onCompleteRef.current?.();
      return;
    }
    setRemainingMs(remaining);
  }, [clearTick]);

  const start = useCallback(() => {
    if (durationMs <= 0) return;
    const startFrom = status === "paused" ? remainingMs : durationMs;
    if (startFrom <= 0) return;
    endTimeRef.current = Date.now() + startFrom;
    setRemainingMs(startFrom);
    setStatus("running");
    clearTick();
    rafRef.current = window.setInterval(tick, tickMs);
  }, [clearTick, durationMs, remainingMs, status, tick, tickMs]);

  const pause = useCallback(() => {
    if (status !== "running" || endTimeRef.current === null) return;
    const remaining = Math.max(0, endTimeRef.current - Date.now());
    setRemainingMs(remaining);
    endTimeRef.current = null;
    setStatus("paused");
    clearTick();
  }, [clearTick, status]);

  const reset = useCallback(
    (nextDurationMs?: number) => {
      clearTick();
      endTimeRef.current = null;
      const next = nextDurationMs ?? durationMs;
      setDurationMs(next);
      setRemainingMs(next);
      setStatus("idle");
    },
    [clearTick, durationMs]
  );

  const setDuration = useCallback(
    (next: number) => {
      const safe = Math.max(0, next);
      clearTick();
      endTimeRef.current = null;
      setDurationMs(safe);
      setRemainingMs(safe);
      setStatus("idle");
    },
    [clearTick]
  );

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.clearInterval(rafRef.current);
      }
    };
  }, []);

  const progress = durationMs > 0 ? 1 - remainingMs / durationMs : 0;

  return {
    durationMs,
    remainingMs,
    status,
    progress,
    start,
    pause,
    reset,
    setDuration,
  };
}
