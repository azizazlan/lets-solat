import { Match, Switch, createEffect, createSignal, onCleanup } from "solid-js";
import Clock from "./Clock";
import PrayerList from "./PrayerList";
import EventsPanel from "./EventsPanel";
import Hadiths from "./Hadiths";
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
    return s.appEvents?.length > 0;
  };

  return (
    <div class="w-full h-full flex flex-col">
      <Switch>
        <Match when={props.phase === "POST_IQAMAH"}>
          <PostIqamahVideo />
        </Match>
        <Match when={props.phase !== "POST_IQAMAH"}>
          <Clock now={props.now} />
          <Switch>
            <Match when={props.phase === "DISPLAY_HADITHS"}>
              <Hadiths />
            </Match>
            <Match
              when={props.phase === "DISPLAY_APP_EVENTS" && thereAreAppEvents()}
            >
              <EventsPanel />
            </Match>
            <Match
              when={
                props.phase === "DISPLAY_PRAYER_TIMES" ||
                props.phase === "WAITING_AZAN" ||
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
