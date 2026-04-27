import { For, createMemo } from "solid-js";
import type { Prayer } from "@/types/prayers";
import type { IqamahSettings } from "@/types/settings";
import { getIqamahDurationInMins } from "@/services/settings";

type IqamahKey = keyof IqamahSettings;

function toIqamahKey(en: string): IqamahKey | null {
  const key = en.toLowerCase();

  if (
    key === "alfajr" ||
    key === "dhuhr" ||
    key === "alasr" ||
    key === "maghrib" ||
    key === "alisha"
  ) {
    return key;
  }

  return null;
}

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
    <div
      class="flex flex-row justify-between w-full p-5"
      style={{ background: "#155400" }}
    >
      {/* Prayer list */}
      <For each={props.filteredPrayers?.() || []}>
        {(p) => {
          const active = createMemo(() => isActive(p));

          return (
            <div class="text-center">
              {/* Arabic + English */}
              <div>
                <div
                  class={`mb-5 font-[Cairo] text-white ${active() ? "font-bold opacity-100 text-7xl" : "font-normal opacity-50 text-5xl"}`}
                >
                  {p.ar}
                </div>

                <div
                  class={`mb-5 text-white ${active() ? "font-bold opacity-100 text-6xl" : "font-normal opacity-50 text-5xl"}`}
                >
                  {p.en}
                </div>
              </div>

              {/* Time + iqamah */}
              <div
                class={`flex flex-col text-8xl text-white uppercase ${active() ? "font-bold opacity-100 animate-pulse" : "font-normal opacity-50"}`}
              >
                <div>{p.time}</div>

                <div class="text-xl opacity-70 normal-case">
                  {(() => {
                    const key = toIqamahKey(p.en);
                    if (!key) return null;
                    return `IQMH ${getIqamahDurationInMins(key)} mins`;
                  })()}
                </div>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}
