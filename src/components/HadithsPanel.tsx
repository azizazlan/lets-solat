import { createSignal, onMount } from "solid-js";

type Hadith = {
  id: number;
  text: string;
  source?: string;
};

interface HadithsPanelProps {
  mode?: string;
}

const HadithsPanel = (props: HadithsPanelProps) => {
  const [hadith, setHadith] = createSignal<Hadith | null>(null);

  const fetchHadith = async () => {
    try {
      const response = await fetch("/data/hadiths.json");
      const hadiths: Hadith[] = await response.json();

      if (hadiths.length === 0) return;

      // Get previously shown IDs
      const stored = localStorage.getItem("shownHadithIds");
      let shownIds: number[] = stored ? JSON.parse(stored) : [];

      // Filter out already shown hadiths
      let availableHadiths = hadiths.filter((h) => !shownIds.includes(h.id));

      // Reset if all have been shown
      if (availableHadiths.length === 0) {
        shownIds = [];
        availableHadiths = hadiths;
      }

      // Pick random from remaining
      const randomIndex = Math.floor(Math.random() * availableHadiths.length);
      const selected = availableHadiths[randomIndex];

      // Save this ID
      shownIds.push(selected.id);
      localStorage.setItem("shownHadithIds", JSON.stringify(shownIds));

      setHadith(selected);
    } catch (error) {
      console.error("Error loading hadith:", error);
    }
  };

  onMount(() => {
    fetchHadith();
  });

  if (props.mode === "poster") {
    return (
      <div class="flex flex-col items-center justify-center gap-9 w-full h-full bg-[url('/logo2.png')] bg-repeat">
        <div class="w-full flex flex-col items-center">
          <img src="/border.png" class="w-128" />
        </div>
        <div class="text-center max-w-[155rem] text-white font-semibold text-8xl leading-relaxed">
          {hadith()?.text || "Loading hadith..."}
        </div>

        <div class="font-semibold text-yellow-500 text-7xl">
          {hadith()?.source ? `— ${hadith()?.source}` : ""}
        </div>
        <div class="w-full flex flex-col items-center">
          <img src="/border.png" class="w-128" />
        </div>
      </div>
    );
  }

  return (
    <div class="text-center bg-white h-full flex flex-col p-3">
      <div class="mt-3 text-green-900 font-semibold text-7xl leading-relaxed">
        {hadith()?.text || "Loading hadith..."}
      </div>

      <div class="font-semibold text-yellow-700 text-7xl mt-9">
        {hadith()?.source ? `— ${hadith()?.source}` : ""}
      </div>
      <div class="w-full flex flex-col items-center mt-12">
        <img src="/border.png" class="w-128" />
      </div>
    </div>
  );
};

export default HadithsPanel;
