import PrayerHorizList from "./PrayerHorizList";

// Panel user see while waiting for Azan
export default function WaitingAzanPanel(props: {
  prayer?: Prayer;
  countdown: string;
  filteredPrayers?: () => Prayer[];
  nextPrayer?: () => Prayer | undefined;
  lastPrayer?: () => Prayer | undefined;
}) {
  const isUrgent = () => {
    if (!props.countdown) return false;
    const [h, m, s] = props.countdown.split(":").map(Number);
    return h * 3600 + m * 60 + s <= 180;
  };

  return (
    <div class="h-full flex flex-col text-white">
      {/* Main content takes remaining space */}
      <div class="text-9xl flex-1 flex flex-col items-center justify-center">
        {/* Arabic prayer */}
        <div class="font-bold text-center" dir="rtl">
          الأذان القادم {props.prayer?.ar}
        </div>

        {/* English */}
        <div class="mt-7 font-bold">AZAN {props.prayer?.en}</div>

        {/* countdown */}
        <div
          class={`text-[17vh] font-bold ${isUrgent() ? "countdown--urgent" : ""}`}
        >
          {props.countdown}
        </div>
      </div>

      {/* bottom panel */}
      <PrayerHorizList
        filteredPrayers={props.filteredPrayers}
        nextPrayer={props.nextPrayer}
      />
    </div>
  );
}
