import type { TabKey } from "@/types/settings";

const tabs: { key: TabKey; label: string }[] = [
  { key: "iqamah", label: "Iqamah" },
  { key: "events", label: "Events" },
  { key: "poster", label: "Poster" },
  { key: "prayer-times", label: "Prayer Times" },
];

export default function Tabs(props: {
  value: TabKey;
  onChange: (v: TabKey) => void;
}) {
  return (
    <div class="flex gap-7 mb-2 border-b border-gray-300">
      {tabs.map((t) => {
        const active = props.value === t.key;

        return (
          <button
            onClick={() => props.onChange(t.key)}
            class={`cursor-pointer pb-2 text-3xl font-semibold transition
           ${
             active
               ? "border-b-2 border-green-700 text-green-700"
               : "text-gray-500 hover:text-gray-800"
           }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
