export default function BlackoutPanel() {
  return (
    <div class="w-full h-full bg-[rgb(2,2,2)] relative">
      {/* anti-sleep blinking dot */}
      <div class="absolute bottom-[5vh] right-[5vh] w-[0.5vh] h-[0.5vh] rounded-full bg-orange-500 animate-pulse"></div>
    </div>
  );
}
