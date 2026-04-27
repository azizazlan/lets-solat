import { createMemo } from "solid-js";
import PrayerHorizList from "./PrayerHorizList";
import type { Prayer } from "@/types/prayers";

/* =======================
   Isolated countdown
======================= */
function CountdownText(props: { value: string }) {
  return (
    <div class={`text-[12vh] font-bold will-change-transform`}>
      {props.value}
    </div>
  );
}

/* =======================
   Main panel
======================= */
export default function WaitingAzanPanel(props: {
  prayer?: Prayer;
  countdown: string;
  filteredPrayers?: () => Prayer[];
  nextPrayer?: () => Prayer | undefined;
  lastPrayer?: () => Prayer | undefined;
}) {
  return (
    <div class="h-full flex flex-col text-white">
      {/* =======================
         MAIN CONTENT
      ======================= */}
      <div class="flex-1 flex flex-col items-center justify-center contain-layout leading-relaxed">
        {/* Arabic */}
        <div class="text-9xl font-bold text-center mb-9" dir="rtl">
          الأذان القادم {props.prayer?.ar}
        </div>

        {/* English */}
        <div class="mt-9 text-9xl font-bold">AZAN {props.prayer?.en}</div>

        {/* Countdown (isolated) */}
        <CountdownText value={props.countdown} />
      </div>

      {/* =======================
         BOTTOM PANEL
      ======================= */}
      <PrayerHorizList
        filteredPrayers={props.filteredPrayers}
        nextPrayer={props.nextPrayer}
      />
    </div>
  );
}
