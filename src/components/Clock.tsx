import type { Accessor } from "solid-js";

const DAY_NAMES = [
  "Ahad",
  "Isnin",
  "Selasa",
  "Rabu",
  "Khamis",
  "Jumaat",
  "Sabtu",
];
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mac",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Ogos",
  "Sept",
  "Okt",
  "Nov",
  "Dis",
];

function HexBadge(props: { value: string | number; size?: number }) {
  const size = 255;
  const hexPoints = "50,5 93.3,25 93.3,75 50,95 6.7,75 6.7,25";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon
        points={hexPoints}
        fill="darkgreen"
        stroke="orange"
        stroke-width="5"
      />
      <text
        x="50"
        y="55"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="40"
        font-weight="bold"
        fill="white"
      >
        {props.value}
      </text>
    </svg>
  );
}

export default function Clock(props: { now: Accessor<Date> }) {
  const today = () => props.now();
  // console.log(today());

  const gregorianDay = () => today().getDate();

  const hijriDay = () => {
    const OFFSET = -1; // adjust if needed

    const adjusted = new Date(today());
    adjusted.setDate(adjusted.getDate() + OFFSET);

    const formatter = new Intl.DateTimeFormat("en-TN-u-ca-islamic-tbla", {
      day: "numeric",
    });

    return formatter.format(adjusted);
  };

  const hijriMonth = () => {
    const OFFSET = -1; // adjust if needed

    const adjusted = new Date(today());
    adjusted.setDate(adjusted.getDate() + OFFSET);

    const formatter = new Intl.DateTimeFormat("en-TN-u-ca-islamic-tbla", {
      month: "long",
    });

    return formatter.format(adjusted);
  };

  const hijriYear = () => {
    const OFFSET = -1; // adjust if needed

    const adjusted = new Date(today());
    adjusted.setDate(adjusted.getDate() + OFFSET);

    const formatter = new Intl.DateTimeFormat("en-TN-u-ca-islamic-tbla", {
      year: "numeric",
    });

    return formatter.format(adjusted);
  };

  return (
    <div class="flex flex-col bg-white">
      {/* Top row: badges + clock */}
      <div class="grid grid-cols-[1fr_auto_1fr] items-center px-3">
        {/* Left badge */}
        <div class="flex justify-start translate-x-25">
          <HexBadge size={195} value={gregorianDay()} />
        </div>

        {/* Digital clock */}
        <div class="text-9xl font-bold text-center text-green-900">
          {today().toLocaleTimeString([], { hour12: false })}
        </div>

        {/* Right badge */}
        <div class="flex justify-end mr-25">
          <HexBadge size={195} value={hijriDay()} />
        </div>
      </div>

      {/* Bottom row: dates */}
      <div class="text-green-900 flex justify-between px-6">
        <div class="text-[4vh] font-bold">
          {DAY_NAMES[today().getDay()]}, {MONTH_NAMES[today().getMonth()]}{" "}
          {today().getFullYear()}
        </div>

        <div class="text-[4vh] font-bold">
          {hijriMonth()},{hijriYear()}
        </div>
      </div>
    </div>
  );
}
