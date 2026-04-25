import type { IqamahSettings } from "@/types/settings";

const DEFAULT_VALUES: IqamahSettings = {
  alfajr: 18,
  dhuhr: 10,
  alasr: 10,
  maghrib: 10,
  alisha: 10,
};

export default function IqamahTab(props: {
  values?: IqamahSettings;
  onChange: (v: IqamahSettings) => void;
}) {
  const safeValues = () => props.values ?? DEFAULT_VALUES;

  const update = (key: keyof IqamahSettings, value: number) => {
    const clamped = Math.max(5, Math.min(20, value));

    props.onChange({
      ...safeValues(),
      [key]: clamped,
    });
  };

  const row = (label: string, key: keyof IqamahSettings) => (
    <div class="flex items-center justify-between max-w-[550px] mt-2">
      {/* Label */}
      <label class="text-black text-sm font-medium">{label}</label>

      {/* Controls */}
      <div class="flex items-center gap-2">
        {/* minus */}
        <button
          onClick={() => update(key, safeValues()[key] - 1)}
          class="w-15 h-8 text-black flex items-center justify-center border border-black text-lg hover:bg-gray-100"
        >
          Minus
        </button>

        {/* input */}
        <input
          type="number"
          min="5"
          max="20"
          value={safeValues()[key]}
          onInput={(e) => update(key, Number(e.currentTarget.value))}
          class="w-12 h-8 text-center text-sm border border-gray-300 text-black"
        />

        {/* plus */}
        <button
          onClick={() => update(key, safeValues()[key] + 1)}
          class="w-15 h-8 text-black flex items-center justify-center border border-black text-lg hover:bg-gray-100"
        >
          Plus
        </button>
      </div>
    </div>
  );

  return (
    <div class="bg-white p-4">
      <div class="text-sm text-black mb-6">Duration in minutes</div>

      {row("ALFAJR", "alfajr")}
      {row("DHUHR", "dhuhr")}
      {row("ALASR", "alasr")}
      {row("MAGHRIB", "maghrib")}
      {row("ALISHA", "alisha")}
    </div>
  );
}
