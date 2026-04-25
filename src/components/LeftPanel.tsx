import { Match, Show, Switch, createMemo } from "solid-js";
import Clock from "./Clock";
import BlackoutPanel from "./BlackoutPanel";
import MediaPanel from "./MediaPanel";
import PrayerList from "./PrayerList";
import type { Prayer } from "@/types/prayers";
import type { Phase } from "./RightPanel";
import type { DisplayMode } from "../App";
import EventsPanel from "./EventsPanel";
import Hadiths from "./Hadiths";
import kaabahPhoto from "@/assets/image_2.jpg";
import { useSettings } from "@/services/settings";

interface LeftPanelProps {
  phase: Phase;
  now: () => Date;
  filteredPrayers: () => Prayer[];
  nextPrayer: () => Prayer | undefined;
  lastPrayer: () => Prayer | undefined;
  duhaDate: () => Date | undefined;
  syurukDate: () => Date | undefined;
  displayMode: DisplayMode;
}

export default function LeftPanel(props: LeftPanelProps) {
  const settings = useSettings;

  const imgPortraitPath = () => {
    const s = settings();
    return s.poster?.imagePortrait ?? "";
  };

  const imgPortrait = createMemo(() => imgPortraitPath());

  return (
    <div class="w-full h-full flex flex-col">
      <Switch>
        <Match when={props.phase === "BLACKOUT"}>
          <BlackoutPanel />
        </Match>

        <Match when={props.phase === "AZAN" || props.phase === "IQAMAH"}>
          <Show when={props.displayMode !== "POSTER"}>
            <Clock now={props.now} />
          </Show>

          <Switch>
            <Match when={props.displayMode === "HADITHS"}>
              <Hadiths />
            </Match>

            <Match when={props.displayMode === "EVENTS"}>
              {/* IMPORTANT: isolate scroll here */}
              <div class="h-full overflow-hidden">
                <EventsPanel />
              </div>
            </Match>

            <Match
              when={
                props.displayMode === "PRAYERS" ||
                props.displayMode === "LANDSCAPE_POSTER"
              }
            >
              <PrayerList
                filteredPrayers={props.filteredPrayers}
                nextPrayer={props.nextPrayer}
                duhaDate={props.duhaDate}
                syurukDate={props.syurukDate}
              />
            </Match>

            <Match when={props.displayMode === "POSTER"}>
              <MediaPanel imageUrl={imgPortrait()} isLeftPoster={true} />
            </Match>
          </Switch>
        </Match>

        <Match when={props.phase === "POST_IQAMAH"}>
          <MediaPanel imageUrl={kaabahPhoto} isLeftPoster={true} />
        </Match>
      </Switch>
    </div>
  );
}
