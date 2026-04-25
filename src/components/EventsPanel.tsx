import {
  createSignal,
  createResource,
  onMount,
  onCleanup,
  Show,
} from "solid-js";
import { loadTodayAndTomorrow } from "@/services/app-events";

export default function EventsPanel() {
  const [data, { loading }] = createResource(loadTodayAndTomorrow);

  const [mode, setMode] = createSignal<"today" | "tomorrow">("today");

  // rotate every 10s
  onMount(() => {
    const interval = setInterval(() => {
      setMode((prev) => (prev === "today" ? "tomorrow" : "today"));
    }, 7000);

    onCleanup(() => clearInterval(interval));
  });

  const hasEvents = () => {
    const d = data();
    return d && (d.today.length > 0 || d.tomorrow.length > 0);
  };

  const currentEvent = () => {
    const d = data();
    if (!d) return undefined;

    const today = d.today[0];
    const tomorrow = d.tomorrow[0];

    if (mode() === "today" && today) return today;
    if (mode() === "tomorrow" && tomorrow) return tomorrow;

    // fallback if one side empty
    return today ?? tomorrow;
  };

  return (
    <div class="h-full w-full bg-white flex items-center justify-center">
      {/* Loading */}
      <Show
        when={!loading}
        fallback={
          <div class="text-black text-5xl text-center p-4">Loading...</div>
        }
      >
        {/* No events */}
        <Show
          when={hasEvents()}
          fallback={
            <div class="text-black text-5xl text-center p-4">
              Tiada acara/pengumuman
            </div>
          }
        >
          {/* Content */}
          <div class="text-center">
            {/* Title */}
            <div class="text-8xl font-black text-green-700 mb-7">
              {mode() === "today"
                ? "Hari Ini,... إن شاء الله"
                : "Esok ... إن شاء الله"}
            </div>

            {/* Event title */}
            <div class="text-9xl font-bold text-green-800">
              {currentEvent()?.title}
            </div>

            {/* Speaker image */}
            <Show when={currentEvent()?.speakerCode}>
              <div class="flex justify-center my-4">
                <img
                  class="w-[16vw] rounded-lg object-cover"
                  src={`/data/speaker-imgs/${currentEvent()!.speakerCode}.png`}
                  alt={currentEvent()?.speaker}
                />
              </div>
            </Show>

            {/* Speaker name */}
            <Show when={currentEvent()?.speaker}>
              <div class="text-8xl font-semibold text-green-900">
                {currentEvent()?.speaker}
              </div>
            </Show>
          </div>
        </Show>
      </Show>
    </div>
  );
}
