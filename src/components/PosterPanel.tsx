type PosterPanelProps = {
  imageUrls: string[];
  currentIndex: number;
};

export default function PosterPanel(props: PosterPanelProps) {
  const url = () => {
    const urls = props.imageUrls;
    if (!urls.length) return null;
    const i = props.currentIndex % urls.length;
    return urls[i] || null;
  };

  if (!url()) {
    return (
      <div class="w-full h-full bg-[url('/logo2.png')] bg-repeat">
        <div>Poster!</div>
      </div>
    );
  }
  return (
    <div class="absolute inset-0 z-10 bg-black">
      <img
        src={url()}
        alt="Poster"
        class="w-full h-full object-cover"
      />
    </div>
  );
}
