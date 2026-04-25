import type { Prayer } from "@/types/prayers";
import { padZero, timeToDate } from "@/utils/time";

export default function PrayerRow(props: { prayer: Prayer; active: boolean }) {
  const d = timeToDate(props.prayer.time);

  const isSyuruk = props.prayer.en === "Syuruk";

  const textColor = props.active
    ? "darkgreen" // deep green (active)
    : isSyuruk
      ? "#f1c40f" // light orange (Syuruk)
      : "black"; // default

  const textTimeColor = props.active
    ? "darkgreen" // deep green (active)
    : isSyuruk
      ? "#f1c40f" // light orange (Syuruk)
      : "#c0392b"; // default

  return (
    <div
      class="w-full text-black grid grid-cols-[1fr_auto_1fr] px-3 py-3 mb-15"
      classList={{
        "font-black": props.active,
        "font-medium": !props.active,
      }}
      style={{ color: textColor }}
    >
      {/* English */}
      <div class="text-9xl">{props.prayer.en}</div>

      {/* Time */}
      <div
        class={`text-center text-9xl`}
        classList={{
          "font-black": props.active,
          "font-medium": !props.active,
        }}
        style={{ color: textTimeColor }}
      >
        {padZero(d.getHours())}:{padZero(d.getMinutes())}
      </div>

      {/* Arabic */}
      <div class={`text-9xl text-right`} dir="rtl">
        {props.prayer.ar}
      </div>
    </div>
  );
}
