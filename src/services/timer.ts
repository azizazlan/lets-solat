import { createSignal } from "solid-js";
import type { Prayer } from "@/types/prayers";
import { formatHMS, timeToDate } from "@/utils/time";
export type Phase =
  | "WAITING_AZAN"
  | "BETWEEN_WAITING_AZAN"
  | "IQAMAH"
  | "POST_IQAMAH"
  | "BLACKOUT";
import { getIqamahDuration } from "@/services/settings";

// 10 seconds oscillates between WAITING_AZAN and BETWEEN_WAITING_AZAN
export const BETWEEN_DURATION = envNumber(
  import.meta.env.VITE_BETWEEN_AZAN_INTERVAL,
  10000, // default fallback (ms)
);
let betweenEnd: number | null = null;
let waitingEnd: number | null = null; // 👈 NEW

/* =======================
   TOLERANCES (CRITICAL)
======================= */
const AZAN_TOLERANCE_MS = 1000; // wall-clock sensitive
const PHASE_TOLERANCE_MS = 250; // relative timers

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
  const [countdown, setCountdown] = createSignal("00:00:00");
  const [imageIndex, setImageIndex] = createSignal(0);
  const [effectiveIqamahDuration, setEffectiveIqamahDuration] = createSignal(
    getIqamahDuration("alasr"),
  );

  let intervalId: number | undefined;

  /* Phase end markers */
  let iqamahEnd: number | null = null;
  let postIqamahEnd: number | null = null;
  let blackoutEnd: number | null = null;
  let iqamahImageEnd: number | null = null;

  /* =======================
     HELPERS
  ======================= */
  const filteredPrayers = () => prayers().filter((p) => p.en !== "Syuruk");

  const nextPrayer = () => {
    const current = now();
    const list = filteredPrayers();
    if (!list.length) return undefined;

    return list.find((p) => timeToDate(p.time) > current) ?? list[0];
  };

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

  const getNextPrayerTime = (current: Date) => {
    const list = filteredPrayers();
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

    if (!prayers().length) return;

    let EFFECTIVE_IQAMAH_DURATION = getIqamahDuration("alasr");
    const np = nextPrayer();
    if (np && np.en === "ALFAJR") {
      EFFECTIVE_IQAMAH_DURATION = getIqamahDuration("alfajr"); // 18 minutes for Fajr
      setEffectiveIqamahDuration(EFFECTIVE_IQAMAH_DURATION);
    } else if (np && np.en === "DHUHR") {
      EFFECTIVE_IQAMAH_DURATION = getIqamahDuration("dhuhr");
      setEffectiveIqamahDuration(EFFECTIVE_IQAMAH_DURATION);
    } else if (np && np.en === "ALASR") {
      EFFECTIVE_IQAMAH_DURATION = getIqamahDuration("alasr");
      setEffectiveIqamahDuration(EFFECTIVE_IQAMAH_DURATION);
    } else if (np && np.en === "MAGHRIB") {
      EFFECTIVE_IQAMAH_DURATION = getIqamahDuration("maghrib");
      setEffectiveIqamahDuration(EFFECTIVE_IQAMAH_DURATION);
    } else if (np && np.en === "ALISHA") {
      EFFECTIVE_IQAMAH_DURATION = getIqamahDuration("alisha");
      setEffectiveIqamahDuration(EFFECTIVE_IQAMAH_DURATION);
    } else {
      setEffectiveIqamahDuration(EFFECTIVE_IQAMAH_DURATION);
    }

    switch (phase()) {
      /* =======================
         AZAN
      ======================= */
      case "WAITING_AZAN": {
        const nextPrayerTime = getNextPrayerTime(current);
        if (!nextPrayerTime) return;

        const diff = nextPrayerTime.getTime() - nowMs;

        // 🔥 Azan reached
        if (diff <= AZAN_TOLERANCE_MS) {
          iqamahEnd = nowMs + EFFECTIVE_IQAMAH_DURATION;
          iqamahImageEnd = nowMs + IQAMAH_IMAGE_DURATION;
          setCountdown(formatHMS(EFFECTIVE_IQAMAH_DURATION));
          setPhase("IQAMAH");
          return;
        }

        // ⏱ Initialize WAITING phase timer
        if (!waitingEnd) {
          waitingEnd = nowMs + BETWEEN_DURATION;
        }

        const remaining = waitingEnd - nowMs;

        if (remaining <= PHASE_TOLERANCE_MS) {
          waitingEnd = null;
          betweenEnd = nowMs + BETWEEN_DURATION;
          setPhase("BETWEEN_WAITING_AZAN");
          return;
        }

        // ✅ Show REAL azan countdown here
        setCountdown(formatHMS(diff));
        return;
      }

      case "BETWEEN_WAITING_AZAN": {
        const nextPrayerTime = getNextPrayerTime(current);
        if (!nextPrayerTime) return;

        const diff = nextPrayerTime.getTime() - nowMs;

        // 🔥 Azan reached
        if (diff <= AZAN_TOLERANCE_MS) {
          iqamahEnd = nowMs + EFFECTIVE_IQAMAH_DURATION;
          iqamahImageEnd = nowMs + IQAMAH_IMAGE_DURATION;
          setCountdown(formatHMS(EFFECTIVE_IQAMAH_DURATION));
          setPhase("IQAMAH");
          return;
        }

        if (!betweenEnd) {
          betweenEnd = nowMs + BETWEEN_DURATION;
        }

        const remaining = betweenEnd - nowMs;

        if (remaining <= PHASE_TOLERANCE_MS) {
          betweenEnd = null;
          waitingEnd = nowMs + BETWEEN_DURATION;
          setPhase("WAITING_AZAN");
          return;
        }

        // ✅ Show 10s loop countdown
        setCountdown(formatHMS(diff));
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

        setCountdown(formatHMS(remaining));
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

        setCountdown(formatHMS(remaining));
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
          setCountdown("00:00:00");
          setPhase("WAITING_AZAN");
          return;
        }

        setCountdown(formatHMS(remaining));
        return;
      }
    }
  };

  /* =======================
     CONTROLS
  ======================= */
  const startTimer = () => {
    stopTimer();
    intervalId = window.setInterval(tick, 1000);
  };

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  };

  const resetTimer = () => {
    stopTimer();
    iqamahEnd = null;
    postIqamahEnd = null;
    blackoutEnd = null;
    iqamahImageEnd = null;
    betweenEnd = null; // ✅
    waitingEnd = null; // ✅
    setImageIndex(0);
    setCountdown("00:00:00");
    setPhase("WAITING_AZAN");
  };

  return {
    now,
    prayers,
    setPrayers,
    phase,
    countdown,
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
