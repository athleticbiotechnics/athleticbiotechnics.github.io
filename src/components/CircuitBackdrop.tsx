type Tint = "signal" | "deep" | "neutral";

/* Photography-forward backdrop.

   The photograph is the layer that matters, so it is rendered at full
   opacity with only a mild brightness pull, and the scrim is chosen to match
   where the copy actually sits:

     "left"  — copy hugs the left edge, so only that edge is darkened and the
               centre/right of the frame stays completely clear.
     "veil"  — copy spans the full width, so an even, light veil keeps the
               photograph readable underneath the text rather than hiding it.

   When no photograph is supplied the frame falls back to a hairline grid. */
export function CircuitBackdrop({
  grid = true,
  image,
  position = "center center",
  scrim = "veil",
  className = "",
}: {
  /** Accepted for call-site compatibility; the palette is now monochrome. */
  tint?: Tint;
  grid?: boolean;
  image?: string;
  position?: string;
  scrim?: "left" | "veil" | "none";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
    >
      {/* flat base — no gradient wash */}
      <div className="absolute inset-0" style={{ background: "var(--ark-bg)" }} />

      {image ? (
        <>
          <img
            src={image}
            alt=""
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: position, filter: "contrast(1.03) saturate(1.03)", imageRendering: "auto" }}
          />

          {scrim === "left" && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(6,8,12,0.74) 0%, rgba(6,8,12,0.42) 32%, rgba(6,8,12,0) 62%)",
              }}
            />
          )}
          {scrim === "veil" && (
            <div className="absolute inset-0" style={{ background: "rgba(6,8,12,0.5)" }} />
          )}

          {/* seams: let each section melt into the next without hiding the frame */}
          <div
            className="absolute inset-x-0 top-0 h-28"
            style={{ background: "linear-gradient(180deg, rgba(6,8,12,0.7), rgba(6,8,12,0))" }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-32"
            style={{ background: "linear-gradient(0deg, var(--ark-bg), rgba(6,8,12,0))" }}
          />
        </>
      ) : (
        grid && (
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(var(--ark-line-soft) 1px, transparent 1px), linear-gradient(90deg, var(--ark-line-soft) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              maskImage: "radial-gradient(ellipse at 50% 40%, #000 40%, transparent 78%)",
              WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, #000 40%, transparent 78%)",
            }}
          />
        )
      )}
    </div>
  );
}
