"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface DurationInputProps {
  totalSeconds: number;
  disabled?: boolean;
  onChange: (totalSeconds: number) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function DurationInput({
  totalSeconds,
  disabled,
  onChange,
}: DurationInputProps) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  function commit(m: number, s: number) {
    const safeM = clamp(Number.isFinite(m) ? m : 0, 0, 999);
    const safeS = clamp(Number.isFinite(s) ? s : 0, 0, 59);
    onChange(safeM * 60 + safeS);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "flex items-center gap-2 rounded-2xl border border-(--color-line-strong) bg-(--color-bg-elevated)/60 px-4 py-2.5 backdrop-blur-xl",
        disabled && "opacity-40"
      )}
    >
      <div className="flex flex-col items-center">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={999}
          value={minutes}
          disabled={disabled}
          onChange={(e) => {
            const v = parseInt(e.target.value || "0", 10);
            commit(v, seconds);
          }}
          className="tabular w-16 bg-transparent text-center font-display text-3xl font-semibold tabular-nums tracking-tight text-(--color-fg) outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-(--color-fg-subtle)">
          Min
        </span>
      </div>
      <span className="-mt-3 text-2xl text-(--color-fg-subtle)">:</span>
      <div className="flex flex-col items-center">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={59}
          value={seconds.toString().padStart(2, "0")}
          disabled={disabled}
          onChange={(e) => {
            const v = parseInt(e.target.value || "0", 10);
            commit(minutes, v);
          }}
          className="tabular w-16 bg-transparent text-center font-display text-3xl font-semibold tabular-nums tracking-tight text-(--color-fg) outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-(--color-fg-subtle)">
          Sec
        </span>
      </div>
    </motion.div>
  );
}
