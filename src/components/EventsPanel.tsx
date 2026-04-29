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

  // rotate every 7s (ONLY if both have data)
  onMount(() => {
    const interval = setInterval(() => {
      const d = data();
      if (!d) return;

      // 👉 only rotate if BOTH have events
      if (d.today.length > 0 && d.tomorrow.length > 0) {
        setMode((prev) => (prev === "today" ? "tomorrow" : "today"));
      }
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

    if (mode() === "today" && d.today[0]) return d.today[0];
    if (mode() === "tomorrow" && d.tomorrow[0]) return d.tomorrow[0];

    // fallback
    return d.today[0] ?? d.tomorrow[0];
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
          <div class="text-center">
            {/* Title */}
            <div class="text-8xl font-black text-yellow-700 mb-7">
              {mode() === "today"
                ? "Hari Ini, إن شاء الله"
                : data()?.tomorrow?.length
                  ? "Esok, إن شاء الله"
                  : ""}
            </div>

            {/* Event title */}
            <div class="mt-7 text-9xl font-bold text-green-800">
              {currentEvent()?.title}
            </div>

            {/* Speaker image */}
            <div class="w-[16vw] h-[25vw] mx-auto my-4">
              <Show when={currentEvent()?.speakerCode} keyed>
                {(code) => (
                  <img
                    class="rounded object-cover opacity-0 transition-opacity duration-500"
                    src={`/data/speaker-imgs/${code}.png`}
                    alt={currentEvent()?.speaker}
                    onLoad={(e) =>
                      e.currentTarget.classList.remove("opacity-0")
                    }
                  />
                )}
              </Show>
            </div>

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
