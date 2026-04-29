import {
  isAudioUnlocked,
  isNotificationEnabled,
  toggleNotification,
} from "@/utils/notification";

interface SettingsPanelProps {
  handleOpenModal: () => void;
}

export default function SettingsPanel(props: SettingsPanelProps) {
  return (
    <div class="absolute top-2 right-3 flex items-center gap-2 z-50">
      <button
        onClick={props.handleOpenModal}
        class="text-white cursor-pointer border border-2 font-semibold rounded-md px-3 py-3 opacity-50 hover:opacity-100"
      >
        Settings ...
      </button>

      <button
        onClick={() => toggleNotification()}
        class="text-white cursor-pointer border border-2 font-semibold rounded-md px-3 py-3 opacity-50 hover:opacity-100"
      >
        {isAudioUnlocked() && isNotificationEnabled()
          ? "Notification ON"
          : "Notification OFF"}
      </button>
    </div>
  );
}
