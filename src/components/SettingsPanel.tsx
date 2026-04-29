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
    <div class="absolute top-2 right-3 z-50 flex flex-col items-end gap-2">
      {/* full panel always accessible on click */}
      <div class="flex items-center gap-2">
        <button
          onClick={props.handleOpenModal}
          class="text-white cursor-pointer border border-2 font-semibold rounded-md px-9 py-9 opacity-10 hover:opacity-100"
        >
          ⚙
        </button>

        <button
          onClick={() => toggleNotification()}
          class="text-white cursor-pointer border border-2 font-semibold rounded-md px-9 py-9 opacity-30 hover:opacity-100"
        >
          {isAudioUnlocked() && isNotificationEnabled() ? "🔊))" : "🔊❌"}
        </button>
      </div>
    </div>
  );
}
