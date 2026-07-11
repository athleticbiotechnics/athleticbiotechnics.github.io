import { ArrowLeft, ArrowRight } from "lucide-react";
import { CircuitBackdrop } from "@/components/CircuitBackdrop";
import { DeviceMockup } from "@/components/DeviceMockup";
import { BlackBoxViewer } from "@/components/BlackBoxViewer";
import { BlackBoxExploded } from "@/components/BlackBoxExploded";
import { Reveal } from "@/components/Reveal";
import type { ProductSpec } from "@/constants/products";
import { images } from "@/assets/images";

// Both backdrops use high-resolution sources (glacier-beach was only 1024px).
const { glacierField, alpineBackground, blackbox1, blackbox2, blackbox3, blackbox4 } = images;

function Panel({
  className = "",
  children,
  style,
}: {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-lg ${className}`}
      style={{
        background: "var(--ark-panel)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid var(--ark-line)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function PrimaryBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ark-focus ark-btn-primary group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-sm text-sm transition-colors duration-150"
      style={{
        background: "var(--ark-btn)",
        backgroundImage: "none",
        color: "var(--ark-btn-ink)",
        fontFamily: "var(--ark-body)",
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}

/* BlackBox render gallery — the four V1 product shots, full-bleed rows. */
const GALLERY_SHOTS = [
  {
    src: blackbox1,
    alt: "BlackBox V1 on a workbench, USB-C and universal interface header visible",
    caption: "V1 enclosure · on the bench",
    full: true,
  },
  {
    src: blackbox3,
    alt: "Exploded render — top enclosure, carrier PCB, and bottom plate separated with fasteners",
    caption: "Assembly · four fasteners, no glue",
    full: false,
  },
  {
    src: blackbox4,
    alt: "BlackBox with wiring harness, probe tips, and labelled internals",
    caption: "Harness · probes · internals",
    full: false,
  },
  {
    src: blackbox2,
    alt: "Six orthographic views of the BlackBox V1 — faces, ports, and interface header",
    caption: "Every face · ports and header",
    full: true,
  },
];

function BlackBoxGallery() {
  return (
    <section className="relative py-24 px-6" style={{ background: "var(--ark-bg-2)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <span style={{ fontFamily: "var(--ark-nordic)", fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ark-signal)", display: "block", marginBottom: "1.1rem" }}>
            AX-BB1 · renders
          </span>
          <h2 style={{ fontFamily: "var(--ark-display)", fontWeight: 700, fontSize: "clamp(1.9rem, 3.4vw, 2.8rem)", lineHeight: 0.98, color: "var(--ark-ink)" }}>
            From every angle.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {GALLERY_SHOTS.map((shot, i) => (
            <figure key={shot.caption} className={shot.full ? "md:col-span-2" : ""}>
              <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--ark-line)" }}>
                <img src={shot.src} alt={shot.alt} loading="lazy" className="block w-full h-auto" />
              </div>
              <figcaption className="mt-3 flex items-baseline gap-3">
                <span style={{ fontFamily: "var(--ark-mono)", fontSize: "0.6rem", letterSpacing: "0.14em", color: "var(--ark-faint)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontFamily: "var(--ark-mono)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ark-muted)" }}>
                  {shot.caption}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductDescriptionPage({
  product,
  onHome,
  onBack,
  backLabel,
  onReserve,
  onContact,
}: {
  product: ProductSpec;
  onHome: () => void;
  onBack: () => void;
  backLabel: string;
  onReserve?: () => void;
  onContact?: () => void;
}) {
  const isBlackbox = product.id === "blackbox";
  return (
    <>
    <main
      className="relative min-h-screen overflow-hidden px-6 pt-32 pb-24"
      style={{ background: "var(--ark-bg)" }}
    >
      <CircuitBackdrop
        tint={product.id === "blackbox" ? "signal" : "deep"}
        image={product.id === "blackbox" ? glacierField : alpineBackground}
      />

      <div className="relative z-20 max-w-6xl mx-auto">
        <div className="mb-8 flex flex-wrap items-center gap-6">
          <button onClick={onHome} className="ark-focus inline-flex items-center gap-2 text-sm" style={{ fontFamily: "var(--ark-body)", color: "var(--ark-ink-dim)" }}>
            <ArrowLeft size={14} /> Home
          </button>
          <button onClick={onBack} className="ark-focus inline-flex items-center gap-2 text-sm" style={{ fontFamily: "var(--ark-body)", color: "var(--ark-ink-dim)" }}>
            <ArrowLeft size={14} /> {backLabel}
          </button>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-start">
          <Reveal>
            <span
              style={{
                fontFamily: "var(--ark-nordic)",
                fontSize: "0.72rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--ark-signal)",
                display: "block",
                marginBottom: "1rem",
              }}
            >
              {product.code} · {product.kind}
            </span>
            <h1
              style={{
                fontFamily: "var(--ark-display)",
                fontWeight: 600,
                fontSize: "clamp(2.3rem, 4.4vw, 3.8rem)",
                lineHeight: 0.98,
                letterSpacing: "0",
                color: "var(--ark-ink)",
                marginBottom: "1rem",
              }}
            >
              {product.name}
            </h1>
            <p style={{ fontFamily: "var(--ark-body)", fontSize: "1.18rem", color: "var(--ark-signal)", lineHeight: 1.4, marginBottom: "1.4rem" }}>
              {product.tagline}
            </p>
            <p style={{ fontFamily: "var(--ark-body)", fontSize: "1.02rem", color: "var(--ark-ink-dim)", lineHeight: 1.8, maxWidth: "38rem", marginBottom: "1.75rem" }}>
              {product.summary}
            </p>

            <div className="flex flex-wrap gap-3 mb-9">
              {onReserve && <PrimaryBtn onClick={onReserve}>{product.reserveLabel} <ArrowRight size={14} /></PrimaryBtn>}
              {onContact && (
                <button onClick={onContact} className="ark-focus inline-flex items-center gap-2 px-7 py-3.5 rounded-sm text-sm border transition-colors duration-150 hover:border-white/45" style={{ fontFamily: "var(--ark-body)", borderColor: "rgba(255,255,255,0.24)", color: "var(--ark-ink)" }}>
                  Talk to us
                </button>
              )}
            </div>

            <Panel className="p-6 mb-6">
              <h2 style={{ fontFamily: "var(--ark-display)", fontWeight: 600, fontSize: "1.25rem", color: "var(--ark-ink)", marginBottom: "1rem" }}>What it does</h2>
              <ul className="grid gap-3">
                {product.features.map((feature) => (
                  <li key={feature} style={{ fontFamily: "var(--ark-body)", fontSize: "0.95rem", color: "var(--ark-ink-dim)", lineHeight: 1.65, paddingLeft: "0.9rem", borderLeft: "2px solid var(--ark-signal-deep)" }}>
                    {feature}
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel className="p-6">
              <h2 style={{ fontFamily: "var(--ark-display)", fontWeight: 600, fontSize: "1.25rem", color: "var(--ark-ink)", marginBottom: "1rem" }}>Specifications</h2>
              <dl className="grid gap-0 divide-y" style={{ borderColor: "var(--ark-line-soft)" }}>
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex flex-col sm:flex-row sm:justify-between gap-1 py-3 first:pt-0 last:pb-0" style={{ borderColor: "var(--ark-line-soft)" }}>
                    <dt style={{ fontFamily: "var(--ark-mono)", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ark-muted)" }}>{spec.label}</dt>
                    <dd style={{ fontFamily: "var(--ark-body)", fontSize: "0.95rem", color: "var(--ark-ink)" }}>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          </Reveal>

          <Reveal delay={0.1} variant="scale">
            <Panel className="p-6 lg:sticky lg:top-28">
              {isBlackbox ? (
                <BlackBoxViewer />
              ) : (
                <DeviceMockup kind={product.mockup} className="w-full h-auto" />
              )}
              <div className="mt-4 flex items-center justify-between">
                <span style={{ fontFamily: "var(--ark-mono)", fontSize: "0.66rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ark-muted)" }}>{product.code}</span>
                <span style={{ fontFamily: "var(--ark-mono)", fontSize: "0.66rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ark-signal)" }}>{product.status}</span>
              </div>
            </Panel>
          </Reveal>
        </div>
      </div>
    </main>

    {/* Sticky-scroll sections live outside <main> — its overflow-hidden
        (needed for the backdrop) would break position: sticky. */}
    {isBlackbox && (
      <>
        <BlackBoxExploded
          eyebrow="AX-BB1 · teardown"
          title="Scroll to take it apart."
          subtitle="Four parts between you and the recorder: the printed shell lifts, the radio module and carrier PCB separate, and the bottom plate drops away."
        />
        <BlackBoxGallery />
      </>
    )}
    </>
  );
}
