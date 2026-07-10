import { ArrowLeft, ArrowRight } from "lucide-react";
import { CircuitBackdrop } from "@/components/CircuitBackdrop";
import { DeviceMockup } from "@/components/DeviceMockup";
import { Reveal } from "@/components/Reveal";
import type { ProductSpec } from "@/constants/products";
import { images } from "@/assets/images";

const { glacierField, glacierBeachBackground } = images;

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
      className="ark-focus group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-sm text-sm transition-colors duration-150 hover:bg-white"
      style={{
        background: "var(--ark-signal)",
        color: "#06080c",
        fontFamily: "var(--ark-body)",
        fontWeight: 600,
      }}
    >
      {children}
    </button>
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
  return (
    <main
      className="relative min-h-screen overflow-hidden px-6 pt-32 pb-24"
      style={{ background: "var(--ark-bg)" }}
    >
      <CircuitBackdrop
        tint={product.id === "blackbox" ? "signal" : "deep"}
        image={product.id === "blackbox" ? glacierField : glacierBeachBackground}
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
                fontFamily: "var(--ark-mono)",
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
              <DeviceMockup kind={product.mockup} className="w-full h-auto" />
              <div className="mt-4 flex items-center justify-between">
                <span style={{ fontFamily: "var(--ark-mono)", fontSize: "0.66rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ark-muted)" }}>{product.code}</span>
                <span style={{ fontFamily: "var(--ark-mono)", fontSize: "0.66rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ark-signal)" }}>{product.status}</span>
              </div>
            </Panel>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
