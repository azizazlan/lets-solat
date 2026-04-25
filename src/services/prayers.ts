import type { Prayer } from "@/types/prayers";

const JAWI_FILE = import.meta.env.VITE_JAWI_FILE;

const MAP: Omit<Prayer, "time">[] = [
  { en: "ALFAJR", ar: "الفجر" },
  { en: "Syuruk", ar: "الشروق" },
  { en: "DHUHR", ar: "الظهر" },
  { en: "ALASR", ar: "العصر" },
  { en: "MAGHRIB", ar: "المغرب" },
  { en: "ALISHA", ar: "العشاء" },
];

export async function loadTodayPrayers(): Promise<Prayer[] | null> {
  try {
    const res = await fetch(`/data/${JAWI_FILE}`);
    const text = await res.text();

    const today = new Date().toLocaleDateString("en-GB"); // DD/MM/YYYY

    const lines = text.trim().split("\n");

    for (const line of lines) {
      const cols = line.split(",");

      // CSV date is like: 15-Dec-2025
      const csvDate = new Date(cols[0]).toLocaleDateString("en-GB");

      if (csvDate === today) {
        // cols:
        // 0 Date
        // 1 Hijri
        // 2 Day
        // 3 Imsak ❌
        // 4 Subuh
        // 5 Syuruk
        // 6 Zohor
        // 7 Asar
        // 8 Maghrib
        // 9 Isyak

        return MAP.map((p, i) => ({
          ...p,
          time: cols[i + 4].trim(), // skip Imsak
        }));
      }
    }

    return null;
  } catch (e) {
    console.error("Failed to load takwim", e);
    return null;
  }
}
