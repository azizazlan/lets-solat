import { createSignal, createEffect } from "solid-js";
import Tabs from "./Tabs";
import IqamahTab from "./IqamahTab";
import AppEventsTab from "./AppEventsTab";
import PosterTab from "./PosterTab";
import MiscTab from "./MiscTab";
import PrayerTimesTab from "./PrayerTimesTab";
import type { AppSettings, TabKey } from "@/types/settings";
import type { AppEvent } from "@/types/app-event";

type Props = {
  initialValues?: AppSettings;
  onClose: () => void;
  onSave: (values: AppSettings) => void;
};

export default function SettingsModal(props: Props) {
  const [tab, setTab] = createSignal<TabKey>("iqamah");

  const [iqamah, setIqamah] = createSignal(
    props.initialValues?.iqamah ?? {
      alfajr: 18,
      dhuhr: 10,
      alasr: 10,
      maghrib: 10,
      alisha: 10,
    },
  );
  const [poster, setPoster] = createSignal(
    props.initialValues?.poster ?? {
      landscapeEnabled: false,
      imageLandscape: "",
      intervalSecs: 15,
    },
  );
  const [misc, setMisc] = createSignal(
    props.initialValues?.misc ?? {
      displayModeSecs: 30,
    },
  );
  const [appEvents, setAppEvents] = createSignal<AppEvent[]>(
    props.initialValues?.appEvents ?? [],
  );

  createEffect(() => {
    if (props.initialValues) {
      setIqamah(props.initialValues.iqamah);
      setPoster(props.initialValues.poster ?? null);
      setMisc(props.initialValues.misc ?? null);
      setAppEvents(props.initialValues.appEvents ?? []);
    }
  });

  const handleSave = () => {
    props.onSave({
      iqamah: iqamah(),
      poster: poster(),
      misc: misc(),
      appEvents: appEvents(),
    });

    props.onClose();
  };

  // console.log(poster());

  return (
    <div class="fixed inset-0 bg-black/60 z-50">
      <div class="w-full h-full bg-white flex flex-col p-4">
        {/* Header */}
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-black text-lg font-semibold">Settings</h2>
          <button onClick={props.onClose}>✕</button>
        </div>
        <Tabs value={tab()} onChange={setTab} />

        <div class="flex-1 overflow-auto mt-2">
          {tab() === "iqamah" && (
            <IqamahTab values={iqamah()} onChange={setIqamah} />
          )}

          {tab() === "poster" && (
            <PosterTab value={poster()} onChange={setPoster} />
          )}

          {tab() === "prayer-times" && <PrayerTimesTab />}

          {tab() === "events" && (
            <AppEventsTab appEvents={appEvents()} onChange={setAppEvents} />
          )}

          {tab() === "misc" && <MiscTab values={misc()} onChange={setMisc} />}
        </div>
        {/* Footer */}
        <div class="flex justify-end gap-3 border-t pt-4 mt-4">
          <button
            onClick={props.onClose}
            class="px-6 py-3 text-base border-2 border-gray-700 bg-white text-black hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            class="px-6 py-3 text-base font-bold bg-green-900 text-white hover:bg-gray-800 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
