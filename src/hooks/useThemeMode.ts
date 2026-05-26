"use client";

import { useCallback, useSyncExternalStore } from "react";

type ThemeMode = "dark" | "light";

const STORAGE_KEY = "atlas-timer:theme";

const listeners = new Set<() => void>();
let currentMode: ThemeMode = "dark";

function readStored(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  return stored ?? "dark";
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  root.dataset.theme = mode;
}

function subscribe(notify: () => void) {
  currentMode = readStored();
  applyTheme(currentMode);
  listeners.add(notify);
  notify();
  return () => {
    listeners.delete(notify);
  };
}

function getSnapshot(): ThemeMode {
  return currentMode;
}

function getServerSnapshot(): ThemeMode {
  return "dark";
}

export function useThemeMode() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next: ThemeMode = currentMode === "dark" ? "light" : "dark";
    currentMode = next;
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
    listeners.forEach((l) => l());
  }, []);

  return { mode, toggle };
}
