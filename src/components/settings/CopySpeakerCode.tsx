import { For } from "solid-js";

const speakers = [
  { code: "asyari", name: "YBhg Ustaz Asyari" },
  { code: "asyraf", name: "YBhg Ustaz Asyraf" },
  { code: "azmi", name: "YBhg Ustaz Haji Azmi bin Sabdin" },
  { code: "azri", name: "YBhg Ustaz Azri Zulhilmi bin Zakaria" },
  { code: "hazwan", name: "YBhg Ustaz Hazwan" },
  { code: "ikhwan", name: "YBhg Ustaz Ikhwan" },
  { code: "liswan", name: "YBhg Ustaz Liswan" },
  { code: "megat", name: "YBhg Ustaz Megat" },
  { code: "muzaffar", name: "YBhg Ustaz Muzaffar" },
  { code: "mutawali", name: "YBhg Ustaz Mutawali" },
  { code: "nadzmi", name: "YBhg. Ustaz Nadzmi" },
  { code: "nor-hanisah", name: "YBhg Ustazah Nor Hanisah Muhamad" },
  { code: "nazrin", name: "YBhg Ustaz Nazrin" },
  { code: "syakir", name: "YBhg Ustaz Syakir" },
  { code: "wan", name: "YBhg Ustaz Wan Muhammad Abd Halim" },
  { code: "zakaria", name: "YBhg Ustaz Zakaria" },
  { code: "muhdafiq", name: "YBhg Ustaz Muhammad Afiq" },
  { code: "muhdafiqeman", name: "YBhg Ustaz Muhammad Afiq Eman" },
];

export default function CopySpeakerCode(props: {
  value: string;
  onChange: (speaker: { code: string; name: string }) => void;
}) {
  return (
    <div>
      <input type="hidden" name="speakerCode" value={props.value} />
      <div class="flex flex-wrap gap-3 mt-3">
        <For each={speakers}>
          {(speaker) => {
            const isActive = () => props.value === speaker.code;

            return (
              <button
                type="button"
                onClick={() => props.onChange(speaker)}
                class={`cursor-pointer px-7 py-3 rounded transition border border-green-500
          ${
            isActive()
              ? "bg-green-600 text-white ring-2 ring-green-300 font-semibold"
              : "bg-green-100 text-green-900 hover:bg-green-200"
          }`}
              >
                <div class="flex flex-col items-start leading-tight">
                  <span class="font-semibold">{speaker.code}</span>
                  <span class="text-sm opacity-80">{speaker.name}</span>
                </div>
              </button>
            );
          }}
        </For>
      </div>
    </div>
  );
}
