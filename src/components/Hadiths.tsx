import { createSignal, onMount } from "solid-js";

type Hadith = {
  id: number;
  text: string;
  source?: string;
};

const Hadiths = () => {
  const [hadith, setHadith] = createSignal<Hadith | null>(null);

  const fetchHadith = async () => {
    try {
      const response = await fetch("/data/hadiths.json");
      const hadiths: Hadith[] = await response.json();

      if (hadiths.length > 0) {
        const randomIndex = Math.floor(Math.random() * hadiths.length);
        setHadith(hadiths[randomIndex]);
      }
    } catch (error) {
      console.error("Error loading hadith:", error);
    }
  };

  onMount(() => {
    fetchHadith();
  });

  return (
    <div class="text-center bg-white h-full flex flex-col p-3">
      <div class="mt-9 text-black text-7xl leading-relaxed">
        {hadith()?.text || "Loading hadith..."}
      </div>

      <div class="text-green-800 text-5xl mt-9">
        {hadith()?.source ? `— ${hadith()?.source}` : ""}
      </div>
    </div>
  );
};

export default Hadiths;
