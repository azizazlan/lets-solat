import { For, Show } from "solid-js";
import type { Prayer } from "@/types/prayers";
import { padZero } from "@/utils/time";
import PrayerRow from "./PrayerRow";
import DuhaRow from "./DuhaRow";

interface PrayerListProps {
  filteredPrayers: () => Prayer[];
  nextPrayer: () => Prayer | undefined;

  duhaDate: () => Date | undefined;
  syurukDate: () => Date | undefined;
}

export default function PrayerList(props: PrayerListProps) {
  return (
    <div class="flex flex-col w-full h-full pl-10 pr-10">
      <div class="flex-1 flex flex-col items-center">
        <For each={props.filteredPrayers()}>
          {(p) => (
            <PrayerRow
              prayer={p}
              active={p.time === props.nextPrayer()?.time}
            />
          )}
        </For>
        <div class="w-full flex flex-col items-center">
          <img src="/border.png" class="w-128" />
        </div>
      </div>
      <Show when={props.duhaDate() && props.syurukDate()}>
        <div class="flex flex-row bg-white px-7 justify-between">
          {/* Left column: Duha */}
          <div class="flex flex-col items-center justify-start leading-relaxed">
            <div
              class="text-7xl text-green-900 text-left font-semibold"
              dir="rtl"
            >
              يبدأ الضحى الساعة
            </div>

            <div class="text-7xl text-green-900 mt-5 font-semibold">
              DUHA BERMULA
            </div>

            <div class="text-9xl font-semibold text-green-900">
              {padZero(props.duhaDate().getHours())}:
              {padZero(props.duhaDate().getMinutes())}
            </div>
          </div>

          {/* Right column: Syuruk */}
          <div class="flex flex-col items-center justify-end leading-relaxed">
            <div class="font-black text-7xl text-green-900" dir="rtl">
              الشروق
            </div>
            <div class="font-semibold text-7xl text-green-900 text-right mt-5">
              MATAHARI TERBIT
            </div>

            <div class="text-9xl font-semibold text-right text-orange-800">
              {props.syurukDate()
                ? `${padZero(props.syurukDate().getHours())}:${padZero(
                    props.syurukDate().getMinutes(),
                  )}`
                : "N/A"}
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
