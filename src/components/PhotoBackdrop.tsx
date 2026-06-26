type PhotoBackdropProps = {
  image: string;
  position?: string;
  opacity?: number;
  brightness?: number;
  saturation?: number;
  overlay?: "minimal" | "light" | "medium" | "heavy";
  scale?: number;
};

const OVERLAY_STYLES: Record<NonNullable<PhotoBackdropProps["overlay"]>, string> = {
  minimal:
    "linear-gradient(180deg, rgba(3,8,18,0.18) 0%, rgba(5,14,30,0.12) 48%, rgba(3,8,18,0.28) 100%)",
  light:
    "linear-gradient(180deg, rgba(3,8,18,0.32) 0%, rgba(5,14,30,0.2) 45%, rgba(3,8,18,0.42) 100%)",
  medium:
    "linear-gradient(180deg, rgba(3,8,18,0.48) 0%, rgba(5,14,30,0.32) 45%, rgba(3,8,18,0.62) 100%)",
  heavy:
    "linear-gradient(180deg, rgba(3,8,18,0.58) 0%, rgba(5,14,30,0.46) 45%, rgba(3,8,18,0.76) 100%)",
};

export function PhotoBackdrop({
  image,
  position = "center center",
  opacity = 0.92,
  brightness = 0.96,
  saturation = 1.04,
  overlay = "medium",
  scale = 1,
}: PhotoBackdropProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      <img
        src={image}
        alt=""
        decoding="async"
        fetchPriority="high"
        className="absolute left-1/2 top-1/2 min-w-full min-h-full max-w-none"
        style={{
          width: `${scale * 100}%`,
          height: `${scale * 100}%`,
          objectFit: "cover",
          objectPosition: position,
          opacity,
          filter: `brightness(${brightness}) saturate(${saturation})`,
          transform: "translate(-50%, -50%)",
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
            "radial-gradient(ellipse at 50% 22%, rgba(255,255,255,0.05) 0%, transparent 58%)",
        }}
      />
    </div>
  );
}

export function PageBackdrop({ preset }: { preset: PhotoBackdropProps }) {
  return <PhotoBackdrop {...preset} />;
}
