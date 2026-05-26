"use client";

import { AtlasChromeBackground } from "@/components/AtlasChromeBackground";
import { ClockDisplay } from "@/components/ClockDisplay";
import { PageHeader } from "@/components/PageHeader";

export default function ClockPage() {
  return (
    <>
      <AtlasChromeBackground />
      <PageHeader />
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-20 md:px-10">
        <ClockDisplay status="ATLAS AMBIENT CLOCK · STILLNESS MODE" />
      </main>
    </>
  );
}
