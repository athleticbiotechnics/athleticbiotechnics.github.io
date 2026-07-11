import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  BLACKBOX_MODELS,
  addStudioLights,
  createPcbMaterial,
  createShellMaterial,
  createShieldMaterial,
  loadBlackboxStl,
} from "@/lib/blackboxModels";
import { images } from "@/assets/images";

const DISPLAY = "var(--ark-display)";
const BODY = "var(--ark-body)";
const MONO = "var(--ark-mono)";
const NORDIC = "var(--ark-nordic)";

/* Each part separates over its own slice of the scroll ("window"), top first,
   so the unit peels apart layer by layer instead of popping open at once. */
const PART_DEFS = [
  {
    key: "top",
    url: BLACKBOX_MODELS.top,
    label: "Top enclosure",
    note: "Printed shell · status LEDs",
    window: [0.02, 0.52] as const,
    offset: 54,
    material: createShellMaterial,
  },
  {
    key: "esp32",
    url: BLACKBOX_MODELS.esp32,
    label: "ESP-WROOM-32",
    note: "Radio + compute module",
    window: [0.18, 0.66] as const,
    offset: 23,
    material: createShieldMaterial,
  },
  {
    key: "circuit",
    url: BLACKBOX_MODELS.circuit,
    label: "Carrier PCB",
    note: "Sensors · USB-C · universal header",
    window: [0.34, 0.8] as const,
    offset: 5,
    material: createPcbMaterial,
    // The PCB export faces the other way — flip so components sit on top.
    flip: true,
  },
  {
    key: "bottomPlate",
    url: BLACKBOX_MODELS.bottomPlate,
    label: "Bottom plate",
    note: "Four screws, fully serviceable",
    window: [0.48, 0.98] as const,
    offset: -30,
    material: createShellMaterial,
  },
];

