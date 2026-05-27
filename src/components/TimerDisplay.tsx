"use client";

import { motion } from "framer-motion";
import { formatTimerRemaining } from "@/lib/formatTime";
import type { TimerStatus } from "@/context/TimerContext";
import { AnimatedNumber } from "./AnimatedDigit";

interface TimerDisplayProps {
  remainingMs: number;
  status: TimerStatus;
}

const STATUS_LABEL: Record<TimerStatus, string> = {
  idle: "READY WHEN YOU ARE",
  running: "FOCUS IN PROGRESS",
  paused: "PAUSED",
  complete: "ATLAS SESSION COMPLETE",
};

export function TimerDisplay({ remainingMs, status }: TimerDisplayProps) {
  const { hours, minutes, seconds, showHours } = formatTimerRemaining(remainingMs);
  const value = showHours ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
  const complete = status === "complete";

  return (
    <div className="relative flex flex-col items-center gap-5">
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-[10px] font-medium uppercase tracking-[0.4em] text-(--color-fg-subtle) md:text-xs"
      >
        {STATUS_LABEL[status]}
      </motion.span>

      <motion.div
        animate={
          complete
            ? { scale: [1, 1.025, 1], filter: ["blur(0px)", "blur(1.5px)", "blur(0px)"] }
            : { scale: 1, filter: "blur(0px)" }
        }
        transition={
          complete
            ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.3 }
        }
        className="relative"
      >
        <h1 className="font-display tabular chrome-text text-[16vw] font-bold leading-[0.85] tracking-[-0.04em] md:text-[11vw] lg:text-[9vw]">
          <AnimatedNumber value={value} digitSize="xl" />
        </h1>

        <motion.div
          aria-hidden
          animate={{
            opacity: complete
              ? [0.3, 0.7, 0.3]
              : status === "running"
              ? [0.25, 0.45, 0.25]
              : 0.18,
          }}
          transition={{
            duration: complete ? 2 : 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, var(--color-glow) 0%, transparent 70%)",
          }}
        />
      </motion.div>
    </div>
  );
}
