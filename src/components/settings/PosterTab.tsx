import type { PosterSettings } from "@/types/settings";

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

  const handlePortraitFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      update({ imagePortrait: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleLandscapeFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      update({ imageLandscape: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const toggleRow = (label: string, key: keyof PosterSettings) => (
    <div
      style={{
        display: "flex",
        "justify-content": "space-between",
        "align-items": "center",
        "background-color": "white",
      }}
    >
      <span style={{ "font-size": "1vh", color: "black" }}>{label}</span>

      {/* Kiosk-friendly toggle */}
      <button
        onClick={() =>
          update({ [key]: !props.value[key] } as Partial<PosterSettings>)
        }
        style={{
          width: "2.7vh",
          height: "1.7vh",
          "margin-right": "0.7vh",
          "margin-left": "0.7vh",
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
      <div class="mt-[0vh]">
        <div class="flex flex-row items-center justify-start">
          <div class="text-[1vh] mr-[2.3vh]">Portrait</div>

          {toggleRow("", "portraitEnabled")}

          <input
            type="file"
            accept="image/*"
            onChange={handlePortraitFile}
            class="text-black mt-[0vh] text-[1vh] border cursor-pointer"
          />

          {props.value.imagePortrait && (
            <img
              src={props.value.imagePortrait}
              class="w-auto h-[12vh] border border-black"
            />
          )}
        </div>
      </div>

      <div class="mt-[1vh]">
        <div class="flex flex-row items-center justify-start">
          <div class="text-[1vh] mr-[1vh]">Landscape</div>

          {toggleRow("", "landscapeEnabled")}

          <input
            type="file"
            accept="image/*"
            onChange={handleLandscapeFile}
            class="text-black mt-[0vh] text-[1vh] border cursor-pointer"
          />

          {props.value.imageLandscape && (
            <img
              src={props.value.imageLandscape}
              class="w-auto h-[12vh] border border-black"
            />
          )}
        </div>
      </div>
    </div>
  );
}
