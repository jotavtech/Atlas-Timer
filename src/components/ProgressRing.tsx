"use client";

import { motion } from "framer-motion";

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  active?: boolean;
}

export function ProgressRing({
  progress,
  size = 520,
  strokeWidth = 1,
  children,
  active = false,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);

  return (
    <div className="relative isolate inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
        aria-hidden
      >
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-chrome-c)" />
            <stop offset="50%" stopColor="var(--color-chrome-a)" />
            <stop offset="100%" stopColor="var(--color-chrome-b)" />
          </linearGradient>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-line-strong)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ring-gradient)"
          strokeWidth={strokeWidth * 2}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            filter: active
              ? "drop-shadow(0 0 8px var(--color-glow))"
              : "drop-shadow(0 0 3px var(--color-glow))",
          }}
        />
      </svg>

      <div
        className="relative z-10 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {children}
      </div>
    </div>
  );
}
