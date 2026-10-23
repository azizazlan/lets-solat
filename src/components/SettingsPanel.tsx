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
          class="cursor-pointer select-none rounded-md border-2 border-white/50 px-9 py-9 text-2xl font-semibold text-white transition-all duration-300 hover:border-white"
        >
          SETTINGS
        </button>
      </div>
    </div>
  );
}
