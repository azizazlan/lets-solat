import { Match, Switch, createEffect, createSignal, onCleanup } from "solid-js";
import ClockDatePanel from "./ClockDatePanel";
import PrayerList from "./PrayerList";
import EventsPanel from "./EventsPanel";
import HadithsPanel from "./HadithsPanel";
import PostIqamahVideo from "./PostIqamahVideo";
import type { Phase } from "@/services/timer";
import { useSettings } from "@/services/settings";

interface LeftPanelProps {
  phase: Phase;
  now: () => Date;
  filteredPrayers: () => Prayer[];
  nextPrayer: () => Prayer | undefined;
  duhaDate: () => Date | undefined;
  syurukDate: () => Date | undefined;
}

export default function LeftPanel(props: LeftPanelProps) {
  const settings = useSettings;

  const thereAreAppEvents = () => {
    const s = settings();
    if (!s?.appEvents?.length) return false;

    const today = new Date();

    return s.appEvents.some((event) => {
      const d = new Date(event.date);

      return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      );
    });
  };

  return (
    <div class="w-full h-full flex flex-col">
      <Switch>
        <Match when={props.phase === "POST_IQAMAH"}>
          <PostIqamahVideo />
        </Match>
        <Match when={props.phase !== "POST_IQAMAH"}>
          <ClockDatePanel now={props.now} />
          <Switch>
            <Match
              when={
                props.phase === "DISPLAY_HADITHS" ||
                (props.phase === "IQAMAH" && !thereAreAppEvents())
              }
            >
              <HadithsPanel />
            </Match>
            <Match
              when={
                (props.phase === "DISPLAY_APP_EVENTS" ||
                  props.phase === "IQAMAH") &&
                thereAreAppEvents()
              }
            >
              <EventsPanel />
            </Match>
            <Match
              when={
                props.phase === "WAITING_AZAN" ||
                props.phase === "DISPLAY_PRAYER_TIMES" ||
                !thereAreAppEvents()
              }
            >
              <PrayerList
                filteredPrayers={props.filteredPrayers}
                nextPrayer={props.nextPrayer}
                duhaDate={props.duhaDate}
                syurukDate={props.syurukDate}
              />
            </Match>
          </Switch>
        </Match>
      </Switch>
    </div>
  );
}
