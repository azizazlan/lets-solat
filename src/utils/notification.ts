let audioUnlocked = false;
const audio = new Audio("/alarm.mp3");

export function isAudioUnlocked() {
  return audioUnlocked;
}

export async function unlockAudio(): Promise<boolean> {
  if (audioUnlocked) return true;

  audio.muted = true;

  try {
    await audio.play();
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;

    audioUnlocked = true;
    console.log("Audio unlocked");
    return true;
  } catch (err) {
    console.error("Audio unlock failed:", err);
    return false;
  }
}

let isPlaying = false;

export async function playAlarm() {
  // if (isPlaying) return;
  //
  // try {
  //   isPlaying = true;
  //   audio.currentTime = 0;
  //   await audio.play();
  // } finally {
  //   isPlaying = false;
  // }
}
