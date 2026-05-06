import { createSignal } from "solid-js";
import type { AppEvent } from "@/types/app-event";
import CopySpeakerCode from "@/components/settings/CopySpeakerCode";

const formatDateMY = (dateStr: string) => {
  if (!dateStr) return "";

  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
};

function getNowDefaults() {
  const now = new Date();

  const date =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0");

  const time =
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0");

  return { date, time };
}

export const EMPTY_FORM = (): AppEvent => {
  const { date, time } = getNowDefaults();

  return {
    id: "",
    date,
    time,
    title: "Kuliah Maghrib",
    desc: "",
    speaker: "YBhg. Ustaz Nadzmi",
    speakerCode: "nadzmi",
  };
};

const getDayLabel = (dateStr: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short", // "Mon", "Tue"
  });
};

export default function AppEventsTab(props: {
  appEvents?: AppEvent[];
  onChange: (appEvents: AppEvent[]) => void;
}) {
  const [form, setForm] = createSignal<AppEvent>(EMPTY_FORM());
  const [editingId, setEditingId] = createSignal<string | null>(null);

  const safeAppEvents = () => props.appEvents ?? [];

  const editAppEvent = (e: AppEvent) => {
    setForm(e);
    setEditingId(e.id);
  };

  const update = (key: keyof AppEvent, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const sortAppEvents = (appEvents: AppEvent[]) =>
    appEvents.sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() -
        new Date(`${b.date}T${b.time}`).getTime(),
    );

  const saveAppEvent = () => {
    const f = form();

    if (!f.date || !f.time || !f.title) {
      alert("Date, time and title are required");
      return;
    }

    const isEditing = editingId() !== null;

    let updated: AppEvent[];

    if (isEditing) {
      updated = safeAppEvents().map((e) =>
        e.id === editingId() ? { ...f, id: e.id } : e,
      );
    } else {
      updated = [...safeAppEvents(), { ...f, id: crypto.randomUUID() }];
    }

    props.onChange(sortAppEvents(updated));

    setForm(EMPTY_FORM());
    setEditingId(null);
  };

  const cancelEdit = () => {
    console.log("Cancel edited");

    setEditingId(null);
    setForm(() => EMPTY_FORM());
  };

  const deleteAppEvent = (id: string) => {
    const updated = safeAppEvents().filter((e) => e.id !== id);
    props.onChange(updated);
  };

  return (
    <div class="flex gap-6 w-full h-full text-black text-2xl">
      {/* LEFT: FORM */}
      <div class="flex-1 flex flex-col gap-3 overflow-auto pr-2">
        <div class="flex items-center gap-2">
          <div class="border px-3 min-w-[40px] text-center">
            {getDayLabel(form().date)}
          </div>
          <input
            type="date"
            value={form().date}
            onInput={(e) => update("date", e.currentTarget.value)}
            class="w-full h-12 px-3 py-2 border"
          />
        </div>

        <input
          type="time"
          value={form().time}
          onInput={(e) => update("time", e.currentTarget.value)}
          class="h-13 px-3 py-2 border"
        />

        <div class="flex flex-col gap-1">
          <label class="text-green-900">Event title</label>
          <input
            placeholder="Kuliah Maghrib"
            value={form().title}
            onInput={(e) => update("title", e.currentTarget.value)}
            class="px-3 py-2 border"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-green-900">Speaker name</label>
          <input
            placeholder="Speaker name"
            value={form().speaker}
            onInput={(e) => update("speaker", e.currentTarget.value)}
            class="px-3 py-2 border"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-green-900">Photo</label>
          <input
            placeholder="Speaker code"
            value={form().speakerCode}
            onInput={(e) => update("speakerCode", e.currentTarget.value)}
            class="px-3 py-2 border"
          />
          <CopySpeakerCode
            value={form().speakerCode}
            onChange={(code) => update("speakerCode", code)}
          />
        </div>

        <div class="flex flex-row justify-end w-full ">
          <button
            onClick={saveAppEvent}
            class="cursor-pointer bg-green-900 text-3xl text-white px-6 py-3 font-semibold rounded hover:bg-green-700 transition"
          >
            {editingId() ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* RIGHT: LIST */}
      <div class="flex-1 min-w-[320px] overflow-auto border rounded-lg p-2">
        {safeAppEvents().length === 0 && (
          <div class="text-gray-400 text-center py-6">No events yet</div>
        )}

        {safeAppEvents().map((e, index) => {
          return (
            <div
              onClick={() => editAppEvent(e)}
              class={`flex items-center mt-2 p-3 rounded-md cursor-pointer gap-5
        ${
          editingId() === e.id
            ? "bg-blue-50 border-2 border-blue-500"
            : "bg-gray-50 border border-gray-300"
        }`}
            >
              {/* LEFT: index + date */}
              <div class="flex items-center gap-3">
                <div class="p-3 min-w-[55px] flex justify-center items-center text-3xl font-semibold bg-yellow-800 text-white">
                  {index + 1}
                </div>

                <div class="text-3xl ">
                  {getDayLabel(e.date)} • {formatDateMY(e.date)} {e.time}
                </div>
              </div>

              {/* TITLE */}
              <div class="min-w-[650px] text-3xl text-green-900 ">
                {e.title}
              </div>

              {/* MIDDLE (grows and pushes button right) */}
              <div class="flex items-center gap-3 flex-1">
                <img
                  class="w-[2vw] object-cover"
                  src={`/data/speaker-imgs/${e.speakerCode}.png`}
                  alt={e.speaker}
                />

                {(e.speaker || e.speakerCode) && (
                  <div class="text-3xl text-black">{e.speaker}</div>
                )}
              </div>

              {/* RIGHT ACTION BUTTON */}
              <div class="flex items-center">
                {editingId() === e.id ? (
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      cancelEdit();
                    }}
                    class="border text-lg px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      deleteAppEvent(e.id);
                    }}
                    class="cursor-pointer text-red-500 px-2 text-xl font-bold"
                  >
                    ❌
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