function subProgress(p: number, [a, b]: readonly [number, number]) {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/* Scroll-driven exploded view of the BlackBox V1 assembly. The section pins
   for ~3 viewport heights while the four printed/fabbed parts separate. */
export function BlackBoxExploded({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [activeParts, setActiveParts] = useState<boolean[]>(() => PART_DEFS.map(() => false));

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  /* The intro copy hands the frame to the model once the teardown starts —
     on narrow screens the lifted shell would otherwise sit behind the text. */
  const introOpacity = useTransform(scrollYProgress, [0.05, 0.3], [1, 0]);
  const introY = useTransform(scrollYProgress, [0.05, 0.3], [0, -24]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    const next = PART_DEFS.map((d) => subProgress(v, d.window) > 0.12);
    setActiveParts((prev) => (prev.every((b, i) => b === next[i]) ? prev : next));
  });

  useEffect(() => {
    if (reducedMotion) {
      // Static exploded pose, no scroll choreography.
      progressRef.current = 0.85;
      setActiveParts(PART_DEFS.map(() => true));
    }

    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setStatus("error");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    Object.assign(renderer.domElement.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
    });
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 1, 2000);
    addStudioLights(scene, 1.5);

    const group = new THREE.Group();
    scene.add(group);

    const materials = PART_DEFS.map((d) => d.material());
    const parts: { mesh: THREE.Mesh; assembledY: number; offset: number; window: readonly [number, number] }[] = [];
    let disposed = false;

    Promise.all(PART_DEFS.map((d) => loadBlackboxStl(d.url)))
      .then((geometries) => {
        if (disposed) return;

        /* Geometries arrive centred in their own frames, so rebuild the stack
           from measured part heights: plate → PCB → module, shell over all. */
        const size = new THREE.Vector3();
        const heights = geometries.map((g) => {
          (g.boundingBox ?? new THREE.Box3()).getSize(size);
          return size.y;
        });
        const [topH, espH, circuitH, plateH] = heights;
        const plateY = plateH / 2;
        const circuitY = plateH + 1.5 + circuitH / 2;
        const espY = plateH + 1.5 + circuitH + espH / 2 - 2;
        const shellY = plateH - 1 + topH / 2;
        const assembled = [shellY, espY, circuitY, plateY];

        const minY = 0;
        const maxY = plateH - 1 + topH;
        const centerShift = (minY + maxY) / 2;

        PART_DEFS.forEach((def, i) => {
          const mesh = new THREE.Mesh(geometries[i], materials[i]);
          if ("flip" in def && def.flip) mesh.rotation.x = Math.PI;
          group.add(mesh);
          parts.push({ mesh, assembledY: assembled[i] - centerShift, offset: def.offset, window: def.window });
        });
        setStatus("ready");
      })
      .catch(() => {
        if (!disposed) setStatus("error");
      });

    /* Half-tangents of the vertical/horizontal fov, refreshed on resize, so
       the dolly can fit the 90 mm-wide assembly on narrow viewports too. */
    const fit = { vHalf: Math.tan((camera.fov * Math.PI) / 360), hHalf: 0.3 };
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      fit.hHalf = fit.vHalf * camera.aspect;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let inView = true;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(host);

    let frame = 0;
    const loop = (time: number) => {
      frame = requestAnimationFrame(loop);
      if (!inView) return;
      const p = progressRef.current;
      for (const part of parts) {
        part.mesh.position.y = part.assembledY + subProgress(p, part.window) * part.offset;
      }
      group.rotation.y = -0.5 + p * 1.05 + Math.sin(time / 4200) * 0.03;
      // Dolly out as the stack grows; never let the 90 mm width clip sideways.
      const zV = (26 + 50 * p) / fit.vHalf;
      const zH = 64 / fit.hHalf;
      const z = Math.max(zV, zH) * 1.08;
      camera.position.set(0, z * 0.24 + p * 6, z);
      // Look-at rises with progress so the lifted shell clears the fixed navbar.
      camera.lookAt(0, 4 + p * 18, 0);
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, [reducedMotion]);

  return (
    <section className="relative" style={{ background: "var(--ark-bg)" }}>
      <div ref={trackRef} style={{ height: reducedMotion ? "100vh" : "320vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* stage */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(70% 62% at 50% 46%, rgba(168,203,232,0.18) 0%, rgba(120,160,200,0.06) 45%, rgba(6,8,12,0) 74%)" }}
          />
          <div ref={hostRef} className="absolute inset-0" aria-hidden={status !== "error"} />

          {status === "error" && (
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <img
                src={images.blackbox3}
                alt="Exploded render of the BlackBox V1 — top enclosure, carrier PCB, and bottom plate separated"
                className="max-h-[70vh] w-auto max-w-full rounded-lg"
                style={{ border: "1px solid var(--ark-line)" }}
              />
            </div>
          )}

          {status === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span style={{ fontFamily: MONO, fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ark-muted)" }}>
                Loading assembly…
              </span>
            </div>
          )}

          {/* overlay copy */}
          <div className="absolute inset-0 pointer-events-none px-6 lg:px-10">
            <div className="max-w-6xl mx-auto h-full flex flex-col justify-between pt-28 pb-14">
              <motion.div className="max-w-xl" style={reducedMotion ? undefined : { opacity: introOpacity, y: introY }}>
                <span style={{ fontFamily: NORDIC, fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ark-signal)", display: "block", marginBottom: "1.1rem" }}>
                  {eyebrow}
                </span>
                <h2 className="ark-on-photo" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(1.9rem, 3.4vw, 2.8rem)", lineHeight: 0.98, color: "var(--ark-ink)", marginBottom: "0.9rem" }}>
                  {title}
                </h2>
                <p className="ark-on-photo" style={{ fontFamily: BODY, fontSize: "0.98rem", color: "var(--ark-ink-dim)", lineHeight: 1.7, maxWidth: "26rem" }}>
                  {subtitle}
                </p>
              </motion.div>

              <div className="flex items-end justify-between gap-6">
                <ul className="grid gap-3">
                  {PART_DEFS.map((d, i) => {
                    const active = activeParts[i];
                    return (
                      <li
                        key={d.key}
                        className="flex items-baseline gap-3 pl-4 border-l transition-all duration-500"
                        style={{ borderColor: active ? "var(--ark-signal)" : "var(--ark-line)", opacity: active ? 1 : 0.4 }}
                      >
                        <span style={{ fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.14em", color: active ? "var(--ark-signal)" : "var(--ark-faint)" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="ark-on-photo">
                          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1rem", color: "var(--ark-ink)" }}>{d.label}</div>
                          <div className="hidden sm:block" style={{ fontFamily: MONO, fontSize: "0.64rem", letterSpacing: "0.08em", color: "var(--ark-muted)", marginTop: "2px" }}>
                            {d.note}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {!reducedMotion && (
                  <motion.span
                    className="ark-on-photo hidden md:inline-flex items-center gap-2 whitespace-nowrap"
                    style={{ fontFamily: MONO, fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ark-ink-dim)", opacity: hintOpacity }}
                  >
                    Keep scrolling — it comes apart ↓
                  </motion.span>
                )}
              </div>
            </div>
          </div>

          {/* progress rail */}
          {!reducedMotion && (
            <div className="absolute bottom-0 inset-x-0 h-px pointer-events-none" style={{ background: "var(--ark-line-soft)" }}>
              <motion.div className="h-full origin-left" style={{ scaleX: barScale, background: "var(--ark-signal)" }} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
