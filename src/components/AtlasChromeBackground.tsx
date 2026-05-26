"use client";

import { motion } from "framer-motion";

interface AtlasChromeBackgroundProps {
  intensity?: "ambient" | "active";
}

export function AtlasChromeBackground({
  intensity = "ambient",
}: AtlasChromeBackgroundProps) {
  const isActive = intensity === "active";

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
        }}
      />

      <motion.div
        className="chrome-blob"
        style={{
          width: "70vmax",
          height: "70vmax",
          left: "-15vmax",
          top: "-15vmax",
          background:
            "conic-gradient(from 90deg at 50% 50%, #2a2a2e, #c8c8c8, #6a6a64, #f4f4f0, #2a2a2e)",
          opacity: isActive ? 0.45 : 0.32,
        }}
        animate={{
          x: ["0%", "12%", "-8%", "0%"],
          y: ["0%", "-6%", "10%", "0%"],
          rotate: [0, 60, 120, 180],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="chrome-blob"
        style={{
          width: "60vmax",
          height: "60vmax",
          right: "-15vmax",
          bottom: "-15vmax",
          background:
            "radial-gradient(circle at 35% 35%, #f4f4f0 0%, #8c8c8c 35%, #1a1a1d 70%, transparent 100%)",
          opacity: isActive ? 0.5 : 0.35,
        }}
        animate={{
          x: ["0%", "-10%", "8%", "0%"],
          y: ["0%", "8%", "-6%", "0%"],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="chrome-blob"
        style={{
          width: "45vmax",
          height: "45vmax",
          left: "30%",
          top: "20%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(200,200,200,0.15) 40%, transparent 75%)",
          opacity: isActive ? 0.6 : 0.4,
          mixBlendMode: "overlay",
        }}
        animate={{
          x: ["0%", "-15%", "20%", "0%"],
          y: ["0%", "20%", "-10%", "0%"],
          scale: [1, 1.2, 0.85, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 50%, transparent 40%, var(--color-bg) 95%)",
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
