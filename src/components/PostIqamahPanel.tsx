export default function PostIqamahPanel() {
  return (
    <div class="h-full flex flex-col justify-center items-center text-center leading-relaxed">
      {/* Main Arabic text */}
      <div class="text-9xl text-white leading-relaxed">
        سَوُّوا صُفُوفَكُمْ، فَإِنَّ تَسْوِيَةَ الصُّفُوفِ مِنْ إِقَامَةِ
        الصَّلاَةِ
      </div>

      {/* Translation */}
      <div class="mt-9 text-7xl text-white leading-snug">
        Luruskanlah saf-saf kamu kerana meluruskan saf itu termasuk di dalam
        mendirikan solat
      </div>

      {/* Source */}
      <div class="mt-9 text-5xl text-yellow-300">Riwayat al-Bukhari (723)</div>
    </div>
  );
}
