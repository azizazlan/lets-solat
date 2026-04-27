import { For, Show } from "solid-js";
import type { Prayer } from "@/types/prayers";
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
      <Show when={props.duhaDate()}>
        <DuhaRow dateDuha={props.duhaDate()!} dateSyuruk={props.syurukDate()} />
      </Show>
    </div>
  );
}
