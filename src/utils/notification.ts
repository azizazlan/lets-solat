import { createSignal } from "solid-js";

const [audioUnlocked, setAudioUnlocked] = createSignal(false);

const audio = new Audio("/alarm.mp3");

export function isAudioUnlocked() {
  return audioUnlocked;
}

export function unlockAudio(): Promise<boolean> {
  if (audioUnlocked()) return Promise.resolve(true);

  audio.muted = true;

  return audio
    .play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;

      setAudioUnlocked(true);
      console.log("Audio unlocked");
      return true;
    })
    .catch((err) => {
      console.error("Audio unlock failed:", err);
      return false;
    });
}

let isPlaying = false;

export async function playAlarm() {
  if (isPlaying) return;

  try {
    isPlaying = true;
    audio.currentTime = 0;
    await audio.play();
  } finally {
    isPlaying = false;
  }
}
