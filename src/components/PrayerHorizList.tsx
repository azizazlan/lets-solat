import { For, createMemo } from "solid-js";
import type { Prayer } from "@/types/prayers";

type Props = {
  filteredPrayers?: () => Prayer[];
  nextPrayer?: () => Prayer | undefined;
  lastPrayer?: () => Prayer | undefined;
  slimMode?: boolean;
};

export default function PrayerHorizList(props: Props) {
  // ✅ Decide active prayer safely + reactively
  const activePrayer = createMemo<Prayer | undefined>(() => {
    const last = props.lastPrayer ? props.lastPrayer() : undefined;
    if (last) return last;

    return props.nextPrayer ? props.nextPrayer() : undefined;
  });

  const isActive = (p: Prayer) => activePrayer()?.en === p.en;

  return (
    <div class="flex flex-row justify-between w-full pt-12 p-12">
      {/* Prayer list */}
      <For each={props.filteredPrayers?.() || []}>
        {(p) => {
          const active = createMemo(() => isActive(p));

          return (
            <div class="text-center">
              <div>
                <div
                  class={`mb-5 font-[Cairo] text-white ${active() ? "font-bold opacity-100 text-7xl" : "font-semibold opacity-60 text-6xl"}`}
                >
                  {p.ar}
                </div>
                <div
                  class={`mb-5 text-white ${active() ? "font-bold opacity-100 text-7xl" : "font-semibold opacity-60 text-6xl"}`}
                >
                  {p.en}
                </div>
              </div>
              <div
                class={`flex flex-col text-white uppercase ${active() ? "text-8xl font-bold opacity-100" : "text-7xl font-semibold opacity-60"}`}
              >
                <div>{p.time}</div>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}
