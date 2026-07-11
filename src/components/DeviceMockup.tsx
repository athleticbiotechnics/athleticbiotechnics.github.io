/* Product renders. BlackBox uses the real V1 render; Draft still ships
   placeholder art — drop a replacement at src/imports/draft-render.* (or
   repoint the import in src/assets/images.ts). Any image aspect ratio works. */

import { images } from "@/assets/images";

const RENDERS: Record<"blackbox" | "draft", { src: string; alt: string }> = {
  blackbox: { src: images.blackbox1, alt: "BlackBox V1 recorder on a workbench — USB-C, trigger button, and universal interface header visible" },
  draft: { src: images.draftRender, alt: "Draft solder fume extractor — product render" },
};

export function DeviceMockup({
  kind,
  className = "",
}: {
  kind: "blackbox" | "draft";
  className?: string;
}) {
  const render = RENDERS[kind];
  return (
    <img
      src={render.src}
      alt={render.alt}
      loading="lazy"
      className={`block rounded-md ${className}`}
      style={{ objectFit: "contain" }}
    />
  );
}
