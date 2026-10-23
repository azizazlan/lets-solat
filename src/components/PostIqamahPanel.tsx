export default function PostIqamahPanel() {
  return (
    <div class="w-full h-full bg-[url('/logo2.png')] bg-repeat flex flex-col justify-center items-center text-center px-[3vw]">
      {/* Main Arabic text */}
      <div class="text-[min(4.3vw,7.7vh)] text-white leading-[1.28] [text-shadow:0_2px_14px_rgba(0,0,0,0.45)]">
        سَوُّوا صُفُوفَكُمْ، فَإِنَّ تَسْوِيَةَ الصُّفُوفِ مِنْ إِقَامَةِ
        الصَّلاَةِ
      </div>

      {/* Translation */}
      <div class="mt-[3.7vh] text-[min(2.28vw,4.1vh)] text-white leading-[1.3]">
        Luruskanlah saf-saf kamu kerana meluruskan saf itu termasuk di dalam
        mendirikan solat
      </div>

      {/* Source */}
      <div class="mt-[2.5vh] text-[min(1.47vw,2.52vh)] text-yellow-300 tracking-wide">
        Riwayat al-Bukhari (723)
      </div>
    </div>
  );
}
