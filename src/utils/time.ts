export const padZero = (n: number) =>
  n.toString().padStart(2, "0");

export function formatHMS(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${padZero(h)}:${padZero(m)}:${padZero(s)}`;
}

export function timeToDate(time: string, dayOffset = 0) {
  const lower = time.toLowerCase().trim();
  let hours = 0;
  let minutes = 0;

  if (lower.includes("am") || lower.includes("pm")) {
    const [raw, meridiem] = lower.split(" ");
    const [h, m] = raw.split(":").map(Number);
    hours = h;
    minutes = m;
    if (meridiem === "pm" && hours !== 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;
  } else {
    const [h, m] = lower.split(":").map(Number);
    hours = h;
    minutes = m;
  }

  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  d.setDate(d.getDate() + dayOffset);
  return d;
}

export const msToMinutes = (ms: number) => ms / 60000;