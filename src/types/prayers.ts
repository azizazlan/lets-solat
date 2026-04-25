export type Prayer = {
  en: string;
  ar: string;
  time: string;
};

export const defaultPrayers: Prayer[] = [
  { en: "ALFAJR", ar: "الفجر", time: "05:47" },
  { en: "Syuruk", ar: "الشروق", time: "07:01" },
  { en: "DUHUR", ar: "الظهر", time: "13:00" },
  { en: "ALASR", ar: "العصر", time: "16:24" },
  { en: "MAGHRIB", ar: "المغرب", time: "19:00" },
  { en: "ALISHA'", ar: "العشاء", time: "20:11" },
];
