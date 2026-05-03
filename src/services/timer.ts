import { createSignal, createMemo } from "solid-js";
import type { Prayer } from "@/types/prayers";
import { timeToDate } from "@/utils/time";
import { playAlarm } from "@/utils/notification"; // adjust path
import { getIqamahDuration } from "@/services/settings";

export type Phase =
  | "WAITING_AZAN"
  | "DISPLAY_POSTER"
  | "DISPLAY_HADITHS"
  | "DISPLAY_APP_EVENTS"
  | "DISPLAY_PRAYER_TIMES"
  | "IQAMAH"
  | "POST_IQAMAH"
  | "BLACKOUT";

const DISPLAY_PHASES: Phase[] = [
  "WAITING_AZAN",
  "DISPLAY_POSTER",
  "DISPLAY_HADITHS",
  "DISPLAY_APP_EVENTS",
  "DISPLAY_PRAYER_TIMES",
];

const PHASE_DURATIONS: Record<Phase, number> = {
  WAITING_AZAN: 25000,
  DISPLAY_POSTER: 25000,
  DISPLAY_HADITHS: 15000,
  DISPLAY_APP_EVENTS: 15000,
  DISPLAY_PRAYER_TIMES: 15000,
  IQAMAH: 0,
  POST_IQAMAH: 0,
  BLACKOUT: 0,
};

// 10 seconds oscillates between WAITING_AZAN and BETWEEN_WAITING_AZAN
export const BETWEEN_DURATION = envNumber(
  import.meta.env.VITE_BETWEEN_AZAN_INTERVAL,
  10000, // default fallback (ms)
);
let displayEnd: number | null = null;
let displayIndex = 0;

const nextDisplayPhase = () => {
  displayIndex = (displayIndex + 1) % DISPLAY_PHASES.length;
  return DISPLAY_PHASES[displayIndex];
};

/* =======================
   TOLERANCES (CRITICAL)
======================= */
const AZAN_TOLERANCE_MS = 1000; // wall-clock sensitive
const PHASE_TOLERANCE_MS = 500; // relative timers

export const IQAMAH_IMAGE_DURATION = envNumber(
  import.meta.env.VITE_IQAMAH_IMAGE_DURATION,
  10000, // default fallback (ms)
);

export const POST_IQAMAH_DURATION = envNumber(
  import.meta.env.VITE_POST_IQAMAH_DURATION,
  30000, // default fallback (ms)
);

export const BLACKOUT_DURATION = envNumber(
  import.meta.env.VITE_BLACKOUT_DURATION,
  300000, // default fallback (ms)
);

