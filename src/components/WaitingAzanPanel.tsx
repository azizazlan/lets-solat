import { createMemo } from "solid-js";
import PrayerHorizList from "@/components/PrayerHorizList";

export default function WaitingAzanPanel(props: {
  prayer?: Prayer;
  countdownSeconds: number;
  filteredPrayers?: () => Prayer[];
  nextPrayer?: () => Prayer | undefined;
  lastPrayer?: () => Prayer | undefined;
}) {
  const countdownText = createMemo(() => {
    const total = props.countdownSeconds;

    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  });

  const isUrgent = createMemo(() => props.countdownSeconds < 180);

  return (
    <div class="h-full flex flex-col text-white">
      <div class="flex-1 flex flex-col items-center justify-center contain-layout leading-relaxed">
        <div class="text-9xl font-bold text-center mb-9" dir="rtl">
          الأذان القادم {props.prayer?.ar}
        </div>

        <div class="mt-9 text-9xl font-bold">AZAN {props.prayer?.en}</div>

        <div
          class={`tracking-wider font-bold text-[12vh] ${isUrgent() ? "text-red-500" : "text-white"}`}
        >
          {countdownText()}
        </div>
      </div>

      <PrayerHorizList
        filteredPrayers={props.filteredPrayers}
        nextPrayer={props.nextPrayer}
      />
    </div>
  );
}
