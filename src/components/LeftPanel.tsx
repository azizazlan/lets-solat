import { Match, Switch, createEffect, createSignal, onCleanup } from "solid-js";
import Clock from "./Clock";
import PrayerList from "./PrayerList";
import EventsPanel from "./EventsPanel";
import Hadiths from "./Hadiths";
import { useSettings } from "@/services/settings";
import type { Phase } from "@/services/timer";

interface LeftPanelProps {
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
    }, settings().misc.displayModeSecs * 1000);

    onCleanup(() => clearInterval(interval));
  });

  return (
    <div class="w-full h-full flex flex-col">
      <Clock now={props.now} />
      <Switch>
        <Match when={mode() === 0}>
          <Hadiths />
        </Match>

        <Match when={mode() === 1}>
          <EventsPanel />
        </Match>

        <Match when={mode() === 2}>
          <PrayerList
            filteredPrayers={props.filteredPrayers}
            nextPrayer={props.nextPrayer}
            duhaDate={props.duhaDate}
            syurukDate={props.syurukDate}
          />
        </Match>
      </Switch>
    </div>
  );
}
