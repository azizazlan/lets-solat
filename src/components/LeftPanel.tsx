import { Match, Switch, createEffect, createSignal, onCleanup } from "solid-js";
import Clock from "./Clock";
import PrayerList from "./PrayerList";
import EventsPanel from "./EventsPanel";
import Hadiths from "./Hadiths";
import PostIqamahVideo from "./PostIqamahVideo";
import { useSettings } from "@/services/settings";
import type { Phase } from "@/services/timer";

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
  const [mode, setMode] = createSignal(0);

  createEffect(() => {
    const interval = setInterval(() => {
      setMode((m) => (m + 1) % 3);
    }, settings().misc.leftPanelIntervalSecs * 1000);

    onCleanup(() => clearInterval(interval));
  });

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
            <Match when={mode() === 0}>
              <Hadiths />
            </Match>

            <Match when={mode() === 1 && thereAreAppEvents()}>
              <EventsPanel />
            </Match>

            <Match when={mode() === 2 || !thereAreAppEvents()}>
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
