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
    }, 10000);

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

  const getDayName = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("ms-MY", {
      weekday: "long",
    });
  };

  return (
    <div class="relative h-full w-full bg-white flex justify-center">
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
            <div class="text-9xl text-yellow-700 font-semibold">
              {mode() === "today"
                ? `Hari ini, ${getDayName(currentEvent()?.date)}`
                : data()?.tomorrow?.length
                  ? "Esok,"
                  : ""}
            </div>

            {/* Event title */}
            <div class="text-9xl font-bold text-green-800 mt-7">
              {currentEvent()?.title}
            </div>

            {/* Speaker image */}
            <div class="w-[32vw] h-[25vw] mx-auto">
              <Show when={currentEvent()?.speakerCode} keyed>
                {(code) => (
                  <img
                    class="mx-auto h-full rounded-xl object-cover opacity-0 transition-opacity duration-500"
                    src={`/data/speaker-imgs/${code}.png`}
                    alt={currentEvent()?.speaker}
                    onLoad={(e) =>
                      e.currentTarget.classList.remove("opacity-0")
                    }
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af'%3E%3Cpath d='M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .66.54 1.2 1.2 1.2h16.8c.66 0 1.2-.54 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z'/%3E%3C/svg%3E";
                    }}
                  />
                )}
              </Show>
            </div>

            {/* Speaker name */}
            <Show when={currentEvent()?.speaker}>
              <div class="text-9xl font-semibold text-green-900">
                {currentEvent()?.speaker}
              </div>
            </Show>
          </div>
        </Show>
      </Show>
    </div>
  );
}
