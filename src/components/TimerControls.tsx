"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import type { TimerStatus } from "@/context/TimerContext";
import { cn } from "@/lib/cn";

interface TimerControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  canStart: boolean;
}

export function TimerControls({
  status,
  onStart,
  onPause,
  onReset,
  canStart,
}: TimerControlsProps) {
  const primaryLabel =
    status === "running" ? "Pause" : status === "paused" ? "Resume" : "Start";
  const primaryAction = status === "running" ? onPause : onStart;
  const PrimaryIcon = status === "running" ? Pause : Play;

  return (
    <div className="flex items-center gap-3">
      <motion.button
        type="button"
        onClick={primaryAction}
        disabled={!canStart && status !== "running"}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "group relative flex h-14 items-center gap-3 rounded-full border px-7 text-sm font-medium uppercase tracking-[0.22em] backdrop-blur-xl transition-all",
          "border-(--color-fg) bg-(--color-fg) text-(--color-bg)",
          "hover:shadow-[0_0_40px_-8px_var(--color-glow)]",
          "disabled:cursor-not-allowed disabled:opacity-40"
        )}
      >
        <PrimaryIcon size={16} strokeWidth={2} />
        <span>{primaryLabel}</span>
      </motion.button>

      <motion.button
        type="button"
        onClick={onReset}
        whileHover={{ y: -1, rotate: -8 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Reset"
        className="flex h-14 w-14 items-center justify-center rounded-full border border-(--color-line-strong) bg-(--color-bg-elevated)/60 text-(--color-fg-muted) backdrop-blur-xl transition-colors hover:border-(--color-fg)/40 hover:text-(--color-fg)"
      >
        <RotateCcw size={16} strokeWidth={1.75} />
      </motion.button>
    </div>
  );
}
