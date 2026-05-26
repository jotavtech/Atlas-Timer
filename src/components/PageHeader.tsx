"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FullscreenButton } from "./FullscreenButton";
import { NavigationPill } from "./NavigationPill";
import { ThemeToggle } from "./ThemeToggle";

export function PageHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative z-20 flex w-full items-center justify-between gap-4 px-6 py-5 md:px-10"
    >
      <Link
        href="/"
        className="group flex items-center gap-2.5 text-(--color-fg) transition-opacity hover:opacity-80"
      >
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
      </Link>

      <NavigationPill />

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <FullscreenButton />
      </div>
    </motion.header>
  );
}
