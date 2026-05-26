"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface AtlasChromeBackgroundProps {
  intensity?: "ambient" | "active";
}

export function AtlasChromeBackground({
  intensity = "ambient",
}: AtlasChromeBackgroundProps) {
  const { mode } = useTheme();
  const isActive = intensity === "active";
  const isRelax = mode === "relax";
  const isLight = mode === "light";

  // Slower, more meditative in Relax. Faster, more present in Dark/Light.
  const speed = isRelax ? 1.8 : 1;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // First mount: drop the initial fade-in animation so the background
  // doesn't visibly "appear" on first paint (it was already painted by SSR bg).
  const initial = mounted ? false : undefined;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-(--color-bg)" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, var(--color-bg-soft) 0%, transparent 60%), radial-gradient(ellipse 60% 70% at 50% 100%, var(--color-bg-elevated) 0%, transparent 70%)",
          opacity: isRelax ? 0.6 : 1,
        }}
      />

      {/* Blob A — chrome conic */}
      <motion.div
        key={`blob-a-${mode}`}
        initial={initial}
        className="chrome-blob"
        style={{
          width: "70vmax",
          height: "70vmax",
          left: "-15vmax",
          top: "-15vmax",
          background: isRelax
            ? "conic-gradient(from 90deg at 50% 50%, #0a0a0d, #2a2a2e, #1a1a1d, #3a3a3e, #0a0a0d)"
            : "conic-gradient(from 90deg at 50% 50%, #2a2a2e, #c8c8c8, #6a6a64, #f4f4f0, #2a2a2e)",
          opacity:
            (isActive ? 0.6 : 0.45) *
            (isRelax ? 0.32 : isLight ? 1.05 : 0.75),
        }}
        animate={{
          x: ["0%", "10%", "-6%", "0%"],
          y: ["0%", "-5%", "8%", "0%"],
          rotate: [0, 60, 120, 180],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{
          duration: 32 * speed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Blob B — radial chrome */}
      <motion.div
        key={`blob-b-${mode}`}
        initial={initial}
        className="chrome-blob"
        style={{
          width: "60vmax",
          height: "60vmax",
          right: "-15vmax",
          bottom: "-15vmax",
          background: isRelax
            ? "radial-gradient(circle at 35% 35%, rgba(220,220,220,0.18) 0%, rgba(80,80,84,0.12) 35%, rgba(8,8,10,0.6) 70%, transparent 100%)"
            : "radial-gradient(circle at 35% 35%, #f4f4f0 0%, #8c8c8c 35%, #1a1a1d 70%, transparent 100%)",
          opacity:
            (isActive ? 0.55 : 0.4) *
            (isRelax ? 0.4 : isLight ? 1.05 : 0.85),
        }}
        animate={{
          x: ["0%", "-8%", "6%", "0%"],
          y: ["0%", "6%", "-5%", "0%"],
          scale: [1, 1.12, 0.92, 1],
        }}
        transition={{
          duration: 28 * speed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Highlight — soft top light */}
      <motion.div
        key={`blob-c-${mode}`}
        initial={initial}
        className="chrome-blob"
        style={{
          width: "45vmax",
          height: "45vmax",
          left: "30%",
          top: "20%",
          background: isRelax
            ? "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(200,200,200,0.04) 40%, transparent 75%)"
            : "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(200,200,200,0.15) 40%, transparent 75%)",
          opacity:
            (isActive ? 0.6 : 0.42) * (isRelax ? 0.5 : 1),
          mixBlendMode: isRelax ? "screen" : "overlay",
        }}
        animate={{
          x: ["0%", "-12%", "16%", "0%"],
          y: ["0%", "16%", "-8%", "0%"],
          scale: [1, 1.18, 0.88, 1],
        }}
        transition={{
          duration: 24 * speed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: isRelax
            ? "radial-gradient(ellipse 70% 55% at 50% 50%, transparent 35%, var(--color-bg) 88%)"
            : "radial-gradient(ellipse 90% 60% at 50% 50%, transparent 40%, var(--color-bg) 95%)",
        }}
      />

      <div className="grid-overlay" />
      <div className="noise" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, transparent 60%, var(--color-bg) 100%)",
        }}
      />
    </div>
  );
}
