import { createMemo, createSignal, onMount, Switch, Match } from "solid-js";
import type { Component } from "solid-js";
import { useTimer } from "@/services/timer";
import { loadTodayPrayers } from "@/services/prayers";
import { timeToDate } from "@/utils/time";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import BlackoutPanel from "@/components/BlackoutPanel";

const App: Component = () => {
  const timer = useTimer();
  const nextPrayer = createMemo(() => timer.nextPrayer());
  const lastPrayer = createMemo(() => timer.lastPrayer());
  const syurukPrayer = createMemo(() =>
    timer.prayers().find((p) => p.en === "Syuruk"),
  );
  const syurukDate = createMemo(() => {
    const s = syurukPrayer();
    return s ? timeToDate(s.time) : undefined;
  });
  // Duha date (20 min after Syuruk)
  const duhaDate = createMemo(() => {
    const syuruk = syurukPrayer();
    if (!syuruk) return undefined;
    return new Date(timeToDate(syuruk.time).getTime() + 20 * 60 * 1000);
  });

  const [displayMode, setDisplayMode] = createSignal<DisplayMode>("PRAYERS");

  onMount(async () => {
    const todayPrayers = await loadTodayPrayers();
    if (!todayPrayers) {
      console.warn("No prayers found for today");
      return;
    }
    timer.setPrayers(todayPrayers);
    timer.startTimer();
  });

  return (
    <div class="flex flex-row w-full h-full">
      <Switch>
        <Match when={timer.phase() === "BLACKOUT"}>
          <BlackoutPanel />
        </Match>
        <Match when={timer.phase() !== "BLACKOUT"}>
          <LeftPanel
            phase={timer.phase()}
            now={timer.now}
            filteredPrayers={timer.filteredPrayers}
            nextPrayer={nextPrayer}
            duhaDate={duhaDate}
            syurukDate={syurukDate}
          />
          <RightPanel
            phase={timer.phase()}
            countdown={timer.countdown()}
            prayer={nextPrayer()}
            lastPrayer={lastPrayer}
            nextPrayer={nextPrayer}
            filteredPrayers={timer.filteredPrayers}
          />
        </Match>
      </Switch>
    </div>
  );
};

export default App;
