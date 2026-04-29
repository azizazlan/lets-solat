import type { PosterSettings } from "@/types/settings";

const DEFAULT_VALUES: PosterSettings = {
  poster: {
    isEnabled: true,
    imageUrl: null,
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

  const handleFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      update({ imageUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const toggleRow = (label: string, key: keyof PosterSettings) => (
    <div>
      <span class="text-3xl text-black">{label}</span>
      {/* Kiosk-friendly toggle */}
      <button
        onClick={() =>
          update({ [key]: !props.value[key] } as Partial<PosterSettings>)
        }
        class={`
    flex flex-row w-32 h-17 text-3xl justify-center items-center
    border-none cursor-pointer font-bold
    ${props.value[key] ? "bg-green-800 text-white" : "bg-gray-300 text-black"}
  `}
      >
        {props.value[key] ? "ON" : "OFF"}
      </button>
    </div>
  );

  return (
    <div class="bg-white text-black">
      <div class="flex flex-col mt-[1vh]">
        <div class="flex flex-col justify-start">
          <div class="text-3xl text-black">Enable poster</div>
          <div>{toggleRow("", "isEnabled")}</div>
        </div>

        <div class="flex flex-col items-start gap-2 mt-7">
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            class="text-3xl text-black mt-[0vh] border cursor-pointer"
          />

          {props.value.imageUrl && (
            <img
              src={props.value.imageUrl}
              class={`w-auto h-[12vh] border border-black ${
                props.value.isEnabled ? "" : "grayscale opacity-50"
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
