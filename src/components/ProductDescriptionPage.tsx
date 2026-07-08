import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { PhotoBackdrop } from "@/components/PhotoBackdrop";
import { DynamicHeatsinkViewer } from "@/components/DynamicHeatsinkViewer";
import { FadeIn } from "@/components/FadeIn";
import type { ProductSpec } from "@/constants/products";
import { PAGE_BACKDROPS } from "@/constants/backgrounds";
import glacierHeatsinkRender from "@/imports/glacier-heatsink-render.png";

function GlassPanel({
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
      className={`backdrop-blur-[10px] bg-slate-950/[0.5] border border-white/[0.16] rounded-2xl ${className}`}
      style={{
        backdropFilter: "blur(6px) saturate(1.08)",
        background: "rgba(5,12,26,0.58)",
        boxShadow:
          "inset 0 1.5px 0 rgba(200,230,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.22), 0 24px 64px rgba(0,0,0,0.56)",
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
      className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-medium tracking-wide overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(255, 255, 255, 0.09)",
        backdropFilter: "blur(14px) saturate(1.3)",
        border: "1px solid rgba(255, 255, 255, 0.17)",
        color: "rgba(255, 255, 255, 0.92)",
        boxShadow:
          "inset 0 1.5px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.28)",
        fontFamily: "'Barlow', sans-serif",
      }}
    >
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
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
      className="relative min-h-screen overflow-hidden px-6 pt-36 pb-24"
      style={{ background: "oklch(0.064 0.026 246)" }}
    >
      <PhotoBackdrop {...PAGE_BACKDROPS.product} />

      <div className="relative z-20 max-w-6xl mx-auto">
        <GlassPanel className="mb-8 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={onHome}
              className="inline-flex items-center gap-2 text-sm"
              style={{ fontFamily: "'Barlow', sans-serif", color: "oklch(0.78 0.05 218)" }}
            >
              <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} />
              Home
            </button>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm"
              style={{ fontFamily: "'Barlow', sans-serif", color: "oklch(0.78 0.05 218)" }}
            >
              <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} />
              {backLabel}
            </button>
          </div>
        </GlassPanel>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-start">
          <FadeIn>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "oklch(0.72 0.11 204)",
                display: "block",
                marginBottom: "1rem",
              }}
            >
              Product description
            </span>
            <h1
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 300,
                fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                lineHeight: 0.95,
                color: "rgba(255,255,255,0.97)",
                marginBottom: "1rem",
              }}
            >
              {product.name}
            </h1>
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.88)",
                lineHeight: 1.78,
                maxWidth: "38rem",
                marginBottom: "1.5rem",
              }}
            >
              {product.summary}
            </p>
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: "0.95rem",
                color: "oklch(0.72 0.06 210)",
                lineHeight: 1.7,
                maxWidth: "34rem",
                marginBottom: "1.75rem",
              }}
            >
              {product.tagline}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {onReserve && (
                <PrimaryBtn onClick={onReserve}>
                  Reserve Glacier <ArrowRight size={14} />
                </PrimaryBtn>
              )}
            </div>

            <GlassPanel className="p-6 mb-6">
              <h2
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600,
                  fontSize: "1.35rem",
                  color: "rgba(255,255,255,0.94)",
                  marginBottom: "0.85rem",
                }}
              >
                Highlights
              </h2>
              <ul className="grid gap-3">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: "0.95rem",
                      color: "oklch(0.76 0.02 228)",
                      lineHeight: 1.65,
                      paddingLeft: "1rem",
                      borderLeft: "2px solid rgba(120,180,255,0.25)",
                    }}
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </GlassPanel>

            <GlassPanel className="p-6">
              <h2
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600,
                  fontSize: "1.35rem",
                  color: "rgba(255,255,255,0.94)",
                  marginBottom: "0.85rem",
                }}
              >
                Specifications
              </h2>
              <dl className="grid gap-3">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-white/[0.06] pb-3"
                  >
                    <dt
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.68rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "oklch(0.62 0.055 216)",
                      }}
                    >
                      {spec.label}
                    </dt>
                    <dd
                      style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: "0.95rem",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </GlassPanel>
          </FadeIn>

          <FadeIn delay={0.1}>
            {product.showHeatsink ? (
              <GlassPanel className="p-6 lg:sticky lg:top-32">
                <DynamicHeatsinkViewer
                  src={glacierHeatsinkRender}
                  alt="ARKTOS Glacier dual-tower air cooler render"
                />
              </GlassPanel>
            ) : (
              <GlassPanel className="p-8 min-h-[320px] flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="text-center"
                >
                  <p
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 600,
                      fontSize: "2rem",
                      color: "rgba(255,255,255,0.92)",
                    }}
                  >
                    {product.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: "0.92rem",
                      color: "oklch(0.68 0.02 228)",
                      marginTop: "0.75rem",
                    }}
                  >
                    Visual prototype coming soon
                  </p>
                </motion.div>
              </GlassPanel>
            )}
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
