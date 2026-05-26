"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Timer } from "lucide-react";
import { AtlasChromeBackground } from "@/components/AtlasChromeBackground";
import { FullscreenButton } from "@/components/FullscreenButton";
import { ThemeToggle } from "@/components/ThemeToggle";

const cards = [
  {
    href: "/clock",
    label: "Ambient Clock",
    description:
      "Display de hora premium para deixar no monitor. Tipografia cromada, fundo animado, estética OLED.",
    icon: Clock,
  },
  {
    href: "/timer",
    label: "Focus Timer",
    description:
      "Timer com presets rápidos, progress ring e finalização cinematográfica. Para foco profundo.",
    icon: Timer,
  },
];

export default function Home() {
  return (
    <>
      <AtlasChromeBackground />

      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 flex w-full items-center justify-between gap-4 px-6 py-5 md:px-10"
      >
        <span className="flex items-center gap-2.5 text-(--color-fg)">
          <span
            aria-hidden
            className="relative flex h-6 w-6 items-center justify-center"
          >
            <span
              className="absolute inset-0 rounded-full border border-(--color-fg)"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }}
            />
            <span
              className="absolute inset-0 rounded-full border border-(--color-fg-muted)"
              style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }}
            />
            <span className="relative h-1 w-1 rounded-full bg-(--color-fg)" />
          </span>
          <span className="font-display text-[11px] font-semibold uppercase tracking-[0.32em]">
            Atlas Timer
          </span>
        </span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <FullscreenButton />
        </div>
      </motion.header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(20px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.22, 0.94, 0.36, 1] }}
          className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-(--color-fg-subtle) md:text-xs">
            Atlas · Time Display
          </span>
          <h1 className="font-display chrome-text max-w-3xl text-balance text-5xl font-bold leading-[0.95] tracking-[-0.04em] md:text-7xl lg:text-8xl">
            Time, in its <em className="not-italic">stillest</em> form.
          </h1>
          <p className="max-w-xl text-balance text-sm leading-relaxed text-(--color-fg-muted) md:text-base">
            Um objeto digital de mesa. Relógio ambiente e timer de foco — pensados
            para ficarem no monitor enquanto o trabalho profundo acontece.
          </p>
        </motion.div>

        <div className="grid w-full max-w-4xl gap-4 md:grid-cols-2">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + idx * 0.1,
                  ease: [0.22, 0.94, 0.36, 1],
                }}
              >
                <Link
                  href={card.href}
                  className="group relative flex h-full flex-col gap-6 overflow-hidden rounded-3xl border border-(--color-line-strong) bg-(--color-bg-elevated)/60 p-7 backdrop-blur-2xl transition-all hover:border-(--color-fg)/40 hover:shadow-[0_30px_80px_-30px_var(--color-glow)]"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(ellipse 70% 50% at 50% 0%, var(--color-glow) 0%, transparent 70%)",
                    }}
                  />

                  <div className="relative flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-(--color-line-strong) bg-(--color-bg-soft)/70">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <ArrowUpRight
                      size={20}
                      strokeWidth={1.5}
                      className="text-(--color-fg-subtle) transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-(--color-fg)"
                    />
                  </div>

                  <div className="relative flex flex-col gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-(--color-fg-subtle)">
                      Open
                    </span>
                    <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] md:text-4xl">
                      {card.label}
                    </h2>
                    <p className="text-sm leading-relaxed text-(--color-fg-muted)">
                      {card.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-16 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-(--color-fg-subtle)"
        >
          <span className="h-px w-12 bg-(--color-line-strong)" />
          <span>Stillness mode</span>
          <span className="h-px w-12 bg-(--color-line-strong)" />
        </motion.div>
      </main>
    </>
  );
}
