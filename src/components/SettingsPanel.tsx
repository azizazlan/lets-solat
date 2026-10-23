import {
  isAudioUnlocked,
  isNotificationEnabled,
  toggleNotification,
} from "@/utils/notification";

interface SettingsPanelProps {
  handleOpenModal: () => void;
}

export default function SettingsPanel(props: SettingsPanelProps) {
  const soundOn = () => isAudioUnlocked() && isNotificationEnabled();

  const buttonBase =
    "cursor-pointer select-none border-2 font-semibold rounded-md px-9 py-9 transition-all duration-300";
  const soundOff =
    "bg-orange-500 text-white border-orange-300 animate-glow-pulse";
  const soundOnClass =
    "bg-transparent text-white border-white/50 hover:border-white";

  return (
    <div class="absolute top-2 right-3 z-50 flex flex-col items-end gap-2">
      {/* full panel always accessible on click */}
      <div class="flex items-center gap-2">
        <button
          onClick={props.handleOpenModal}
          class={`${buttonBase} text-white border-white/50 hover:border-white`}
        >
          SETTINGS
        </button>

        <button
          onClick={() => toggleNotification()}
          class={`${buttonBase} ${soundOn() ? soundOnClass : soundOff}`}
        >
          {soundOn() ? "MUTE" : "ENABLE SOUND"}
        </button>
      </div>
    </div>
  );
}
