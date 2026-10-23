import { toggleNotification } from "@/utils/notification";

export default function EnableSoundModal() {
  const handleEnable = async () => {
    await toggleNotification();
  };

  return (
    <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80">
      <div class="flex max-w-[80vw] flex-col items-center gap-[3vh] rounded-lg border-2 border-emerald-200/20 bg-emerald-950 px-[6vw] py-[6vh] text-center shadow-2xl">
        <h2 class="text-[min(3vw,5.2vh)] font-bold text-amber-300">
          ENABLE SOUND
        </h2>
        <p class="text-[min(1.5vw,2.6vh)] leading-snug text-emerald-50/80">
          Click the button below to enable azan notifications.
        </p>
        <button
          onClick={handleEnable}
          class="cursor-pointer select-none rounded-md border-2 border-amber-200 bg-amber-400 px-[2.2vw] py-[1.8vh] text-[min(1.8vw,3vh)] font-semibold text-slate-900 transition-all duration-300 hover:bg-amber-300 animate-glow-pulse"
        >
          ENABLE SOUND
        </button>
      </div>
    </div>
  );
}
