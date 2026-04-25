import type { PosterSettings } from "@/types/settings";

const DEFAULT_VALUES: PosterSettings = {
  poster: {
    landscapeEnabled: true,
    imageUrlLandscape: null,
    intervalSecs: 15,
  },
};

export default function PosterTab(props: {
  value: PosterSettings;
  onChange: (v: PosterSettings) => void;
}) {
  const update = (patch: Partial<PosterSettings>) => {
    props.onChange({
      ...props.value,
      ...patch,
    });
  };

  const safeValues = () => props.value ?? DEFAULT_VALUES;

  const updateInterval = (key: keyof PosterSettings, value: number) => {
    const clamped = Math.max(5, Math.min(60, value));

    props.onChange({
      ...safeValues(),
      [key]: clamped,
    });
  };

  const row = (label: string, key: keyof MiscSettings) => (
    <div class="flex items-center text-black">
      <label class="text-black mr-5">{label}</label>

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
          onInput={(e) => updateInterval(key, Number(e.currentTarget.value))}
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

  const handleLandscapeFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      update({ imageUrlLandscape: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const toggleRow = (label: string, key: keyof PosterSettings) => (
    <div>
      <span style={{ "font-size": "1vh", color: "black" }}>{label}</span>

      {/* Kiosk-friendly toggle */}
      <button
        onClick={() =>
          update({ [key]: !props.value[key] } as Partial<PosterSettings>)
        }
        style={{
          width: "2.7vh",
          height: "1.7vh",
          "font-size": "0.7vh",
          border: "none",
          cursor: "pointer",
          background: props.value[key] ? "darkgreen" : "#ccc",
          color: props.value[key] ? "white" : "black",
        }}
      >
        {props.value[key] ? "ON" : "OFF"}
      </button>
    </div>
  );

  return (
    <div class="bg-white text-black">
      <div class="flex flex-col mt-[1vh]">
        {row("Display interval secs", "intervalSecs")}

        <div class="mt-7 flex flex-col justify-start">
          <div>Poster</div>
          <div>{toggleRow("", "landscapeEnabled")}</div>
        </div>

        <div class="mt-7 flex flex-row items-center justify-start">
          <input
            type="file"
            accept="image/*"
            onChange={handleLandscapeFile}
            class="text-black mt-[0vh] text-[1vh] border cursor-pointer"
          />

          {props.value.imageUrlLandscape && (
            <img
              src={props.value.imageUrlLandscape}
              class="w-auto h-[12vh] border border-black"
            />
          )}
        </div>
      </div>
    </div>
  );
}
