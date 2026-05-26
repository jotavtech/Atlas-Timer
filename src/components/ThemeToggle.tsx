"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeMode } from "@/hooks/useThemeMode";

export function ThemeToggle() {
  const { mode, toggle } = useThemeMode();

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label="Alternar tema"
      aria-pressed={mode === "dark"}
      whileTap={{ scale: 0.94 }}
      whileHover={{ y: -1 }}
      className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-(--color-line-strong) bg-(--color-bg-elevated)/60 backdrop-blur-xl transition-colors hover:border-(--color-fg)/40"
    >
      <span className="sr-only">Alternar tema</span>
      <motion.span
        key={mode}
        initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-(--color-fg)"
      >
        {mode === "dark" ? (
          <Sun strokeWidth={1.5} size={16} />
        ) : (
          <Moon strokeWidth={1.5} size={16} />
        )}
      </motion.span>
    </motion.button>
  );
}
