export default function BlackoutPanel() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "rgb(2, 2, 2)", // not pure black
        position: "relative",
      }}
    >
      {/* anti-sleep blinking dot */}
      <div
        style={{
          position: "absolute",
          bottom: "5vh",
          right: "5vh",
          width: "0.5vh",
          height: "0.5vh",
          "border-radius": "50%",
          background: "orange",
          animation: "blink 2s infinite",
        }}
      />
    </div>
  );
}
