import { createMemo } from "solid-js";
import type { Prayer } from "@/types/prayers";
import PrayerHorizList from "@/components/PrayerHorizList";

function formatHMS(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function IqamahPanel(props: {
  countdownSeconds: number;
  filteredPrayers?: () => Prayer[];
  lastPrayer?: () => Prayer | undefined;
}) {
  const countdownText = createMemo(() => formatHMS(props.countdownSeconds));

  return (
    <div class="h-full w-full text-white flex flex-col justify-between items-center">
      {/* CENTER CONTENT */}
      <div class="flex-1 flex flex-col items-center justify-center leading-none">
        <div dir="rtl" class="text-9xl font-bold mb-6">
          الإقامة
        </div>

        <div class="text-9xl font-bold mb-10">IQAMAH</div>

        <div class="text-[12vh] font-bold tracking-wider text-white">
          {countdownText()}
        </div>
      </div>

      {/* BOTTOM PRAYER LIST */}
      <div class="w-full">
        <PrayerHorizList
          filteredPrayers={props.filteredPrayers}
          lastPrayer={props.lastPrayer}
        />
      </div>
    </div>
  );
}
