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

interface ChromeVisibilityContextValue {
  visible: boolean;
  isFullscreen: boolean;
  notify: () => void;
}

const ChromeVisibilityContext = createContext<ChromeVisibilityContextValue | null>(
  null
);

const HIDE_DELAY_MS = 5000;

export function ChromeVisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  const clearHideTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    timeoutRef.current = window.setTimeout(() => {
      setVisible(false);
    }, HIDE_DELAY_MS);
  }, [clearHideTimer]);

  const notify = useCallback(() => {
    setVisible(true);
    if (isFullscreen) {
      scheduleHide();
    }
  }, [isFullscreen, scheduleHide]);

  useEffect(() => {
    const onFsChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      if (fs) {
        setVisible(true);
        scheduleHide();
      } else {
        clearHideTimer();
        setVisible(true);
      }
    };

    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, [clearHideTimer, scheduleHide]);

  useEffect(() => {
    if (!isFullscreen) return;
    const handler = () => notify();
    window.addEventListener("mousemove", handler, { passive: true });
    window.addEventListener("touchstart", handler, { passive: true });
    window.addEventListener("keydown", handler);
    window.addEventListener("pointerdown", handler);
    return () => {
      window.removeEventListener("mousemove", handler);
      window.removeEventListener("touchstart", handler);
      window.removeEventListener("keydown", handler);
      window.removeEventListener("pointerdown", handler);
    };
  }, [isFullscreen, notify]);

  useEffect(() => () => clearHideTimer(), [clearHideTimer]);

  const value = useMemo(
    () => ({ visible, isFullscreen, notify }),
    [visible, isFullscreen, notify]
  );

  return (
    <ChromeVisibilityContext.Provider value={value}>
      {children}
    </ChromeVisibilityContext.Provider>
  );
}

export function useChromeVisibility() {
  const ctx = useContext(ChromeVisibilityContext);
  if (!ctx) {
    throw new Error(
      "useChromeVisibility must be used inside ChromeVisibilityProvider"
    );
  }
  return ctx;
}
