import { Plus, Minus } from "lucide-solid";
import type { MiscSettings } from "@/types/settings";

const DEFAULT_VALUES: MiscSettings = {
  displayModeSecs: 30,
};

export default function MiscTab(props: {
  values?: MiscSettings;
  onChange: (v: MiscSettings) => void;
}) {
  const safeValues = () => props.values ?? DEFAULT_VALUES;

  const update = (key: keyof MiscSettings, value: number) => {
    const clamped = Math.max(5, Math.min(60, value));

    props.onChange({
      ...safeValues(),
      [key]: clamped,
    });
  };

  const row = (label: string, key: keyof MiscSettings) => (
    <div class="flex justify-between items-center text-black">
      <label class="text-black">{label}</label>

      <div class="flex items-center">
        <button
          onClick={() => update(key, safeValues()[key] - 1)}
          class="w-8 h-8 flex flex-col items-center justify-center border-2 border-black text-black"
        >
          <Minus />
        </button>

        <input
          type="number"
          min="10"
          max="60"
          value={safeValues()[key]}
          onInput={(e) => update(key, Number(e.currentTarget.value))}
          class="w-[5vh] h-[2vh] text-center mx-[1vh] text-black border border-black"
        />

        <button
          onClick={() => update(key, safeValues()[key] + 1)}
          class="w-8 h-8 flex flex-col items-center justify-center border-2 border-black text-black"
        >
          <Plus />
        </button>
      </div>
    </div>
  );

  return (
    <div class="bg-white text-black">
      {row("Display mode secs", "displayModeSecs")}
    </div>
  );
}
