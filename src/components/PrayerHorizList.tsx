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
              <div class="">
                <div
                  class="font-[Cairo] text-7xl text-white"
                  classList={{
                    "font-bold opacity-100": active(),
                    "font-normal opacity-50": !active(),
                  }}
                >
                  {p.ar}
                </div>

                <div
                  class="text-7xl text-white"
                  classList={{
                    "font-bold opacity-100": active(),
                    "font-normal opacity-50": !active(),
                  }}
                >
                  {p.en}
                </div>
              </div>

              {/* Time + iqamah */}
              <div
                class="flex flex-col text-7xl text-white uppercase"
                classList={{
                  "font-bold opacity-100": active(),
                  "font-normal opacity-50": !active(),
                }}
              >
                <div>{p.time}</div>

                <div class="text-xl opacity-70 normal-case">
                  {(() => {
                    const key = toIqamahKey(p.en);
                    if (!key) return null;

                    return `(IQMH ${getIqamahDurationInMins(key)} mins)`;
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
