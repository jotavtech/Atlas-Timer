"use client";

import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";

export function SoundToggle() {
  const { sound, toggleSound } = useSettings();

  return (
    <motion.button
      type="button"
      onClick={toggleSound}
      aria-pressed={sound}
      aria-label={sound ? "Silenciar alarme" : "Ativar alarme"}
      title={sound ? "Som ativo" : "Som silenciado"}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.94 }}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-(--color-line-strong) bg-(--color-bg-elevated)/60 text-(--color-fg-muted) backdrop-blur-xl transition-colors hover:border-(--color-fg)/40 hover:text-(--color-fg)"
    >
      {sound ? (
        <Volume2 size={15} strokeWidth={1.6} />
      ) : (
        <VolumeX size={15} strokeWidth={1.6} />
      )}
    </motion.button>
  );
}
