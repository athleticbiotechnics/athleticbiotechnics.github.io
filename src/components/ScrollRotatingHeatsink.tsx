import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function ScrollRotatingHeatsink({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.15"],
  });

  const rotateY = useTransform(scrollYProgress, [0, 1], [-32, 32]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [10, -8]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.96]);

  return (
    <div ref={ref} className="relative h-[min(72vh,560px)] flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(90,150,255,0.14) 0%, transparent 68%)",
        }}
      />
      <motion.div
        style={{
          rotateY,
          rotateX,
          scale,
          transformPerspective: 1400,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-md"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto drop-shadow-[0_28px_80px_rgba(0,0,0,0.65)]"
          style={{ imageRendering: "auto" }}
          draggable={false}
        />
      </motion.div>
      <p
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.62rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "oklch(0.55 0.03 228)",
        }}
      >
        Scroll to rotate
      </p>
    </div>
  );
}
