"use client";

import { useSyncExternalStore } from "react";

let cachedTime = 0;

function subscribe(notify: () => void) {
  cachedTime = Date.now();
  notify();
  const id = window.setInterval(() => {
    cachedTime = Date.now();
    notify();
  }, 1000);
  return () => window.clearInterval(id);
}

function getSnapshot() {
  return cachedTime;
}

function getServerSnapshot() {
  return 0;
}

export function useCurrentTime() {
  const ms = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return ms === 0 ? null : new Date(ms);
}
