import type { Prayer } from "@/types/prayers";
import type { Phase } from "@/services/timer";
import BlackoutPanel from "./BlackoutPanel";
import PostIqamahPanel from "./PostIqamahPanel";
import IqamahPanel from "./IqamahPanel";
import WaitingAzanPanel from "./WaitingAzanPanel";

export default function RightPanel(props: {
  phase: Phase;
  countdown: string;
  prayer?: Prayer;
  lastPrayer?: () => Prayer | undefined;
  filteredPrayers?: () => Prayer[];
  nextPrayer: () => Prayer | undefined;
}) {
  return (
    <div class="w-full h-full bg-[url('/logo2.png')] bg-repeat">
      {props.phase === "POST_IQAMAH" && <PostIqamahPanel />}

      {props.phase === "IQAMAH" && (
        <IqamahPanel
          countdown={props.countdown}
          filteredPrayers={props.filteredPrayers}
          lastPrayer={props.lastPrayer}
        />
      )}

      {props.phase === "DISPLAY_PRAYER_TIMES" && (
        <WaitingAzanPanel
          prayer={props.prayer}
          countdown={props.countdown}
          filteredPrayers={props.filteredPrayers}
          nextPrayer={props.nextPrayer}
        />
      )}
    </div>
  );
}
