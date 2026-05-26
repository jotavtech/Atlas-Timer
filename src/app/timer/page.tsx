"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AtlasChromeBackground } from "@/components/AtlasChromeBackground";
import { DurationInput } from "@/components/DurationInput";
import { PageHeader } from "@/components/PageHeader";
import { PresetButton } from "@/components/PresetButton";
import { ProgressRing } from "@/components/ProgressRing";
import { TimerControls } from "@/components/TimerControls";
import { TimerDisplay } from "@/components/TimerDisplay";
import { useTimer } from "@/hooks/useTimer";

const PRESETS = [
  { label: "1 min", seconds: 60 },
  { label: "3 min", seconds: 180 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "15 min", seconds: 900 },
  { label: "25 min", seconds: 1500 },
];

const DEFAULT_SECONDS = 300;

function playCompletionTone() {
  try {
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = ctx.currentTime;

    const pattern: Array<{ freq: number; start: number; dur: number }> = [
      { freq: 880, start: 0, dur: 0.6 },
      { freq: 1320, start: 0.25, dur: 0.6 },
      { freq: 660, start: 0.65, dur: 0.9 },
    ];

    pattern.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(0.12, now + start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur + 0.05);
    });

    window.setTimeout(() => ctx.close(), 2500);
  } catch {
    // ignore
  }
}

export default function TimerPage() {
  const [activePresetSeconds, setActivePresetSeconds] = useState<number | null>(
    DEFAULT_SECONDS
  );
  const [ringSize, setRingSize] = useState(520);
  const audioPrimedRef = useRef(false);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const max = Math.min(w * 0.86, h * 0.62, 640);
      setRingSize(Math.max(280, Math.round(max)));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const handleComplete = useCallback(() => {
    if (audioPrimedRef.current) {
      playCompletionTone();
    }
  }, []);

  const { remainingMs, durationMs, status, progress, start, pause, reset, setDuration } =
    useTimer(DEFAULT_SECONDS * 1000, { onComplete: handleComplete });

  const handlePreset = useCallback(
    (seconds: number) => {
      audioPrimedRef.current = true;
      setActivePresetSeconds(seconds);
      setDuration(seconds * 1000);
    },
    [setDuration]
  );

  const handleDurationInput = useCallback(
    (seconds: number) => {
      audioPrimedRef.current = true;
      setActivePresetSeconds(null);
      setDuration(seconds * 1000);
    },
    [setDuration]
  );

  const handleStart = useCallback(() => {
    audioPrimedRef.current = true;
    start();
  }, [start]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    document.title =
      status === "running"
        ? `${Math.ceil(remainingMs / 1000)}s · Atlas Timer`
        : "Atlas Timer";
  }, [remainingMs, status]);

  const totalSeconds = Math.round(durationMs / 1000);
  const canStart = durationMs > 0 && status !== "complete";

  return (
    <>
      <AtlasChromeBackground intensity={status === "running" ? "active" : "ambient"} />
      <PageHeader />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-10 px-6 pb-16 md:px-10">
        <div className="relative flex items-center justify-center">
          <ProgressRing
            progress={progress}
            size={ringSize}
            active={status === "running" || status === "complete"}
          >
            <TimerDisplay remainingMs={remainingMs} status={status} />
          </ProgressRing>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PRESETS.map((preset) => (
              <PresetButton
                key={preset.seconds}
                label={preset.label}
                active={activePresetSeconds === preset.seconds && status !== "running"}
                onClick={() => handlePreset(preset.seconds)}
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-5 md:flex-row md:gap-6">
            <DurationInput
              totalSeconds={totalSeconds}
              disabled={status === "running" || status === "paused"}
              onChange={handleDurationInput}
            />
            <TimerControls
              status={status}
              onStart={handleStart}
              onPause={pause}
              onReset={handleReset}
              canStart={canStart}
            />
          </div>
        </div>
      </main>
    </>
  );
}
