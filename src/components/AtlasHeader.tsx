"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useChromeVisibility } from "@/context/ChromeVisibilityContext";
import { FullscreenButton } from "./FullscreenButton";
import { NavigationPill } from "./NavigationPill";
import { ThemeToggle } from "./ThemeToggle";

export function AtlasHeader() {
  const pathname = usePathname();
  const { visible } = useChromeVisibility();

  const showNav = pathname === "/clock" || pathname === "/timer";

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          key="atlas-header"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.6, ease: [0.22, 0.94, 0.36, 1] }}
          className="relative z-30 flex w-full items-center justify-between gap-4 px-6 py-5 md:px-10"
        >
          <Link
            href="/"
            aria-label="Atlas Timer · home"
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
                style={{
                  clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
                }}
              />
              <span className="relative h-1 w-1 rounded-full bg-(--color-fg)" />
            </span>
            <span className="font-display text-[11px] font-semibold uppercase tracking-[0.32em]">
              Atlas Timer
            </span>
          </Link>

          {showNav && <NavigationPill />}

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <FullscreenButton />
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
