"use client";

import { AnimatePresence, motion } from "framer-motion";

interface AnimatedDigitProps {
  value: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClass: Record<NonNullable<AnimatedDigitProps["size"]>, string> = {
  sm: "w-[0.55em]",
  md: "w-[0.6em]",
  lg: "w-[0.62em]",
  xl: "w-[0.62em]",
};

export function AnimatedDigit({ value, size = "lg" }: AnimatedDigitProps) {
  return (
    <span
      className={`relative inline-block overflow-hidden align-baseline ${sizeClass[size]}`}
      style={{ height: "1em", lineHeight: 1 }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.45, ease: [0.22, 0.94, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

interface AnimatedNumberProps {
  value: string;
  className?: string;
  digitSize?: AnimatedDigitProps["size"];
}

export function AnimatedNumber({
  value,
  className,
  digitSize = "lg",
}: AnimatedNumberProps) {
  return (
    <span className={className} style={{ display: "inline-flex" }}>
      {value.split("").map((char, idx) =>
        char === ":" ? (
          <span
            key={`sep-${idx}`}
            className="inline-block opacity-50"
            style={{ width: "0.3em", textAlign: "center" }}
          >
            :
          </span>
        ) : (
          <AnimatedDigit key={`d-${idx}-${char}`} value={char} size={digitSize} />
        )
      )}
    </span>
  );
}