export function envNumber(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function useTimer(imageCount = 14) {
  /* =======================
     STATE
  ======================= */
  const [now, setNow] = createSignal(new Date());
  const [prayers, setPrayers] = createSignal<Prayer[]>([]);
  const [phase, setPhase] = createSignal<Phase>("WAITING_AZAN");
  const [countdownSeconds, setCountdownSeconds] = createSignal<number>(0);
  const countdown = () => countdownSeconds();
  let lastDisplayed: number | null = null;
  const [imageIndex, setImageIndex] = createSignal(0);
  const [effectiveIqamahDuration, setEffectiveIqamahDuration] = createSignal(
    getIqamahDuration("alasr"),
  );

  /* Phase end markers */
  let iqamahEnd: number | null = null;
  let postIqamahEnd: number | null = null;
  let blackoutEnd: number | null = null;
  let iqamahImageEnd: number | null = null;

  /* =======================
     HELPERS
  ======================= */
  const shouldSkipPoster = (diffMs: number) => {
    return diffMs <= 3 * 60 * 1000; // 3 minutes
  };

  const filteredPrayers = createMemo(() =>
    prayers().filter((p) => p.en !== "Syuruk"),
  );

  const nextPrayer = createMemo(() => {
    const current = now();
    const list = filteredPrayers();
    if (!list.length) return undefined;

    return list.find((p) => timeToDate(p.time) > current) ?? list[0];
  });

  const lastPrayer = () => {
    const current = now();
    const list = filteredPrayers();
    if (!list.length) return undefined;

    // Find the last prayer that is before the current time
    return (
      [...list].reverse().find((p) => timeToDate(p.time) <= current) ??
      list[list.length - 1]
    );
  };

  const getNextPrayerTime = (current: Date, list: Prayer[]) => {
    if (!list.length) return null;

    const idx = list.findIndex((p) => timeToDate(p.time) > current);
    const isTomorrow = idx === -1;
    const resolvedIndex = idx === -1 ? 0 : idx;

    return timeToDate(list[resolvedIndex].time, isTomorrow ? 1 : 0);
  };

  /* =======================
     TIMER LOOP
  ======================= */
  const tick = () => {
    const current = new Date();
    const nowMs = current.getTime();

    setNow(current);

    const list = filteredPrayers(); // ✅ computed once
    if (!list.length) return;

    const np = nextPrayer(); // ✅ memoized

    let EFFECTIVE_IQAMAH_DURATION = getIqamahDuration("alasr");

    if (np?.en === "ALFAJR") {
      EFFECTIVE_IQAMAH_DURATION = getIqamahDuration("alfajr");
    } else if (np?.en === "DHUHR") {
      EFFECTIVE_IQAMAH_DURATION = getIqamahDuration("dhuhr");
    } else if (np?.en === "ALASR") {
      EFFECTIVE_IQAMAH_DURATION = getIqamahDuration("alasr");
    } else if (np?.en === "MAGHRIB") {
      EFFECTIVE_IQAMAH_DURATION = getIqamahDuration("maghrib");
    } else if (np?.en === "ALISHA") {
      EFFECTIVE_IQAMAH_DURATION = getIqamahDuration("alisha");
    }

    setEffectiveIqamahDuration(EFFECTIVE_IQAMAH_DURATION);

    switch (phase()) {
      case "WAITING_AZAN":
      case "DISPLAY_POSTER":
      case "DISPLAY_HADITHS":
      case "DISPLAY_APP_EVENTS":
      case "DISPLAY_PRAYER_TIMES": {
        const nextPrayerTime = getNextPrayerTime(current, list);
        if (!nextPrayerTime) return;

        const diff = nextPrayerTime.getTime() - nowMs;

        // 🔥 Azan reached (interrupt ANY display phase)
        if (diff <= AZAN_TOLERANCE_MS) {
          iqamahEnd = nowMs + EFFECTIVE_IQAMAH_DURATION;
          iqamahImageEnd = nowMs + IQAMAH_IMAGE_DURATION;

          // setCountdownSeconds(EFFECTIVE_IQAMAH_DURATION / 1000);

          const realSeconds = Math.ceil(diff / 1000);

          if (lastDisplayed === null) {
            lastDisplayed = realSeconds;
          } else {
            // Only allow decrement by 1 (broadcast smooth)
            if (realSeconds < lastDisplayed - 1) {
              lastDisplayed = lastDisplayed - 1;
            } else {
              lastDisplayed = realSeconds;
            }
          }

          setCountdownSeconds(lastDisplayed);

          setPhase("IQAMAH");

          displayEnd = null;
          displayIndex = 0;

          // 🔔 PLAY AZAN SOUND
          playAlarm();

          return;
        }

        // ⏱ Initialize phase timer
        if (!displayEnd) {
          displayEnd = nowMs + PHASE_DURATIONS[phase()];
        }

        const remaining = displayEnd - nowMs;

        if (remaining <= PHASE_TOLERANCE_MS) {
          // console.log(`phase ${phase()} duration ${PHASE_DURATIONS[phase()]}`);
          displayEnd = nowMs + PHASE_DURATIONS[phase()];

          let next = nextDisplayPhase();

          // ⛔ Skip DISPLAY_POSTER if close to azan
          if (next === "DISPLAY_POSTER" && shouldSkipPoster(diff)) {
            next = nextDisplayPhase(); // move to next again
          }

          setPhase(next);
          return;
        }

        // setCountdownSeconds(Math.ceil(diff / 1000));
        const realSeconds = Math.ceil(diff / 1000);

        if (lastDisplayed === null) {
          lastDisplayed = realSeconds;
        } else {
          // Only allow decrement by 1 (broadcast smooth)
          if (realSeconds < lastDisplayed - 1) {
            lastDisplayed = lastDisplayed - 1;
          } else {
            lastDisplayed = realSeconds;
          }
        }

        setCountdownSeconds(lastDisplayed);
        return;
      }

      /* =======================
         IQAMAH
      ======================= */
      case "IQAMAH": {
        if (!iqamahEnd) {
          iqamahEnd = nowMs + EFFECTIVE_IQAMAH_DURATION;
          iqamahImageEnd = nowMs + IQAMAH_IMAGE_DURATION;
        }

        // rotate images
        if (iqamahImageEnd && nowMs >= iqamahImageEnd) {
          setImageIndex((i) => (i + 1) % imageCount);
          iqamahImageEnd = nowMs + IQAMAH_IMAGE_DURATION;
        }

        const remaining = iqamahEnd - nowMs;

        if (remaining <= PHASE_TOLERANCE_MS) {
          postIqamahEnd = nowMs + POST_IQAMAH_DURATION;
          iqamahEnd = null;
          iqamahImageEnd = null;
          setPhase("POST_IQAMAH");
          return;
        }

        // setCountdownSeconds(Math.ceil(remaining / 1000));
        const realSeconds = Math.ceil(diff / 1000);

        if (lastDisplayed === null) {
          lastDisplayed = realSeconds;
        } else {
          // Only allow decrement by 1 (broadcast smooth)
          if (realSeconds < lastDisplayed - 1) {
            lastDisplayed = lastDisplayed - 1;
          } else {
            lastDisplayed = realSeconds;
          }
        }

        setCountdownSeconds(lastDisplayed);

        return;
      }

      /* =======================
         POST IQAMAH
      ======================= */
      case "POST_IQAMAH": {
        if (!postIqamahEnd) {
          postIqamahEnd = nowMs + POST_IQAMAH_DURATION;
        }

        const remaining = postIqamahEnd - nowMs;

        if (remaining <= PHASE_TOLERANCE_MS) {
          blackoutEnd = nowMs + BLACKOUT_DURATION;
          postIqamahEnd = null;
          setPhase("BLACKOUT");
          return;
        }

        // setCountdownSeconds(Math.ceil(remaining / 1000));

        const realSeconds = Math.ceil(diff / 1000);

        if (lastDisplayed === null) {
          lastDisplayed = realSeconds;
        } else {
          // Only allow decrement by 1 (broadcast smooth)
          if (realSeconds < lastDisplayed - 1) {
            lastDisplayed = lastDisplayed - 1;
          } else {
            lastDisplayed = realSeconds;
          }
        }

        setCountdownSeconds(lastDisplayed);

        return;
      }

      /* =======================
         BLACKOUT
      ======================= */
      case "BLACKOUT": {
        if (!blackoutEnd) {
          blackoutEnd = nowMs + BLACKOUT_DURATION;
        }

        const remaining = blackoutEnd - nowMs;

        if (remaining <= PHASE_TOLERANCE_MS) {
          blackoutEnd = null;
          setCountdownSeconds(0);
          setPhase("WAITING_AZAN");
          return;
        }

        // setCountdownSeconds(Math.ceil(remaining / 1000));
        const realSeconds = Math.ceil(diff / 1000);

        if (lastDisplayed === null) {
          lastDisplayed = realSeconds;
        } else {
          // Only allow decrement by 1 (broadcast smooth)
          if (realSeconds < lastDisplayed - 1) {
            lastDisplayed = lastDisplayed - 1;
          } else {
            lastDisplayed = realSeconds;
          }
        }

        setCountdownSeconds(lastDisplayed);
        return;
      }
    }
  };

  /* =======================
     CONTROLS
  ======================= */
  let timeoutId: number | undefined;

  /**
   * Schedules the next tick aligned to the real clock second boundary
   */
  const scheduleNextTick = () => {
    const now = Date.now();

    // Align to next exact second (e.g. 12:00:01.000)
    const delay = Math.max(1, 1000 - (now % 1000));

    timeoutId = window.setTimeout(() => {
      tick();
      scheduleNextTick();
    }, delay);
  };

  const startTimer = () => {
    stopTimer();
    tick(); // 👈 add this line (important)
    scheduleNextTick();
  };

  const stopTimer = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  const resetTimer = () => {
    stopTimer();
    iqamahEnd = null;
    postIqamahEnd = null;
    blackoutEnd = null;
    iqamahImageEnd = null;

    displayEnd = null;
    displayIndex = 0;

    setImageIndex(0);
    setCountdownSeconds(0);

    setPhase("WAITING_AZAN");
  };

  return {
    now,
    prayers,
    setPrayers,
    phase,
    countdownSeconds, // NUMBER only   countdownSeconds,
    imageIndex,
    filteredPrayers,
    nextPrayer,
    lastPrayer,
    startTimer,
    stopTimer,
    resetTimer,
    effectiveIqamahDuration,
  };
}
