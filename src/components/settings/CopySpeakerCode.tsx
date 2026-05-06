import { For } from "solid-js";

const speakerCodes = [
  "asyari",
  "asyraf",
  "azmi",
  "azri",
  "hazwan",
  "ikhwan",
  "liswan",
  "megat",
  "muzaffar",
  "mutawali",
  "nadzmi",
  "nazrin",
  "syakir",
  "wan",
  "zakaria",
];

export default function CopySpeakerCode(props: {
  value: string;
  onChange: (code: string) => void;
}) {
  return (
    <div>
      <input type="hidden" name="speakerCode" value={props.value} />
      <div class="flex flex-wrap gap-3 mt-3">
        <For each={speakerCodes}>
          {(code) => {
            const isActive = () => props.value === code;

            return (
              <button
                type="button"
                onClick={() => props.onChange(code)}
                class={`px-7 py-3 rounded transition border border-green-500
                  ${
                    isActive()
                      ? "bg-green-600 text-white ring-2 ring-green-300 font-semibold"
                      : "bg-green-100 text-green-900 hover:bg-green-200"
                  }`}
              >
                {code}
              </button>
            );
          }}
        </For>
      </div>
    </div>
  );
}
