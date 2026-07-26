// src/services/settings.ts
import { createSignal } from "solid-js";
import type { AppSettings, IqamahSettings } from "@/types/settings";

const STORAGE_KEY = "iqamah-settings";

export const DEFAULT: AppSettings = {
  iqamah: {
    alfajr: 18,
    dhuhr: 12,
    alasr: 10,
    maghrib: 10,
    alisha: 10,
  },
  poster: {
    isEnabled: false,
    imageUrls: [],
  },
  appEvents: [],
};

function loadSettings(): AppSettings {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw) {
    try {
      const parsed = JSON.parse(raw);

      return {
        ...DEFAULT,
        ...parsed,
        iqamah: {
          ...DEFAULT.iqamah,
          ...(parsed.iqamah || {}),
        },
        poster: (() => {
          const p = parsed.poster || {};
          const imageUrls = p.imageUrls ?? (
            p.imageUrl
              ? [p.imageUrl]
              : [...DEFAULT.poster.imageUrls]
          );
          return {
            ...DEFAULT.poster,
            ...p,
            imageUrls,
            imageUrl: undefined,
          };
        })(),
        appEvents: parsed.appEvents || [],
      };
    } catch {}
  }

  return DEFAULT;
}
const [settings, setSettings] = createSignal<AppSettings>(loadSettings());

export const useSettings = settings;

export function saveSettings(v: AppSettings) {
  setSettings(v);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
}

// helpers
export const msToMin = (ms: number) => Math.round(ms / 60000);
export const minToMs = (min: number) => min * 60000;

export function getIqamahDuration(prayer: keyof IqamahSettings) {
  return minToMs(settings().iqamah[prayer]);
}

export function getIqamahDurationInMins(prayer: keyof IqamahSettings) {
  return msToMin(getIqamahDuration(prayer));
}

export function isPosterEnabled() {
  return settings().poster.isEnabled;
}

export function getPosterCount() {
  const urls = settings().poster.imageUrls;
  if (!urls.length) return 1;
  return urls.length;
}

export function getPosterImageUrls() {
  return settings().poster.imageUrls;
}
