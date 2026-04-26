import { createEffect, createSignal } from "solid-js";
import type { Prayer } from "@/types/prayers";
import PrayerHorizList from "./PrayerHorizList";

export default function IqamahPanel(props: {
  countdown: string;
  filteredPrayers?: () => Prayer[];
  lastPrayer?: () => Prayer | undefined;
}) {
  return (
    <div class="h-full text-white flex flex-col w-full h-full justify-start items-center">
      <div class="text-9xl flex-1 flex flex-col items-center justify-center">
        <div dir="rtl" class="text-9xl font-bold">
          الإقامة
        </div>

        <div class="text-9xl font-bold">IQAMAH</div>

        <div class="text-[17vh] font-bold">{props.countdown}</div>
      </div>

      <PrayerHorizList
        filteredPrayers={props.filteredPrayers}
        lastPrayer={props.lastPrayer}
      />
    </div>
  );
}
