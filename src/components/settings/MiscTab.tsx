import type { MiscSettings } from "@/types/settings";

const DEFAULT_VALUES: MiscSettings = {
  leftPanelIntervalSecs: 15,
};

export default function MiscTab(props: {
  values?: MiscSettings;
  onChange: (v: MiscSettings) => void;
}) {
  const safeValues = () => props.values ?? DEFAULT_VALUES;

  const update = (key: keyof MiscSettings, value: number) => {
    const clamped = Math.max(15, Math.min(60, value));

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
          class="w-15 h-8 flex flex-col items-center justify-center border-2 border-black text-black"
        >
          Minus
        </button>

        <input
          type="number"
          min="10"
          max="60"
          value={safeValues()[key]}
          onInput={(e) => update(key, Number(e.currentTarget.value))}
          class="w-12 h-8 text-center text-sm border border-gray-300 text-black"
        />

        <button
          onClick={() => update(key, safeValues()[key] + 1)}
          class="w-15 h-8 flex flex-col items-center justify-center border-2 border-black text-black"
        >
          Plus
        </button>
      </div>
    </div>
  );

  return (
    <div class="bg-white text-black">
      {row("Left panel intervals display in secs", "leftPanelIntervalSecs")}
    </div>
  );
}
