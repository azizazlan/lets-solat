import { Switch, Match, createEffect } from "solid-js";
import type { Prayer } from "@/types/prayers";
import type { Phase } from "@/services/timer";
import BlackoutPanel from "./BlackoutPanel";
import PostIqamahPanel from "./PostIqamahPanel";
import IqamahPanel from "./IqamahPanel";
import WaitingAzanPanel from "./WaitingAzanPanel";
import { isPosterEnabled } from "@/services/settings";

export default function RightPanel(props: {
  phase: Phase;
  countdownSeconds: number;
  prayer?: Prayer;
  lastPrayer?: () => Prayer | undefined;
  filteredPrayers?: () => Prayer[];
  nextPrayer: () => Prayer | undefined;
}) {
  createEffect(() => {
    console.log(`${props.phase} isPosterEnabled ${isPosterEnabled()}`);
  });

  return (
    <div class="w-full h-full bg-[url('/logo2.png')] bg-repeat">
      <Switch>
        <Match when={props.phase === "POST_IQAMAH"}>
          <PostIqamahPanel />
        </Match>
        <Match when={props.phase === "IQAMAH"}>
          <IqamahPanel
            countdownSeconds={props.countdownSeconds()}
            filteredPrayers={props.filteredPrayers}
            lastPrayer={props.lastPrayer}
          />
        </Match>
        <Match
          when={
            props.phase === "WAITING_AZAN" ||
            props.phase === "DISPLAY_PRAYER_TIMES" ||
            props.phase === "DISPLAY_APP_EVENTS" ||
            props.phase === "DISPLAY_HADITHS" ||
            !isPosterEnabled()
          }
        >
          <WaitingAzanPanel
            prayer={props.prayer}
            countdownSeconds={props.countdownSeconds()}
            filteredPrayers={props.filteredPrayers}
            nextPrayer={props.nextPrayer}
          />
        </Match>
      </Switch>
    </div>
  );
}
