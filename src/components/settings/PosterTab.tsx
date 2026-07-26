import type { PosterSettings } from "@/types/settings";

const MAX_POSTERS = 3;

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
      const current = props.value.imageUrls ?? [];
      const updated = [...current, reader.result as string].slice(0, MAX_POSTERS);
      update({ imageUrls: updated });
    };
    reader.readAsDataURL(file);

    (e.target as HTMLInputElement).value = "";
  };

  const handleRemove = (index: number) => {
    const current = props.value.imageUrls ?? [];
    update({ imageUrls: current.filter((_, i) => i !== index) });
  };

  const toggleRow = (label: string, key: keyof PosterSettings) => (
    <div>
      <span class="text-3xl text-black">{label}</span>
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

        <div class="text-3xl text-black mt-6">
          Posters ({(props.value.imageUrls ?? []).length}/{MAX_POSTERS})
        </div>

        <div class="flex flex-row flex-wrap gap-4 mt-4">
          {(props.value.imageUrls ?? []).map((url, i) => (
            <div class="relative inline-block">
              <img
                src={url}
                class={`w-auto h-[24vh] border border-black ${
                  props.value.isEnabled ? "" : "grayscale opacity-50"
                }`}
              />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                class="absolute top-0 right-0 w-10 h-10 bg-red-600 text-white text-2xl rounded-bl-lg flex items-center justify-center cursor-pointer border-none z-10"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {(props.value.imageUrls ?? []).length < MAX_POSTERS && (
          <div class="mt-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFile}
              class="text-3xl text-black mt-[0vh] border cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
}
