type PhotoBackdropProps = {
  image: string;
  position?: string;
  opacity?: number;
  brightness?: number;
  overlay?: "light" | "medium" | "heavy";
};

const OVERLAY_STYLES = {
  light:
    "linear-gradient(180deg, rgba(3,8,18,0.35) 0%, rgba(5,14,30,0.22) 45%, rgba(3,8,18,0.5) 100%)",
  medium:
    "linear-gradient(180deg, rgba(3,8,18,0.48) 0%, rgba(5,14,30,0.32) 45%, rgba(3,8,18,0.62) 100%)",
  heavy:
    "linear-gradient(180deg, rgba(3,8,18,0.58) 0%, rgba(5,14,30,0.46) 45%, rgba(3,8,18,0.76) 100%)",
};

export function PhotoBackdrop({
  image,
  position = "center center",
  opacity = 0.92,
  brightness = 0.88,
  overlay = "medium",
}: PhotoBackdropProps) {
  return (
    <>
      <img
        src={image}
        alt=""
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{
          objectPosition: position,
          opacity,
          filter: `brightness(${brightness}) saturate(1.04)`,
          imageRendering: "auto",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: OVERLAY_STYLES[overlay] }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 24%, rgba(255,255,255,0.06) 0%, transparent 55%)",
        }}
      />
    </>
  );
}
