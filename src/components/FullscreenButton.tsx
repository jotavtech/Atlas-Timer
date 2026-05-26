"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useSyncExternalStore } from "react";

function subscribeFullscreen(notify: () => void) {
  document.addEventListener("fullscreenchange", notify);
  return () => document.removeEventListener("fullscreenchange", notify);
}

function getFullscreenSnapshot(): boolean {
  return !!document.fullscreenElement;
}

function getFullscreenServerSnapshot(): boolean {
  return false;
}

export function FullscreenButton() {
  const isFullscreen = useSyncExternalStore(
    subscribeFullscreen,
    getFullscreenSnapshot,
    getFullscreenServerSnapshot
  );

  const toggle = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // ignore — browser may block without direct gesture
    }
  }, []);

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={isFullscreen ? "Sair de tela cheia" : "Entrar em tela cheia"}
      whileTap={{ scale: 0.94 }}
      whileHover={{ y: -1 }}
      className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-(--color-line-strong) bg-(--color-bg-elevated)/60 backdrop-blur-xl transition-colors hover:border-(--color-fg)/40"
    >
      <span className="sr-only">{isFullscreen ? "Sair de tela cheia" : "Tela cheia"}</span>
      {isFullscreen ? (
        <Minimize2 strokeWidth={1.5} size={16} />
      ) : (
        <Maximize2 strokeWidth={1.5} size={16} />
      )}
    </motion.button>
  );
}
