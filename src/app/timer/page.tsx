"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChromeVisibility } from "@/context/ChromeVisibilityContext";
import { useSettings } from "@/context/SettingsContext";
import { useTimerStore } from "@/context/TimerContext";
import { DurationInput } from "@/components/DurationInput";
import { PresetButton } from "@/components/PresetButton";
import { ProgressRing } from "@/components/ProgressRing";
import { SoundToggle } from "@/components/SoundToggle";
import { TimerControls } from "@/components/TimerControls";
import { TimerDisplay } from "@/components/TimerDisplay";

const PRESETS = [
  { label: "1 min", seconds: 60 },
  { label: "3 min", seconds: 180 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "15 min", seconds: 900 },
  { label: "25 min", seconds: 1500 },
];

const ALARM_MAX_MS = 10_000;

function playCompletionTone(): { stop: () => void } | null {
  try {
    const AudioCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtor();
    const now = ctx.currentTime;

    // Soft, well-spaced tones. Sine waves, fade in/out, total 4s of audio
    // inside a 10s budget. Volume ≤ 0.18.
    const pattern: Array<{ freq: number; start: number; dur: number }> = [
      { freq: 528, start: 0.0, dur: 1.4 },
      { freq: 660, start: 1.0, dur: 1.4 },
      { freq: 792, start: 2.4, dur: 1.6 },
    ];

    const oscillators: OscillatorNode[] = [];

    pattern.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(0.16, now + start + 0.25);
      gain.gain.setValueAtTime(0.16, now + start + dur - 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur + 0.05);
      oscillators.push(osc);
    });

    const closeTimer = window.setTimeout(() => {
      ctx.close().catch(() => {});
    }, ALARM_MAX_MS);

    return {
      stop: () => {
        window.clearTimeout(closeTimer);
        oscillators.forEach((o) => {
          try {
            o.stop();
          } catch {
            // already stopped
          }
        });
        ctx.close().catch(() => {});
      },
    };
  } catch {
    return null;
  }
}

export default function TimerPage() {
  const {
    durationMs,
    remainingMs,
    status,
    progress,
    selectedPresetSeconds,
    start,
    pause,
    reset,
    setDuration,
    setPreset,
    registerCompleteHandler,
  } = useTimerStore();
  const { sound } = useSettings();
  const { notify } = useChromeVisibility();

  const [ringSize, setRingSize] = useState(520);
  const audioPrimedRef = useRef(false);
  const activeToneRef = useRef<{ stop: () => void } | null>(null);

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

  const stopAlarm = useCallback(() => {
    if (activeToneRef.current) {
      activeToneRef.current.stop();
      activeToneRef.current = null;
    }
  }, []);

  useEffect(() => {
    const unregister = registerCompleteHandler(() => {
      if (audioPrimedRef.current && sound) {
        stopAlarm();
        activeToneRef.current = playCompletionTone();
      }
    });
    return unregister;
  }, [registerCompleteHandler, sound, stopAlarm]);

  useEffect(() => () => stopAlarm(), [stopAlarm]);

  const handlePreset = useCallback(
    (seconds: number) => {
      audioPrimedRef.current = true;
      stopAlarm();
      setPreset(seconds);
    },
    [setPreset, stopAlarm]
  );

  const handleDurationInput = useCallback(
    (seconds: number) => {
      audioPrimedRef.current = true;
      stopAlarm();
      setPreset(null);
      setDuration(seconds * 1000);
    },
    [setDuration, setPreset, stopAlarm]
  );

  const handleStart = useCallback(() => {
    audioPrimedRef.current = true;
    stopAlarm();
    start();
  }, [start, stopAlarm]);

  const handlePause = useCallback(() => {
    stopAlarm();
    pause();
  }, [pause, stopAlarm]);

  const handleReset = useCallback(() => {
    stopAlarm();
    reset();
  }, [reset, stopAlarm]);

  useEffect(() => {
    document.title =
      status === "running"
        ? `${Math.ceil(remainingMs / 1000)}s · Atlas Timer`
        : "Atlas Timer";
  }, [remainingMs, status]);

  const totalSeconds = Math.round(durationMs / 1000);
  const canStart = durationMs > 0 && status !== "complete";
  const { visible } = useChromeVisibility();

  return (
    <main
      className="relative z-10 flex flex-1 flex-col items-center justify-center gap-10 px-6 pb-16 md:px-10"
      data-chrome={visible ? "visible" : "hidden"}
      onMouseMove={notify}
    >
      <div className="relative flex items-center justify-center">
        <ProgressRing
          progress={progress}
          size={ringSize}
          active={status === "running" || status === "complete"}
        >
          <TimerDisplay remainingMs={remainingMs} status={status} />
        </ProgressRing>
      </div>

      <AnimatePresence>
        {visible && (
          <motion.div
            key="timer-controls"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: [0.22, 0.94, 0.36, 1] }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              {PRESETS.map((preset) => (
                <PresetButton
                  key={preset.seconds}
                  label={preset.label}
                  active={
                    selectedPresetSeconds === preset.seconds &&
                    status !== "running"
                  }
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
                onPause={handlePause}
                onReset={handleReset}
                canStart={canStart}
              />
              <div className="flex items-center gap-2">
                <SoundToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
