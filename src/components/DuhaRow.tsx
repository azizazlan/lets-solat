import { padZero } from "@/utils/time";

export default function DuhaRow(props: { dateDuha: Date; dateSyuruk?: Date }) {
  return (
    <div class="w-full text-black bg-white px-7 pb-5 flex flex-row items-center justify-between">
      {/* Left column: Duha */}
      <div class="flex flex-col items-center justify-start leading-relaxed">
        <div class="text-7xl text-green-800 text-left font-semibold" dir="rtl">
          يبدأ الضحى الساعة
        </div>

        <div class="text-7xl text-green-800 mt-7 font-semibold">
          DUHA BERMULA
        </div>

        <div class="text-9xl font-medium text-green-800">
          {padZero(props.dateDuha.getHours())}:
          {padZero(props.dateDuha.getMinutes())}
        </div>
      </div>

      {/* Right column: Syuruk */}
      <div class="flex flex-col items-center justify-end leading-relaxed">
        <div class="font-black text-7xl text-green-800" dir="rtl">
          الشروق
        </div>
        <div class="font-semibold text-7xl text-green-800 text-right mt-7">
          MATAHARI TERBIT
        </div>

        <div class="text-9xl font-medium text-right text-red-700">
          {props.dateSyuruk
            ? `${padZero(props.dateSyuruk.getHours())}:${padZero(
                props.dateSyuruk.getMinutes(),
              )}`
            : "N/A"}
        </div>
      </div>
    </div>
  );
}
