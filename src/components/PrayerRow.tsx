import type { Prayer } from "@/types/prayers";
import { padZero, timeToDate } from "@/utils/time";

export default function PrayerRow(props: { prayer: Prayer; active: boolean }) {
  const d = timeToDate(props.prayer.time);

  return (
    <div class="w-full grid grid-cols-3 items-center text-9xl mb-12">
      {/* Left (English) */}
      <div
        class={`text-left font-semibold ${
          props.active ? "text-green-900 font-bold" : "text-yellow-700"
        }`}
      >
        {props.prayer.en}
      </div>

      {/* Center (Time) */}
      <div
        class={`text-center font-semibold ${
          props.active ? "text-green-900 font-bold" : "text-yellow-700"
        }`}
      >
        {padZero(d.getHours())}:{padZero(d.getMinutes())}
      </div>

      {/* Right (Arabic) */}
      <div
        class={`text-right font-semibold ${
          props.active ? "text-green-900 font-bold" : "text-yellow-700"
        }`}
      >
        {props.prayer.ar}
      </div>
    </div>
  );
}
