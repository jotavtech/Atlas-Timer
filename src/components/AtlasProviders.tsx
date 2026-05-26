"use client";

import { ChromeVisibilityProvider } from "@/context/ChromeVisibilityContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { TimerProvider } from "@/context/TimerContext";

export function AtlasProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <TimerProvider>
          <ChromeVisibilityProvider>{children}</ChromeVisibilityProvider>
        </TimerProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
