"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface SettingsState {
  exactTime: boolean;
  sound: boolean;
}

interface SettingsContextValue extends SettingsState {
  toggleExactTime: () => void;
  toggleSound: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const STORAGE_KEY = "atlas-timer:settings";

const DEFAULTS: SettingsState = {
  exactTime: true,
  sound: true,
};

function readStored(): SettingsState {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<SettingsState>;
    return {
      exactTime: typeof parsed.exactTime === "boolean" ? parsed.exactTime : DEFAULTS.exactTime,
      sound: typeof parsed.sound === "boolean" ? parsed.sound : DEFAULTS.sound,
    };
  } catch {
    return DEFAULTS;
  }
}

function writeStored(state: SettingsState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SettingsState>(DEFAULTS);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(readStored());
  }, []);

  const toggleExactTime = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, exactTime: !prev.exactTime };
      writeStored(next);
      return next;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, sound: !prev.sound };
      writeStored(next);
      return next;
    });
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({ ...state, toggleExactTime, toggleSound }),
    [state, toggleExactTime, toggleSound]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
