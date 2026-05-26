"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const links = [
  { href: "/clock", label: "Clock" },
  { href: "/timer", label: "Timer" },
];

export function NavigationPill() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Atlas navigation"
      className="relative flex items-center gap-1 rounded-full border border-(--color-line-strong) bg-(--color-bg-elevated)/60 p-1 backdrop-blur-xl"
    >
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors",
              active
                ? "text-(--color-bg)"
                : "text-(--color-fg-muted) hover:text-(--color-fg)"
            )}
          >
            {active && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 -z-0 rounded-full bg-(--color-fg)"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
