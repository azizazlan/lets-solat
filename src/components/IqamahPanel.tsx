import { createEffect, createSignal } from "solid-js";
import type { Prayer } from "@/types/prayers";
import PrayerHorizList from "./PrayerHorizList";
import { playAlarm } from "@/utils/notification";

export default function IqamahPanel(props: {
  countdown: string;
  filteredPrayers?: () => Prayer[];
  lastPrayer?: () => Prayer | undefined;
}) {
  const [alarmPlayed, setAlarmPlayed] = createSignal(false);

  createEffect(() => {
    if (!alarmPlayed()) {
      playAlarm();
      setAlarmPlayed(true);
    }
  });

  return (
    <div class="flex flex-col w-full h-full justify-start items-center">
      <div dir="rtl" class="text-4xl font-bold">
        الإقامة
      </div>

      <div class="text-4xl font-bold">IQAMAH</div>

      <div class="text-7xl font-bold">{props.countdown}</div>

      <div class="flex-grow"></div>

      <PrayerHorizList
        filteredPrayers={props.filteredPrayers}
        lastPrayer={props.lastPrayer}
      />
    </div>
  );
}
