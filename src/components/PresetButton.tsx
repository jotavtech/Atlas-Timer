"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface PresetButtonProps {
  label: string;
  active?: boolean;
  onClick: () => void;
}

export function PresetButton({ label, active, onClick }: PresetButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.94 }}
      className={cn(
        "tabular relative rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] backdrop-blur-xl transition-colors",
        active
          ? "border-(--color-fg) bg-(--color-fg) text-(--color-bg)"
          : "border-(--color-line-strong) bg-(--color-bg-elevated)/60 text-(--color-fg-muted) hover:border-(--color-fg)/40 hover:text-(--color-fg)"
      )}
    >
      {label}
    </motion.button>
  );
}
