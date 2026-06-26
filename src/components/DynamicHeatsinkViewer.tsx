import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function DynamicHeatsinkViewer({ src, alt }: { src: string; alt: string }) {
  const [motionEnabled, setMotionEnabled] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionEnabled(!reducedMotion.matches);
    sync();
    reducedMotion.addEventListener("change", sync);
    return () => reducedMotion.removeEventListener("change", sync);
  }, []);

  return (
    <div
      className="relative flex items-center justify-center py-4 min-h-[min(52vh,440px)]"
      role="img"
      aria-label={alt}
    >
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(90,150,255,0.16) 0%, transparent 70%)",
        }}
      />
      <motion.div
        animate={
          motionEnabled
            ? {
                rotateY: [0, 18, 0, -18, 0],
                rotateX: [4, -3, 4],
              }
            : { rotateY: 0, rotateX: 0 }
        }
        transition={
          motionEnabled
            ? {
                rotateY: { duration: 14, repeat: Infinity, ease: "easeInOut" },
                rotateX: { duration: 7, repeat: Infinity, ease: "easeInOut" },
              }
            : { duration: 0 }
        }
        style={{
          transformPerspective: 1400,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-[min(100%,22rem)]"
      >
        <img
          src={src}
          alt=""
          aria-hidden
          className="w-full h-auto drop-shadow-[0_32px_90px_rgba(0,0,0,0.7)]"
          style={{ imageRendering: "auto" }}
          draggable={false}
        />
      </motion.div>
    </div>
  );
}
