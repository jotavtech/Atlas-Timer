"use client";

import { useChromeVisibility } from "@/context/ChromeVisibilityContext";
import { useTimerStore } from "@/context/TimerContext";
import { AtlasChromeBackground } from "./AtlasChromeBackground";
import { AtlasHeader } from "./AtlasHeader";

export function AtlasShell({ children }: { children: React.ReactNode }) {
  const { status } = useTimerStore();
  const { isFullscreen } = useChromeVisibility();

  return (
    <div
      className="relative flex h-screen flex-col overflow-hidden"
      data-fullscreen={isFullscreen ? "true" : "false"}
    >
      <AtlasChromeBackground
        intensity={status === "running" ? "active" : "ambient"}
      />
      <AtlasHeader />
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
}
