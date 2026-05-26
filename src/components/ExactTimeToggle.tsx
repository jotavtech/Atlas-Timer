"use client";

import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";

export function ExactTimeToggle() {
  const { exactTime, toggleExactTime } = useSettings();

  return (
    <motion.button
      type="button"
      onClick={toggleExactTime}
      aria-pressed={exactTime}
      aria-label={
        exactTime ? "Esconder tempo numérico" : "Mostrar tempo numérico"
      }
      title={exactTime ? "Esconder tempo" : "Mostrar tempo"}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.94 }}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-(--color-line-strong) bg-(--color-bg-elevated)/60 text-(--color-fg-muted) backdrop-blur-xl transition-colors hover:border-(--color-fg)/40 hover:text-(--color-fg)"
    >
      {exactTime ? (
        <Eye size={15} strokeWidth={1.6} />
      ) : (
        <EyeOff size={15} strokeWidth={1.6} />
      )}
    </motion.button>
  );
}
