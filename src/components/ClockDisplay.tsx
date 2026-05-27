"use client";

import { motion } from "framer-motion";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { formatClock, formatDate, formatWeekday } from "@/lib/formatTime";
import { AnimatedNumber } from "./AnimatedDigit";

interface ClockDisplayProps {
  status?: string;
}

export function ClockDisplay({ status = "ATLAS AMBIENT CLOCK" }: ClockDisplayProps) {
  const now = useCurrentTime();

  if (!now) {
    return (
      <div className="flex flex-col items-center gap-6 opacity-0">
        <div className="font-display text-[18vw] leading-none md:text-[14vw] lg:text-[12vw]">
          00:00
        </div>
      </div>
    );
  }

  const { hours, minutes, seconds } = formatClock(now);
  const date = formatDate(now);
  const weekday = formatWeekday(now);
  const main = `${hours}:${minutes}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(20px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.2, ease: [0.22, 0.94, 0.36, 1] }}
      className="flex flex-col items-center gap-4 md:gap-6"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="text-[10px] font-medium uppercase tracking-[0.4em] text-(--color-fg-subtle) md:text-xs"
      >
        {status}
      </motion.span>

      <div className="relative">
        <h1 className="font-display text-[22vw] font-bold leading-[0.85] tracking-[-0.04em] md:text-[16vw] lg:text-[13vw]">
          <AnimatedNumber
            value={main}
            digitSize="xl"
            textClassName="chrome-text tabular"
          />
        </h1>

        <motion.div
          aria-hidden
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, var(--color-glow) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-(--color-fg-muted) md:text-xs">
        <span className="tabular">{seconds}s</span>
        <span className="h-px w-8 bg-(--color-line-strong)" />
        <span>{weekday}</span>
        <span className="h-px w-8 bg-(--color-line-strong)" />
        <span className="tabular">{date}</span>
      </div>
    </motion.div>
  );
}
