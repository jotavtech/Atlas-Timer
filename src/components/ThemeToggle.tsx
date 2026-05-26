"use client";

import { Moon, Sun, Waves } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme, type ThemeMode } from "@/context/ThemeContext";
import { cn } from "@/lib/cn";

const OPTIONS: { mode: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { mode: "light", label: "Light", Icon: Sun },
  { mode: "dark", label: "Dark", Icon: Moon },
  { mode: "relax", label: "Relax", Icon: Waves },
];

export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Modo visual"
      className="relative flex items-center gap-0.5 rounded-full border border-(--color-line-strong) bg-(--color-bg-elevated)/60 p-1 backdrop-blur-xl"
    >
      {OPTIONS.map(({ mode: m, label, Icon }) => {
        const active = mode === m;
        return (
          <motion.button
            key={m}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setMode(m)}
            whileTap={{ scale: 0.94 }}
            className={cn(
              "relative flex h-8 w-8 items-center justify-center rounded-full transition-colors",
              active
                ? "text-(--color-bg)"
                : "text-(--color-fg-muted) hover:text-(--color-fg)"
            )}
          >
            {active && (
              <motion.span
                layoutId="theme-pill"
                className="absolute inset-0 -z-0 rounded-full bg-(--color-fg)"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center">
              <Icon size={14} strokeWidth={1.6} />
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
