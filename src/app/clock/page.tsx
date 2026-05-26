"use client";

import { useChromeVisibility } from "@/context/ChromeVisibilityContext";
import { ClockDisplay } from "@/components/ClockDisplay";

export default function ClockPage() {
  const { notify } = useChromeVisibility();
  return (
    <main
      className="relative z-10 flex flex-1 items-center justify-center px-6 pb-20 md:px-10"
      onMouseMove={notify}
    >
      <ClockDisplay status="ATLAS AMBIENT CLOCK · STILLNESS MODE" />
    </main>
  );
}
