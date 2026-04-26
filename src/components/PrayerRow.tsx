import type { Prayer } from "@/types/prayers";
import { padZero, timeToDate } from "@/utils/time";

export default function PrayerRow(props: { prayer: Prayer; active: boolean }) {
  const d = timeToDate(props.prayer.time);

  return (
    <div class="w-full grid grid-cols-[1fr_auto_1fr] px-3 py-3 mb-15">
      <div
        class={`font-semibold ${props.active ? "text-9xl text-green-900 font-bold animate-pulse" : "text-9xl text-yellow-800"}`}
      >
        {props.prayer.en}
      </div>
      {/* Time */}
      <div
        class={`font-semibold ${props.active ? "text-9xl text-green-900 font-bold" : "text-9xl text-yellow-800"}`}
      >
        {padZero(d.getHours())}:{padZero(d.getMinutes())}
      </div>
      {/* Arabic */}
      <div
        class={`font-semibold ${props.active ? "text-9xl text-green-900 font-bold animate-pulse" : "text-9xl text-yellow-800"}`}
        dir="rtl"
      >
        {props.prayer.ar}
      </div>
    </div>
  );
}
