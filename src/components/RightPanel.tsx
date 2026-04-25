import type { Prayer } from "@/types/prayers";
import BlackoutPanel from "./BlackoutPanel";
import PostIqamahPanel from "./PostIqamahPanel";
import IqamahPanel from "./IqamahPanel";
import AzanPanel from "./AzanPanel";

const FORCE_BLACKOUT = false; // ← set true to test

export type Phase = "BLACKOUT" | "IQAMAH" | "POST_IQAMAH" | "AZAN";

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
      {(FORCE_BLACKOUT || props.phase === "BLACKOUT") && <BlackoutPanel />}

      {props.phase === "POST_IQAMAH" && <PostIqamahPanel />}

      {props.phase === "IQAMAH" && (
        <IqamahPanel
          countdown={props.countdown}
          filteredPrayers={props.filteredPrayers}
          lastPrayer={props.lastPrayer}
        />
      )}

      {props.phase === "AZAN" && (
        <AzanPanel
          prayer={props.prayer}
          countdown={props.countdown}
          filteredPrayers={props.filteredPrayers}
          nextPrayer={props.nextPrayer}
        />
      )}
    </div>
  );
}
