// MediaPanel.tsx

type PosterPanelProps = {
  imageUrl: string; // SINGLE IMAGE MODE
};

export default function PosterPanel(props: PosterPanelProps) {
  if (!props.imageUrl || props.imageUrl === "") {
    return (
      <div class="w-full h-full bg-[url('/logo2.png')] bg-repeat">
        <div>Poster!</div>
      </div>
    );
  }
  return (
    <div class="absolute inset-0 z-10 bg-black">
      <img
        src={props.imageUrl}
        alt="Poster"
        class="w-full h-full object-cover"
      />
    </div>
  );
}
