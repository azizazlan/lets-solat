import { For, Show, createMemo } from "solid-js";
import type { Prayer } from "@/types/prayers";
import { padZero } from "@/utils/time";
import PrayerRow from "./PrayerRow";

interface PrayerListProps {
  filteredPrayers: () => Prayer[];
  nextPrayer: () => Prayer | undefined;

  duhaDate: () => Date | undefined;
  syurukDate: () => Date | undefined;
}

export default function PrayerList(props: PrayerListProps) {
  // Memoize values so they’re only computed once per reactive update
  const nextPrayer = createMemo(() => props.nextPrayer());
  const duha = createMemo(() => props.duhaDate());
  const syuruk = createMemo(() => props.syurukDate());

  // Helper to format time safely
  const formatTime = (date?: Date) =>
    date ? `${padZero(date.getHours())}:${padZero(date.getMinutes())}` : "N/A";

  return (
    <div class="flex flex-col w-full h-full p-9">
      {/* Prayer list */}
      <div class="flex flex-col items-center">
        <For each={props.filteredPrayers()}>
          {(p) => (
            <PrayerRow prayer={p} active={p.time === nextPrayer()?.time} />
          )}
        </For>
      </div>

      {/* Duaha and Syuruk section */}
      <div class="flex flex-col">
        <div class="w-full flex flex-col items-center">
          <img src="/border.png" class="w-128" />
        </div>
        <div class="flex flex-row justify-between">
          {/* Duha */}
          <div class="text-7xl flex flex-col items-center">
            <div class="text-green-900 font-semibold">يبدأ الضحى الساعة</div>
            <div class="text-green-900 font-semibold">Duha</div>
            <div class="text-9xl font-semibold text-green-900">
              {formatTime(duha())}
            </div>
          </div>

          {/* Syuruk */}
          <div class="text-7xl flex flex-col items-center">
            <div class="font-black text-green-900">الشروق</div>
            <div class="text-7xl font-semibold text-green-900">Sunrise</div>
            <div class="text-9xl font-semibold text-orange-800">
              {formatTime(syuruk())}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
