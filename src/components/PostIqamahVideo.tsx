import { createSignal, onMount } from "solid-js";

const STORAGE_KEY = "post-iqamah-video-index";

const videos = ["/kaabah.mp4", "/kaabah2.mp4", "/kaabah3.mp4", "/kaabah4.mp4"];

export default function PostIqamahVideo() {
  const [src, setSrc] = createSignal("");

  onMount(() => {
    // get last index (default -1 so first becomes 0)
    const lastIndex = Number(localStorage.getItem(STORAGE_KEY) ?? -1);

    // next index in sequence
    const nextIndex = (lastIndex + 1) % videos.length;

    // store it
    localStorage.setItem(STORAGE_KEY, String(nextIndex));

    // set video
    setSrc(videos[nextIndex]);
  });

  return (
    <div class="w-full h-full bg-black">
      <video autoplay loop muted playsinline class="w-full h-full object-cover">
        <source src={src()} type="video/mp4" />
      </video>
    </div>
  );
}
