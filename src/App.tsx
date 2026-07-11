import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Rewind,
  Radio,
  Plug,
  Cpu,
  Menu,
  X,
  Activity,
  Gauge,
  Terminal,
  Zap,
  CircuitBoard,
  Wind,
  Youtube,
  Instagram,
  MessageCircle,
  Eye,
  EyeOff,
  Lock,
  CreditCard,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { CookieBanner } from "@/components/CookieBanner";
import { CircuitBackdrop } from "@/components/CircuitBackdrop";
import { DeviceMockup } from "@/components/DeviceMockup";
import { BlackBoxExploded } from "@/components/BlackBoxExploded";
import { RewindTimeline } from "@/components/RewindTimeline";
import { Reveal } from "@/components/Reveal";
import { ProductDescriptionPage } from "@/components/ProductDescriptionPage";
import { images } from "@/assets/images";
import {
  PRIVACY_POLICY_INTRO,
  PRIVACY_POLICY_LAST_UPDATED,
  PRIVACY_POLICY_SECTIONS,
  PRIVACY_POLICY_SUMMARY,
} from "@/content/privacy-policy";
import {
  ACCESSIBILITY_LAST_UPDATED,
  ACCESSIBILITY_SECTIONS,
} from "@/content/accessibility-statement";
import { SOCIAL_LINKS } from "@/constants/social";
import { PRODUCTS, PRODUCT_IDS, type ProductId } from "@/constants/products";
import { ARKTOS_EMAIL } from "@/config/env";
import { submitToFormspree } from "@/lib/formspree";
import { useSmoothScroll, scrollToTop, scrollToId } from "@/lib/useSmoothScroll";

const {
  logoTaskbar,
  logoPanoramic,
  logoWordmark,
  kenzoTree,
  sidakProfile,
  glacierCave,
  glacierPrototype,
  alpineBackground,
  mcdonaldLakeBackground,
  arcticIce,
  careersBackground,
  productSpecBackground,
} = images;

/* ── Shared type tokens ───────────────────────────────────────────── */
const DISPLAY = "var(--ark-display)";
const BODY = "var(--ark-body)";
const MONO = "var(--ark-mono)";
/* Nordic/Poiret accent face used for small uppercase labels. */
const NORDIC = "var(--ark-nordic)";
/* Original Aquire wordmark for the Arktos taskbar logo. */
const WORDMARK = "var(--ark-wordmark)";

const LOGO_STYLE: React.CSSProperties = {
  filter: "invert(1) brightness(1.12) contrast(1.05)",
  mixBlendMode: "screen",
};

/* ── Primitives ───────────────────────────────────────────────────── */
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
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`ark-focus ark-btn-primary group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-sm text-sm transition-colors duration-150 disabled:opacity-50 ${className}`}
      style={{
        background: "var(--ark-btn)",
        backgroundImage: "none",
        color: "var(--ark-btn-ink)",
        fontFamily: BODY,
        fontWeight: 600,
        letterSpacing: "0.01em",
      }}
    >
      {children}
    </button>
  );
}

function GhostBtn({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`ark-focus group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-sm text-sm border transition-colors duration-150 hover:border-white/45 ${className}`}
      style={{ background: "transparent", borderColor: "rgba(255,255,255,0.24)", color: "var(--ark-ink)", fontFamily: BODY }}
    >
      {children}
    </button>
  );
}

function Eyebrow({ children, color = "var(--ark-signal)" }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ fontFamily: NORDIC, fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase", color, display: "block", marginBottom: "1.1rem" }}>
      {children}
    </span>
  );
}

/* ── Social ───────────────────────────────────────────────────────── */
const SOCIAL_LINK_ICONS = {
  youtube: <Youtube size={15} />,
  instagram: <Instagram size={15} />,
  discord: <MessageCircle size={15} />,
} as const;

function SocialLinkButtons({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {SOCIAL_LINKS.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="ark-focus inline-flex items-center gap-2 rounded-lg px-3 py-2 border transition-colors duration-200 hover:text-white/90 hover:border-white/20"
          style={{ borderColor: "var(--ark-line)", background: "rgba(255,255,255,0.03)", color: "var(--ark-muted)", fontFamily: BODY, fontSize: compact ? "0.78rem" : "0.84rem", textDecoration: "none" }}
        >
          {SOCIAL_LINK_ICONS[item.id]}
          {item.label}
        </a>
      ))}
    </div>
  );
}

/* ── Falling snow (very slight, Arktos ambience) ──────────────────── */
function Snow() {
  const flakes = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 2.4 + 0.8,
      delay: Math.random() * 16,
      duration: Math.random() * 8 + 12,
      opacity: Math.random() * 0.4 + 0.15,
      drift: (Math.random() - 0.5) * 60,
    }))
  ).current;

  return (
    <div className="fixed inset-0 z-[5] pointer-events-none overflow-hidden" aria-hidden>
      {flakes.map((f) => (
        <span
          key={f.id}
          className="ark-flake absolute top-0 rounded-full"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            background: "#ffffff",
            ["--flake-opacity" as string]: f.opacity,
            ["--flake-drift" as string]: `${f.drift}px`,
            animation: `ark-snow ${f.duration}s linear ${f.delay}s infinite`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

/* ── Announcement bar ─────────────────────────────────────────────── */
function AnnouncementBar({ onReserve, onClose }: { onReserve: () => void; onClose: () => void }) {
  return (
    <div
      className="w-full flex items-center justify-center gap-3 px-10 py-2.5 text-center relative"
      style={{ background: "linear-gradient(180deg, #0a0d13 0%, #06080c 100%)", borderBottom: "1px solid var(--ark-line-soft)" }}
    >
      <span className="inline-flex items-center justify-center gap-2.5 flex-wrap" style={{ fontFamily: MONO, fontSize: "0.72rem", letterSpacing: "0.04em", color: "var(--ark-muted)" }}>
        <span
          style={{
            fontFamily: NORDIC,
            fontSize: "0.58rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ark-ink-dim)",
            padding: "2px 9px",
            borderRadius: "999px",
            border: "1px solid var(--ark-line)",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          New
        </span>
        <span>BlackBox V1 prototype units are on the reserve list.</span>
        <button
          onClick={onReserve}
          className="ark-focus inline-flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors hover:text-white"
          style={{ color: "var(--ark-ink)", fontFamily: MONO, fontSize: "0.68rem", border: "1px solid rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.04)" }}
        >
          Reserve yours →
        </button>
      </span>
      <button onClick={onClose} aria-label="Dismiss announcement" className="ark-focus absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100" style={{ color: "var(--ark-muted)" }}>
        <X size={13} />
      </button>
    </div>
  );
}

/* ── Navbar ───────────────────────────────────────────────────────── */
type NavItem =
  | { label: string; kind: "section"; section: string }
  | { label: string; kind: "page"; page: "specs" }
  | { label: string; kind: "product"; id: ProductId };

const NAV_LINKS: NavItem[] = [
  { label: "BlackBox", kind: "product", id: "blackbox" },
  { label: "Draft", kind: "product", id: "draft" },
  { label: "Mission", kind: "section", section: "mission" },
  { label: "Team", kind: "section", section: "team" },
  { label: "Specs", kind: "page", page: "specs" },
];

function Navbar({
  scrolled,
  showAnnouncement,
  onHome,
  onReserve,
  onContact,
  onSpecs,
  onProduct,
  onSection,
  onCloseAnnouncement,
}: {
  scrolled: boolean;
  showAnnouncement: boolean;
  onHome: () => void;
  onReserve: () => void;
  onContact: () => void;
  onSpecs: () => void;
  onProduct: (id: ProductId) => void;
  onSection: (section: string) => void;
  onCloseAnnouncement: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const handleNav = (link: NavItem) => {
    if (link.kind === "section") onSection(link.section);
    else if (link.kind === "product") onProduct(link.id);
    else onSpecs();
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {showAnnouncement && <AnnouncementBar onReserve={onReserve} onClose={onCloseAnnouncement} />}

      <div
        className="w-full flex items-center justify-between px-6 lg:px-10 py-3.5 transition-all duration-300 border-b relative"
        style={{
          background: scrolled ? "rgba(6,8,12,0.92)" : "rgba(6,8,12,0.34)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderColor: scrolled ? "var(--ark-line)" : "transparent",
        }}
      >
        <button className="ark-focus flex items-center gap-3" onClick={onHome} aria-label="Arktos home">
          <div className="h-9 w-9 rounded-lg overflow-hidden flex items-center justify-center ring-1 ring-white/10" style={{ background: "rgba(8,16,32,0.5)" }}>
            <ImageWithFallback src={logoTaskbar} alt="Arktos Systems" className="h-[76%] w-[76%] object-contain" style={LOGO_STYLE} />
          </div>
          <span style={{ fontFamily: WORDMARK, fontSize: "0.98rem", fontWeight: 600, letterSpacing: "0.02em", color: "var(--ark-ink)" }}>
            Arktos<span style={{ color: "var(--ark-muted)", fontWeight: 400 }}> Systems</span>
          </span>
        </button>

        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <button
                type="button"
                onClick={() => handleNav(link)}
                className="ark-focus transition-colors"
                style={{ fontFamily: BODY, fontWeight: 400, fontSize: "0.9rem", color: "var(--ark-ink-dim)", background: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#fff")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--ark-ink-dim)")}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={onContact} className="ark-focus text-sm transition-colors hover:text-white" style={{ fontFamily: BODY, color: "var(--ark-ink-dim)", background: "none", border: "none", cursor: "pointer" }}>
            Contact
          </button>
          <PrimaryBtn className="!px-5 !py-2.5" onClick={onReserve}>
            Reserve <ArrowRight size={14} />
          </PrimaryBtn>
        </div>

        <button className="ark-focus md:hidden" style={{ color: "var(--ark-ink-dim)" }} onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* scroll progress */}
        <motion.div className="absolute bottom-0 left-0 h-px" style={{ width, background: "var(--ark-signal)" }} />
      </div>

      {open && (
        <div className="md:hidden p-6 border-b" style={{ background: "rgba(6,8,12,0.98)", borderColor: "var(--ark-line)" }}>
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <button type="button" onClick={() => { setOpen(false); handleNav(link); }} style={{ fontFamily: BODY, color: "var(--ark-ink-dim)", fontSize: "0.95rem", background: "none", border: "none" }}>
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-5 border-t flex flex-col gap-3" style={{ borderColor: "var(--ark-line-soft)" }}>
            <GhostBtn onClick={() => { setOpen(false); onContact(); }}>Contact</GhostBtn>
            <PrimaryBtn onClick={() => { setOpen(false); onReserve(); }}>Reserve <ArrowRight size={14} /></PrimaryBtn>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────── */
function Hero({ onBlackBox, onDraft, onReserve }: { onBlackBox: () => void; onDraft: () => void; onReserve: () => void }) {
  const chips = [
    { k: "RAIL", v: "3.30 V" },
    { k: "CURRENT", v: "180 mA" },
    { k: "UART", v: "live" },
    { k: "GPIO", v: "×4" },
  ];

  return (
    <section id="home" className="relative w-full min-h-screen flex items-center overflow-hidden pt-36 pb-20 px-6">
      <CircuitBackdrop image={mcdonaldLakeBackground} position="center 45%" scrim="left" />

      <div className="relative z-20 max-w-6xl mx-auto w-full grid lg:grid-cols-[1.04fr_0.96fr] gap-14 lg:gap-10 items-start">
        {/* copy column sits high */}
        <div className="lg:pt-6">
          <span className="inline-flex items-center mb-8">
            <span style={{ fontFamily: MONO, fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ark-ink-dim)" }}>
              Arktos Systems · bench instruments
            </span>
          </span>

          <h1
            className="ark-on-photo"
            style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(2.5rem, 5vw, 4.3rem)", lineHeight: 0.96, letterSpacing: "0", color: "#ffffff" }}
          >
            Rewind the moment
            <br />
            <span style={{ color: "var(--ark-signal)" }}>your board died.</span>
          </h1>

          <p
            className="ark-on-photo"
            style={{ fontFamily: BODY, fontSize: "1.1rem", color: "var(--ark-ink-dim)", lineHeight: 1.72, maxWidth: "33rem", marginTop: "1.8rem" }}
          >
            Arktos builds precision instruments for people who build circuit boards.{" "}
            <strong style={{ color: "#fff", fontWeight: 600 }}>BlackBox</strong> records the signals your board checks first, so you replay the failure instead of chasing it — and{" "}
            <strong style={{ color: "#fff", fontWeight: 600 }}>Draft</strong> pulls solder fumes away at the tip.
          </p>

          <div className="flex flex-wrap gap-3 mt-9">
            <PrimaryBtn onClick={onBlackBox}>Explore BlackBox <ArrowRight size={15} /></PrimaryBtn>
            <GhostBtn onClick={onDraft}>See Draft <ArrowUpRight size={15} /></GhostBtn>
          </div>

          <div className="flex flex-wrap gap-x-7 gap-y-3 mt-10">
            {chips.map((c) => (
              <span key={c.k} className="inline-flex items-baseline gap-2">
                <span className="ark-on-photo" style={{ fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.16em", color: "var(--ark-muted)" }}>{c.k}</span>
                <span className="ark-on-photo" style={{ fontFamily: MONO, fontSize: "0.82rem", color: "var(--ark-signal)" }}>{c.v}</span>
              </span>
            ))}
          </div>
        </div>

        {/* instrument column drops low and pushes left over the copy */}
        <div className="lg:mt-32 lg:-ml-10 xl:-ml-16">
          <RewindTimeline />
          <button onClick={onReserve} className="ark-focus ark-on-photo mt-3 inline-flex items-center gap-1.5 hover:text-white transition-colors" style={{ fontFamily: MONO, fontSize: "0.72rem", letterSpacing: "0.08em", color: "var(--ark-ink-dim)", background: "none", border: "none", cursor: "pointer" }}>
            Drag the playhead — that's the whole idea <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── "Works next to" strip — static, no scroll animation ──────────── */
function ToolMarquee() {
  const tools = ["Breadboards", "Raspberry Pi", "STM32", "ESP32", "Arduino", "Custom PCBs", "KiCad", "Saleae", "JLCPCB", "Pinecil", "Rigol scopes"];
  return (
    <section className="relative py-12 px-6 border-y" style={{ background: "var(--ark-bg-2)", borderColor: "var(--ark-line-soft)" }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.42fr_1.58fr] gap-8 lg:gap-14 items-baseline">
        <p style={{ fontFamily: MONO, fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ark-muted)", lineHeight: 1.7 }}>
          Works next to what's already on your bench
        </p>
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
          {tools.map((t) => (
            <span key={t} style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: "1.06rem", color: "var(--ark-ink-dim)" }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Product rows ─────────────────────────────────────────────────── */
function ProductRow({
  id,
  index,
  onExplore,
  onReserve,
}: {
  id: ProductId;
  index: number;
  onExplore: (id: ProductId) => void;
  onReserve: () => void;
}) {
  const product = PRODUCTS[id];
  const flip = index % 2 === 1;

  /* Deliberately uneven: the copy column is wider, the instrument column
     overlaps it, and each row hangs at a different height. */
  return (
    <div
      className={`grid lg:grid-cols-[1.08fr_0.92fr] gap-10 lg:gap-0 items-start ${
        flip ? "lg:pt-24" : ""
      }`}
    >
      <div className={`ark-on-photo relative z-10 ${flip ? "lg:order-2 lg:pl-16 lg:pt-10" : "lg:pr-16"}`}>
        <Eyebrow>{product.code} · {product.kind}</Eyebrow>
        <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(1.9rem, 3.4vw, 2.8rem)", lineHeight: 0.98, letterSpacing: "0", color: "var(--ark-ink)", marginBottom: "1rem" }}>
          {product.name}
        </h3>
        <p style={{ fontFamily: BODY, fontSize: "1.05rem", color: "var(--ark-signal)", marginBottom: "1rem" }}>{product.tagline}</p>
        <p style={{ fontFamily: BODY, fontSize: "0.98rem", color: "var(--ark-ink-dim)", lineHeight: 1.75, maxWidth: "34rem", marginBottom: "1.6rem" }}>{product.summary}</p>
        <ul className="grid gap-3 mb-8 border-l" style={{ borderColor: "var(--ark-line)" }}>
          {product.features.slice(0, 4).map((f) => (
            <li key={f} className="pl-4" style={{ fontFamily: BODY, fontSize: "0.92rem", color: "var(--ark-ink-dim)", lineHeight: 1.6 }}>
              {f}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <PrimaryBtn onClick={() => onExplore(id)}>Explore {product.name} <ArrowRight size={14} /></PrimaryBtn>
          <GhostBtn onClick={onReserve}>{product.reserveLabel}</GhostBtn>
        </div>
      </div>

      <div className={flip ? "lg:order-1 lg:-mr-20 lg:mt-0" : "lg:-ml-20 lg:mt-28"}>
        <Panel className="p-8">
          <DeviceMockup kind={product.mockup} className="w-full h-auto" />
        </Panel>
      </div>
    </div>
  );
}

function Products({ onProduct, onReserve }: { onProduct: (id: ProductId) => void; onReserve: () => void }) {
  return (
    <section id="products" className="relative py-28 px-6 overflow-hidden" style={{ background: "var(--ark-bg)" }}>
      <CircuitBackdrop tint="deep" grid={false} image={glacierPrototype} position="center 35%" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <Reveal className="max-w-2xl mb-20">
          <Eyebrow>Two instruments</Eyebrow>
          <h2 className="ark-on-photo" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: 1.02, color: "var(--ark-ink)", marginBottom: "1.1rem" }}>
            Tools for the two worst parts of building hardware.
          </h2>
          <p style={{ fontFamily: BODY, fontSize: "1.05rem", color: "var(--ark-ink-dim)", lineHeight: 1.8 }}>
            A board that dies without telling you why, and a bench full of solder smoke. We built one instrument for each.
          </p>
        </Reveal>

        <div className="flex flex-col gap-28">
          {PRODUCT_IDS.map((id, i) => (
            <ProductRow key={id} id={id} index={i} onExplore={onProduct} onReserve={onReserve} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Signal chain (how BlackBox works) ────────────────────────────── */
function SignalChain() {
  const steps = ["Target board", "Wiring harness", "BlackBox", "Circular buffer", "USB-C", "Desktop timeline"];
  return (
    <section className="relative py-24 px-6 overflow-hidden" style={{ background: "var(--ark-bg-2)" }}>
      <div className="relative z-10 max-w-6xl mx-auto">
        <Reveal className="mb-12 max-w-2xl">
          <Eyebrow>How BlackBox works</Eyebrow>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)", lineHeight: 1.02, letterSpacing: "0", color: "var(--ark-ink)" }}>
            Always recording. You just rewind.
          </h2>
        </Reveal>
        <ol className="flex flex-wrap items-baseline gap-x-10 gap-y-6">
          {steps.map((s, i) => (
            <li key={s} className="flex items-baseline gap-3 pt-4 border-t" style={{ borderColor: "var(--ark-line-soft)", minWidth: "132px" }}>
              <span style={{ fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.14em", color: "var(--ark-signal)" }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontFamily: BODY, fontSize: "0.92rem", color: "var(--ark-ink)" }}>{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Signals grid ─────────────────────────────────────────────────── */
function Signals() {
  const signals = [
    { icon: <Gauge size={20} />, title: "Power rails", body: "Up to 2 rails, brownout and startup-dip detection, every change timestamped." },
    { icon: <Activity size={20} />, title: "Current", body: "Continuous board current with spike and abnormal-mode detection from a high-side INA228." },
    { icon: <Terminal size={20} />, title: "UART", body: "Full serial capture — boot logs and firmware debug output, all timestamped." },
    { icon: <Zap size={20} />, title: "Reset line", body: "Watchdog, brownout, and manual resets, caught the moment they happen." },
    { icon: <CircuitBoard size={20} />, title: "GPIO ×4", body: "Four configurable inputs — name them Motor Enable, Fault Pin, whatever you're chasing." },
    { icon: <Radio size={20} />, title: "Analog in", body: "One configurable channel for a battery rail, a thermistor, or a sensor output." },
  ];
  return (
    <section className="relative py-32 px-6 overflow-hidden" style={{ background: "var(--ark-bg)" }}>
      <CircuitBackdrop grid={false} image={glacierCave} position="center 45%" />
      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[0.76fr_1.24fr] gap-14 lg:gap-20 items-start">
        <div className="lg:sticky lg:top-32">
          <Eyebrow>V1 signal set</Eyebrow>
          <h2 className="ark-on-photo" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(1.9rem, 3.3vw, 2.8rem)", lineHeight: 0.98, letterSpacing: "0", color: "var(--ark-ink)" }}>
            The signals engineers check first.
          </h2>
          <p className="mt-6" style={{ fontFamily: BODY, fontSize: "0.95rem", color: "var(--ark-muted)", lineHeight: 1.75, maxWidth: "22rem" }}>
            Six channels, one harness, every sample stamped against the same clock.
          </p>
        </div>

        {/* staggered indents — deliberately not a grid of cards */}
        <ul>
          {signals.map((s, i) => (
            <li
              key={s.title}
              className={`flex gap-5 sm:gap-7 border-t ${i % 2 === 1 ? "lg:pl-16" : ""} ${i === 0 ? "pt-0 border-t-0 pb-8" : "py-8"}`}
              style={{ borderColor: "var(--ark-line-soft)" }}
            >
              <span className="pt-1 flex-shrink-0" style={{ fontFamily: MONO, fontSize: "0.62rem", letterSpacing: "0.14em", color: "var(--ark-faint)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="pt-0.5 flex-shrink-0" style={{ color: "var(--ark-signal)" }}>{s.icon}</span>
              <div className="ark-on-photo">
                <h3 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1.2rem", color: "var(--ark-ink)", marginBottom: "0.45rem" }}>{s.title}</h3>
                <p style={{ fontFamily: BODY, fontSize: "0.92rem", color: "var(--ark-ink-dim)", lineHeight: 1.7, maxWidth: "30rem" }}>{s.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Mission ──────────────────────────────────────────────────────── */
function Mission() {
  const pillars = [
    { icon: <Rewind size={20} />, title: "Rewind, don't reproduce", body: "A failure you can replay is a failure you can fix. We record first, so the timeline already has the answer." },
    { icon: <Radio size={20} />, title: "Capture at the source", body: "Measure where the event happens — at the pin, at the tip — not somewhere across the bench where it's already diluted." },
    { icon: <Plug size={20} />, title: "Fits the bench you have", body: "Breadboards, a Raspberry Pi, a custom PCB, a soldering iron you already own. One harness, one USB-C cable." },
    { icon: <Cpu size={20} />, title: "Built by two engineers", body: "A small team that states prototype status plainly and publishes honest specs, not aspirational ones." },
  ];

  return (
    <section id="mission" className="relative py-36 px-6 overflow-hidden" style={{ background: "var(--ark-bg-2)" }}>
      <CircuitBackdrop image={alpineBackground} />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="max-w-2xl mb-24">
          <Eyebrow>Our mission</Eyebrow>
          <h2 className="ark-on-photo" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(2rem, 3.7vw, 3.1rem)", lineHeight: 0.96, letterSpacing: "0", color: "var(--ark-ink)", marginBottom: "1.3rem" }}>
            The bench should tell you the truth.
          </h2>
          <p className="ark-on-photo" style={{ fontFamily: BODY, fontSize: "1.05rem", color: "var(--ark-ink-dim)", lineHeight: 1.8 }}>
            Debugging hardware is mostly guessing at events you didn't see and breathing air you shouldn't. Arktos makes instruments that record what actually happened and keep the bad stuff away from your face — so building boards feels less like detective work.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-12">
          {pillars.map((p, i) => (
            <div key={p.title} className="ark-on-photo">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b" style={{ borderColor: "var(--ark-line)" }}>
                <span style={{ color: "var(--ark-signal)" }}>{p.icon}</span>
                <span style={{ fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.16em", color: "var(--ark-muted)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1.35rem", lineHeight: 1.15, color: "var(--ark-ink)", marginBottom: "0.6rem" }}>{p.title}</h3>
              <p style={{ fontFamily: BODY, fontSize: "0.92rem", color: "var(--ark-ink-dim)", lineHeight: 1.75 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Team ─────────────────────────────────────────────────────────── */
const TEAM = [
  {
    name: "Sidak Mann",
    title: "Co-founder · Firmware & software",
    bio: "Sidak writes the STM32 firmware that does the real-time recording and the desktop app you rewind in. He came from distributed systems and real-time work, and cares most about catching a fault in microseconds and making the replay readable.",
    accent: "var(--ark-signal)",
    photo: sidakProfile,
    photoPosition: "center 32%",
  },
  {
    name: "Kenzo Liddle",
    title: "Co-founder · Mechanical & CAD",
    bio: "Kenzo designs the enclosures, the Draft collar and hose, and the wiring harness. He splits his time between CAD and thermodynamics, and pushes hard on manufacturing that fits real benches and doesn't waste stock.",
    accent: "#ffffff",
    photo: kenzoTree,
    photoPosition: "center 52%",
  },
];

function Team() {
  return (
    <section id="team" className="relative py-28 px-6 overflow-hidden" style={{ background: "var(--ark-bg)" }}>
      <CircuitBackdrop grid={false} image={mcdonaldLakeBackground} position="center 38%" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <Eyebrow>Meet the team</Eyebrow>
          <h2 className="ark-on-photo" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(1.9rem, 3.4vw, 2.9rem)", lineHeight: 0.98, letterSpacing: "0", color: "var(--ark-ink)" }}>
            Built by engineers, for engineers.
          </h2>
        </div>
        <div className="grid md:grid-cols-[1.08fr_0.92fr] gap-8 lg:gap-14 items-start">
          {TEAM.map((m, i) => (
            <div key={m.name} className={i === 1 ? "md:mt-28" : ""}>
              <Panel className="p-8 flex flex-col gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ border: `1px solid ${m.accent}44` }}>
                    <img src={m.photo} alt={`${m.name}`} className="w-full h-full object-cover" style={{ objectPosition: m.photoPosition }} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1.3rem", color: "var(--ark-ink)" }}>{m.name}</h3>
                    <span style={{ fontFamily: MONO, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: m.accent }}>{m.title}</span>
                  </div>
                </div>
                <div className="w-full h-px" style={{ background: "var(--ark-line-soft)" }} />
                <p style={{ fontFamily: BODY, fontSize: "0.93rem", color: "var(--ark-ink-dim)", lineHeight: 1.8 }}>{m.bio}</p>
              </Panel>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ──────────────────────────────────────────────────────────── */
function CTA({ onReserve, onContact }: { onReserve: () => void; onContact: () => void }) {
  return (
    <section className="relative py-40 px-6 overflow-hidden" style={{ background: "var(--ark-bg-2)" }}>
      <CircuitBackdrop image={arcticIce} position="center 55%" scrim="left" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="max-w-xl">
          <Eyebrow>Put one on your bench</Eyebrow>
          <h2 className="ark-on-photo" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(2.1rem, 4vw, 3.2rem)", lineHeight: 0.95, letterSpacing: "0", color: "#ffffff" }}>
            Reserve a<br />prototype unit.
          </h2>
          <p className="ark-on-photo" style={{ fontFamily: BODY, fontSize: "1rem", color: "var(--ark-ink-dim)", lineHeight: 1.8, maxWidth: "31rem", marginTop: "1.5rem" }}>
            We're building the first BlackBox and Draft units with a small group of embedded engineers. Join the reserve list — it's an expression of interest, no payment required.
          </p>
          <div className="flex flex-wrap gap-3 mt-9">
            <PrimaryBtn onClick={onReserve}>Reserve a unit <ArrowRight size={14} /></PrimaryBtn>
            <GhostBtn onClick={onContact}>Talk to us</GhostBtn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Reserve page ─────────────────────────────────────────────────── */
const FORM_LABEL_STYLE: React.CSSProperties = { fontFamily: MONO, fontSize: "0.66rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ark-muted)" };
const FORM_FIELD_CLASS = "ark-focus w-full rounded-lg px-4 py-3 outline-none border";
const FORM_FIELD_STYLE: React.CSSProperties = { background: "rgba(255,255,255,0.04)", borderColor: "var(--ark-line)", color: "var(--ark-ink)", fontFamily: BODY };

function BackBar({ onHome, label = "Back to Arktos" }: { onHome: () => void; label?: string }) {
  return (
    <button onClick={onHome} className="ark-focus mb-8 inline-flex items-center gap-2 text-sm" style={{ fontFamily: BODY, color: "var(--ark-ink-dim)" }}>
      <ArrowLeft size={14} /> {label}
    </button>
  );
}

/* Stripe checkout — visual placeholder until Stripe is configured. Replace the
   body of this component with the real Stripe Embedded Checkout / Payment
   Element once keys and a backend session are wired up. */
function StripeCheckoutPlaceholder() {
  return (
    <Panel className="p-7">
      <div className="flex items-center justify-between mb-5">
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1.25rem", color: "var(--ark-ink)" }}>Payment</span>
        <span className="inline-flex items-center gap-1.5" style={{ fontFamily: MONO, fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ark-muted)" }}>
          <Lock size={12} /> Stripe
        </span>
      </div>

      <div className="mb-6 rounded-lg px-4 py-3 flex items-start gap-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)" }}>
        <Lock size={15} style={{ color: "var(--ark-muted)", marginTop: "2px", flexShrink: 0 }} />
        <p style={{ fontFamily: BODY, fontSize: "0.85rem", color: "var(--ark-ink-dim)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--ark-ink)", fontWeight: 600 }}>Checkout isn't live yet.</strong> The Stripe payment form will load here once configured — this is a placeholder and no card is charged.
        </p>
      </div>

      <div className="grid gap-4 select-none" aria-hidden="true">
        <label className="grid gap-2">
          <span style={FORM_LABEL_STYLE}>Email</span>
          <div className={FORM_FIELD_CLASS} style={{ ...FORM_FIELD_STYLE, color: "var(--ark-faint)" }}>you@example.com</div>
        </label>
        <label className="grid gap-2">
          <span style={FORM_LABEL_STYLE}>Card information</span>
          <div className="rounded-lg overflow-hidden border" style={{ borderColor: "var(--ark-line)" }}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.04)" }}>
              <span style={{ fontFamily: MONO, fontSize: "0.85rem", color: "var(--ark-faint)" }}>1234 1234 1234 1234</span>
              <CreditCard size={16} style={{ color: "var(--ark-faint)" }} />
            </div>
            <div className="grid grid-cols-2 border-t" style={{ borderColor: "var(--ark-line)" }}>
              <span className="px-4 py-3 border-r" style={{ borderColor: "var(--ark-line)", fontFamily: MONO, fontSize: "0.85rem", color: "var(--ark-faint)", background: "rgba(255,255,255,0.04)" }}>MM / YY</span>
              <span className="px-4 py-3" style={{ fontFamily: MONO, fontSize: "0.85rem", color: "var(--ark-faint)", background: "rgba(255,255,255,0.04)" }}>CVC</span>
            </div>
          </div>
        </label>
        <label className="grid gap-2">
          <span style={FORM_LABEL_STYLE}>Name on card</span>
          <div className={FORM_FIELD_CLASS} style={{ ...FORM_FIELD_STYLE, color: "var(--ark-faint)" }}>Full name</div>
        </label>
      </div>

      <button
        type="button"
        disabled
        className="inline-flex w-full items-center justify-center gap-2 px-7 py-3.5 rounded-sm text-sm mt-6 cursor-not-allowed"
        style={{ background: "var(--ark-btn)", color: "var(--ark-btn-ink)", fontFamily: BODY, fontWeight: 600, opacity: 0.55 }}
      >
        <Lock size={14} /> Pay — awaiting Stripe setup
      </button>

      <p className="mt-4 text-center" style={{ fontFamily: MONO, fontSize: "0.64rem", letterSpacing: "0.1em", color: "var(--ark-faint)" }}>
        Secured by Stripe · placeholder
      </p>
    </Panel>
  );
}

function ReservePage({ onHome }: { onHome: () => void; initialProduct?: ProductId }) {
  const product = PRODUCTS.blackbox;
  const editionName = "BlackBox: Founder's Edition";

  return (
    <main className="relative min-h-screen overflow-hidden px-6 pt-32 pb-24" style={{ background: "var(--ark-bg)" }}>
      <CircuitBackdrop tint="signal" image={glacierCave} />
      {/* Gray theme layer — a soft gray wash plus a fine gray dot grid that
          fades down the page, tying the checkout to the gray button palette. */}
      <div aria-hidden className="absolute inset-0 z-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(72,77,86,0.42) 0%, rgba(72,77,86,0.16) 30%, rgba(72,77,86,0.04) 55%, transparent 72%)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(180,188,200,0.16) 1px, transparent 0)",
            backgroundSize: "24px 24px",
            maskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.35) 46%, transparent 82%)",
            WebkitMaskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.35) 46%, transparent 82%)",
          }}
        />
      </div>
      <div className="relative z-20 max-w-6xl mx-auto">
        <BackBar onHome={onHome} />
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-start">
          <Reveal>
            <Eyebrow>Checkout</Eyebrow>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "clamp(2.2rem, 4.3vw, 3.6rem)", lineHeight: 0.98, letterSpacing: "0", color: "var(--ark-ink)", marginBottom: "1.3rem" }}>
              {editionName}
            </h1>
            <p style={{ fontFamily: BODY, fontSize: "1.05rem", color: "var(--ark-ink-dim)", lineHeight: 1.8, maxWidth: "36rem" }}>
              The first production run of BlackBox, reserved for early supporters. Founders get prototype access, build updates, and founders pricing.
            </p>

            <Panel className="mt-8 p-6 max-w-lg">
              <div className="flex items-center gap-5">
                <div className="w-28 flex-shrink-0 rounded-lg overflow-hidden" style={{ border: "1px solid var(--ark-line)" }}>
                  <DeviceMockup kind="blackbox" className="w-full h-auto" />
                </div>
                <div className="min-w-0">
                  <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1.05rem", color: "var(--ark-ink)" }}>{editionName}</div>
                  <div style={{ fontFamily: MONO, fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ark-muted)", marginTop: "3px" }}>{product.code} · {product.status}</div>
                  <div style={{ fontFamily: BODY, fontSize: "0.85rem", color: "var(--ark-ink-dim)", lineHeight: 1.55, marginTop: "0.6rem" }}>{product.tagline}</div>
                </div>
              </div>
              <div className="mt-5 pt-4 flex items-baseline justify-between" style={{ borderTop: "1px solid var(--ark-line-soft)" }}>
                <span style={{ fontFamily: BODY, fontSize: "0.9rem", color: "var(--ark-muted)" }}>Founders pricing</span>
                <span style={{ fontFamily: MONO, fontSize: "0.85rem", color: "var(--ark-ink-dim)" }}>Set at launch</span>
              </div>
            </Panel>
          </Reveal>

          <Reveal delay={0.1}>
            <StripeCheckoutPlaceholder />
          </Reveal>
        </div>
      </div>
    </main>
  );
}

/* ── Contact page ─────────────────────────────────────────────────── */
function ContactPage({ onHome }: { onHome: () => void }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fields = [
    ["name", "Full name", "Your name", "text", true],
    ["email", "Email", "you@example.com", "email", true],
    ["company", "Company / team", "Organization or handle", "text", false],
    ["subject", "Subject", "Partnership, support, press...", "text", false],
  ] as const;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("_subject", "[CONTACT] New Arktos inquiry");
    formData.set("form_type", "Contact");
    formData.set("_replyto", String(formData.get("email") ?? ""));
    try {
      await submitToFormspree(formData, "contact");
      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : `Something went wrong. Email ${ARKTOS_EMAIL} directly.`);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-6 pt-32 pb-24" style={{ background: "var(--ark-bg)" }}>
      <CircuitBackdrop tint="deep" image={arcticIce} />
      <div className="relative z-20 max-w-6xl mx-auto">
        <BackBar onHome={onHome} />
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-start">
          <Reveal>
            <Eyebrow>Contact Arktos</Eyebrow>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "clamp(2.2rem, 4.3vw, 3.6rem)", lineHeight: 0.98, letterSpacing: "0", color: "var(--ark-ink)" }}>
              Let's talk about<br />what you're building.
            </h1>
            <p style={{ fontFamily: BODY, fontSize: "1.02rem", color: "var(--ark-ink-dim)", lineHeight: 1.8, maxWidth: "34rem", marginTop: "1.4rem" }}>
              Whether you want a prototype on your bench, have a debugging problem BlackBox should catch, or just want to talk hardware — send a note and we'll get back to you.
            </p>
            <Panel className="mt-8 p-6 max-w-md">
              <p style={{ ...FORM_LABEL_STYLE, marginBottom: "0.6rem" }}>Direct email</p>
              <a href={`mailto:${ARKTOS_EMAIL}`} className="ark-focus" style={{ fontFamily: BODY, fontSize: "1rem", color: "var(--ark-signal)", textDecoration: "none" }}>{ARKTOS_EMAIL}</a>
            </Panel>
            <Panel className="mt-4 p-6 max-w-md">
              <p style={{ ...FORM_LABEL_STYLE, marginBottom: "0.75rem" }}>Community</p>
              <SocialLinkButtons />
            </Panel>
          </Reveal>

          <Reveal delay={0.1}>
            <Panel className="p-7">
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  {fields.map(([name, label, placeholder, type, required]) => (
                    <label key={name} className={`grid gap-2 ${name === "subject" ? "sm:col-span-2" : ""}`}>
                      <span style={FORM_LABEL_STYLE}>{label}</span>
                      <input name={name} type={type} required={required} placeholder={placeholder} className={FORM_FIELD_CLASS} style={FORM_FIELD_STYLE} />
                    </label>
                  ))}
                </div>
                <label className="grid gap-2">
                  <span style={FORM_LABEL_STYLE}>Message</span>
                  <textarea name="message" required placeholder="Tell us what you're working on and how we can help." className={`${FORM_FIELD_CLASS} min-h-32 resize-none`} style={FORM_FIELD_STYLE} />
                </label>
                <PrimaryBtn type="submit" disabled={status === "submitting"} className="justify-center mt-2">
                  {status === "submitting" ? "Sending..." : "Send message"} {status !== "submitting" && <ArrowRight size={14} />}
                </PrimaryBtn>
                {status === "success" && (
                  <div className="rounded-lg px-4 py-3 border" style={{ background: "rgba(168,203,232,0.08)", borderColor: "rgba(168,203,232,0.24)", color: "var(--ark-signal)", fontFamily: BODY }}>Thanks for reaching out. We'll reply to your email soon.</div>
                )}
                {status === "error" && (
                  <div className="rounded-lg px-4 py-3 border" style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.24)", color: "var(--ark-fault-2)", fontFamily: BODY }}>{errorMessage}</div>
                )}
                <p style={{ fontFamily: BODY, fontSize: "0.8rem", color: "var(--ark-faint)", lineHeight: 1.6 }}>Submissions are delivered securely through Formspree to {ARKTOS_EMAIL}.</p>
              </form>
            </Panel>
          </Reveal>
        </div>
      </div>
    </main>
  );
}

/* ── Careers page ─────────────────────────────────────────────────── */
function CareersPage({ onHome }: { onHome: () => void }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fields = [
    ["name", "Full name", "Your name", "text", true],
    ["email", "Email", "you@example.com", "email", true],
    ["role", "Role of interest", "Firmware, mechanical, software...", "text", false],
  ] as const;
  const openRoles = ["Embedded firmware (STM32, C)", "Desktop software (Qt / C++, Python)", "Mechanical & CAD (enclosures, airflow)", "Community & builder relations"];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("_subject", "[APPLICATION] Arktos job application");
    formData.set("form_type", "Application");
    formData.set("_replyto", String(formData.get("email") ?? ""));
    try {
      await submitToFormspree(formData, "contact");
      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : `Something went wrong. Email ${ARKTOS_EMAIL} directly.`);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-6 pt-32 pb-24" style={{ background: "var(--ark-bg)" }}>
      <CircuitBackdrop tint="neutral" image={careersBackground} />
      <div className="relative z-20 max-w-6xl mx-auto">
        <BackBar onHome={onHome} />
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-start">
          <Reveal>
            <Eyebrow>Careers at Arktos</Eyebrow>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "clamp(2.2rem, 4.3vw, 3.6rem)", lineHeight: 0.98, letterSpacing: "0", color: "var(--ark-ink)" }}>
              Build the instruments<br />other builders trust.
            </h1>
            <p style={{ fontFamily: BODY, fontSize: "1.02rem", color: "var(--ark-ink-dim)", lineHeight: 1.8, maxWidth: "34rem", marginTop: "1.4rem" }}>
              Arktos is a small team building bench instruments for hardware engineers. Send a short application and tell us what you'd want to build with us.
            </p>
            <Panel className="mt-8 p-6 max-w-md">
              <span style={{ ...FORM_LABEL_STYLE, display: "block", marginBottom: "0.75rem" }}>Open focus areas</span>
              <ul className="grid gap-2.5">
                {openRoles.map((r) => (
                  <li key={r} style={{ fontFamily: BODY, fontSize: "0.92rem", color: "var(--ark-ink-dim)" }}>{r}</li>
                ))}
              </ul>
            </Panel>
          </Reveal>

          <Reveal delay={0.1}>
            <Panel className="p-7">
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  {fields.map(([name, label, placeholder, type, required]) => (
                    <label key={name} className={`grid gap-2 ${name === "role" ? "sm:col-span-2" : ""}`}>
                      <span style={FORM_LABEL_STYLE}>{label}</span>
                      <input name={name} type={type} required={required} placeholder={placeholder} className={FORM_FIELD_CLASS} style={FORM_FIELD_STYLE} />
                    </label>
                  ))}
                </div>
                <label className="grid gap-2">
                  <span style={FORM_LABEL_STYLE}>Experience</span>
                  <textarea name="experience" required placeholder="Relevant work, projects, or skills you'd bring to Arktos." className={`${FORM_FIELD_CLASS} min-h-28 resize-none`} style={FORM_FIELD_STYLE} />
                </label>
                <label className="grid gap-2">
                  <span style={FORM_LABEL_STYLE}>Why Arktos</span>
                  <textarea name="why_join" required placeholder="What draws you here and what do you want to help build?" className={`${FORM_FIELD_CLASS} min-h-28 resize-none`} style={FORM_FIELD_STYLE} />
                </label>
                <PrimaryBtn type="submit" disabled={status === "submitting"} className="justify-center mt-2">
                  {status === "submitting" ? "Sending..." : "Send application"} {status !== "submitting" && <ArrowRight size={14} />}
                </PrimaryBtn>
                {status === "success" && (
                  <div className="rounded-lg px-4 py-3 border" style={{ background: "rgba(168,203,232,0.08)", borderColor: "rgba(168,203,232,0.24)", color: "var(--ark-signal)", fontFamily: BODY }}>Thanks for applying. We'll review and get back to you soon.</div>
                )}
                {status === "error" && (
                  <div className="rounded-lg px-4 py-3 border" style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.24)", color: "var(--ark-fault-2)", fontFamily: BODY }}>{errorMessage}</div>
                )}
                <p style={{ fontFamily: BODY, fontSize: "0.8rem", color: "var(--ark-faint)", lineHeight: 1.6 }}>Submissions are delivered securely through Formspree to {ARKTOS_EMAIL}.</p>
              </form>
            </Panel>
          </Reveal>
        </div>
      </div>
    </main>
  );
}

/* ── Specs page (BlackBox reference) ──────────────────────────────── */
function SpecsPage({ onHome, onReserve }: { onHome: () => void; onReserve: () => void }) {
  const bom = [
    ["STM32 NUCLEO-H743ZI2", "Main processor", "$40"],
    ["TI INA228 breakout", "Current sensor", "$20"],
    ["microSD module + 32GB card", "Storage", "$18"],
    ["USB-C receptacle + cable", "Power + data", "$8"],
    ["Buck converter (TPS62130)", "5V → 3.3V", "$5"],
    ["Protection (ESD, TVS, polyfuse)", "Front-end", "$10"],
    ["Universal pin header", "On-board interface", "$5"],
    ["Wiring harness kit", "Breadboard / Pi / PCB tips", "$10"],
    ["Custom PCB (JLCPCB)", "Fabrication", "$50"],
    ["3D-printed enclosure", "PLA prototype", "$15"],
    ["Miscellaneous", "Passives, connectors", "$25"],
  ];
  const targets = [
    ["Target 3.3V → Voltage input", "via harness"],
    ["Target GND → Ground", "via harness"],
    ["Target UART TX → Recorder RX", "via harness"],
    ["Target UART RX → Recorder TX", "via harness"],
    ["Target RESET → Digital input", "via harness"],
    ["Target GPIO → Digital input", "via harness"],
    ["Target power → INA228 inline", "current sense"],
  ];
  const roadmap = [
    { phase: "Phase 1", detail: "Custom PCB with universal pin header. Voltage, current, and UART recording to SD card." },
    { phase: "Phase 2", detail: "Desktop viewer over USB-C — timeline, graphs, event markers, zoom, search." },
    { phase: "Phase 3", detail: "GPIO recording, reset detection, trigger events, refined harness." },
    { phase: "Phase 4", detail: "Improved enclosure, expanded harness kit, field testing across breadboard, Pi, and PCB." },
  ];
  const stack = [["PCB design", "KiCad"], ["Firmware", "STM32CubeIDE"], ["Desktop app", "Qt · C++"], ["Prototyping", "Python"], ["Version control", "GitHub"]];

  return (
    <main className="relative min-h-screen overflow-hidden px-6 pt-32 pb-24" style={{ background: "var(--ark-bg)" }}>
      <CircuitBackdrop tint="signal" image={productSpecBackground} />
      <div className="relative z-20 max-w-6xl mx-auto">
        <BackBar onHome={onHome} />
        <Reveal className="max-w-3xl mb-12">
          <Eyebrow>BlackBox · AX-BB1 · V1 prototype</Eyebrow>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "clamp(2.2rem, 4.3vw, 3.6rem)", lineHeight: 0.98, letterSpacing: "0", color: "var(--ark-ink)", marginBottom: "1.2rem" }}>
            The build sheet.
          </h1>
          <p style={{ fontFamily: BODY, fontSize: "1.02rem", color: "var(--ark-ink-dim)", lineHeight: 1.8 }}>
            Everything in the V1 BlackBox prototype — the parts, the connections, and where it's headed. Figures reflect current engineering direction and will change through validation.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-6">
          <Reveal>
            <Panel className="p-7">
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1.4rem", color: "var(--ark-ink)", marginBottom: "1.2rem" }}>Prototype bill of materials</h2>
              <div className="grid gap-0 divide-y" style={{ borderColor: "var(--ark-line-soft)" }}>
                {bom.map(([part, role, cost]) => (
                  <div key={part} className="grid grid-cols-[1.4fr_1fr_auto] gap-3 py-3 first:pt-0 items-baseline" style={{ borderColor: "var(--ark-line-soft)" }}>
                    <span style={{ fontFamily: BODY, fontSize: "0.9rem", color: "var(--ark-ink)" }}>{part}</span>
                    <span style={{ fontFamily: BODY, fontSize: "0.8rem", color: "var(--ark-muted)" }}>{role}</span>
                    <span style={{ fontFamily: MONO, fontSize: "0.85rem", color: "var(--ark-signal)", textAlign: "right" }}>{cost}</span>
                  </div>
                ))}
                <div className="grid grid-cols-[1fr_auto] gap-3 pt-4 items-baseline">
                  <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "0.95rem", color: "var(--ark-ink)" }}>Estimated hardware cost</span>
                  <span style={{ fontFamily: MONO, fontSize: "1.05rem", color: "var(--ark-signal)", textAlign: "right" }}>≈ $206</span>
                </div>
              </div>
            </Panel>
          </Reveal>

          <div className="grid gap-6">
            <Reveal delay={0.06}>
              <Panel className="p-7">
                <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1.4rem", color: "var(--ark-ink)", marginBottom: "1.2rem" }}>V1 target connections</h2>
                <div className="grid gap-0 divide-y" style={{ borderColor: "var(--ark-line-soft)" }}>
                  {targets.map(([conn, note]) => (
                    <div key={conn} className="flex justify-between gap-3 py-2.5 first:pt-0" style={{ borderColor: "var(--ark-line-soft)" }}>
                      <span style={{ fontFamily: MONO, fontSize: "0.82rem", color: "var(--ark-ink-dim)" }}>{conn}</span>
                      <span style={{ fontFamily: MONO, fontSize: "0.7rem", color: "var(--ark-faint)" }}>{note}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            </Reveal>
            <Reveal delay={0.12}>
              <Panel className="p-7">
                <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1.4rem", color: "var(--ark-ink)", marginBottom: "1.2rem" }}>Software stack</h2>
                <div className="flex flex-wrap gap-2">
                  {stack.map(([k, v]) => (
                    <span key={k} className="inline-flex items-baseline gap-2 px-3 py-1.5 rounded-md" style={{ border: "1px solid var(--ark-line-soft)", background: "var(--ark-bg-2)" }}>
                      <span style={{ fontFamily: MONO, fontSize: "0.62rem", letterSpacing: "0.1em", color: "var(--ark-faint)" }}>{k}</span>
                      <span style={{ fontFamily: MONO, fontSize: "0.78rem", color: "var(--ark-ink)" }}>{v}</span>
                    </span>
                  ))}
                </div>
              </Panel>
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-6">
          <Panel className="p-7">
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1.4rem", color: "var(--ark-ink)", marginBottom: "1.4rem" }}>Development roadmap</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {roadmap.map((r) => (
                <div key={r.phase} className="p-5 rounded-lg" style={{ background: "var(--ark-bg-2)", border: "1px solid var(--ark-line-soft)" }}>
                  <div style={{ fontFamily: MONO, fontSize: "0.72rem", letterSpacing: "0.1em", color: "var(--ark-signal)", marginBottom: "0.6rem" }}>{r.phase}</div>
                  <p style={{ fontFamily: BODY, fontSize: "0.85rem", color: "var(--ark-ink-dim)", lineHeight: 1.7 }}>{r.detail}</p>
                </div>
              ))}
            </div>
          </Panel>
        </Reveal>

        <div className="mt-8">
          <PrimaryBtn onClick={onReserve}>Reserve a BlackBox <ArrowRight size={14} /></PrimaryBtn>
        </div>
      </div>
    </main>
  );
}

/* ── Legal ────────────────────────────────────────────────────────── */
function LegalPage({ type, onHome, a11y, onToggleA11y }: { type: "privacy" | "terms" | "accessibility"; onHome: () => void; a11y: boolean; onToggleA11y: () => void }) {
  const isPrivacy = type === "privacy";
  const isAccessibility = type === "accessibility";
  const sections = isPrivacy
    ? PRIVACY_POLICY_SECTIONS
    : isAccessibility
      ? ACCESSIBILITY_SECTIONS
      : [
        { title: "Use of the site", body: "This site presents Arktos Systems concepts, prototype information, and early-access opportunities. Product details may change as engineering validation continues." },
        { title: "Reservations", body: "Joining the reserve list is an expression of interest only. It does not reserve final inventory, guarantee price, confirm specifications, or require payment." },
        { title: "Prototype status", body: "BlackBox and Draft are in prototype development. Performance, compatibility, materials, availability, and shipping windows may change before launch." },
        { title: "Site content", body: "Arktos names, graphics, product concepts, and site assets are presented for Arktos Systems and may not be reused as a competing product identity without permission." },
      ];

  return (
    <main className="relative min-h-screen overflow-hidden px-6 pt-32 pb-24" style={{ background: "var(--ark-bg)" }}>
      <CircuitBackdrop tint="neutral" image={arcticIce} />
      <div className="relative z-20 max-w-4xl mx-auto">
        <BackBar onHome={onHome} />
        <Panel className="p-8 md:p-12">
          <Eyebrow>Arktos Systems</Eyebrow>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "clamp(2.1rem, 4.1vw, 3.4rem)", lineHeight: 1, letterSpacing: "0", color: "var(--ark-ink)", marginBottom: "1rem" }}>
            {isPrivacy ? "Privacy Policy" : isAccessibility ? "Accessibility Statement" : "Terms of Service"}
          </h1>
          <p style={{ fontFamily: BODY, fontSize: "0.95rem", color: "var(--ark-ink-dim)", lineHeight: 1.75, maxWidth: "42rem", marginBottom: "2rem" }}>
            Last updated {isPrivacy ? PRIVACY_POLICY_LAST_UPDATED : isAccessibility ? ACCESSIBILITY_LAST_UPDATED : "July 9, 2026"}.
            {isPrivacy ? ` ${PRIVACY_POLICY_INTRO}` : isAccessibility ? " This statement describes how we approach accessibility on the Arktos Systems website." : " This page covers the current Arktos Systems prototype website and reserve flow."}
          </p>

          {isAccessibility && (
            <div className="mb-8 p-5 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ background: "rgba(168,203,232,0.05)", border: "1px solid rgba(168,203,232,0.14)" }}>
              <div>
                <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1.2rem", color: "var(--ark-ink)", marginBottom: "0.35rem" }}>Accessibility mode</h2>
                <p style={{ fontFamily: BODY, fontSize: "0.92rem", color: "var(--ark-ink-dim)", lineHeight: 1.65 }}>Turn on high-contrast reading mode across the site.</p>
              </div>
              <button onClick={onToggleA11y} className="ark-focus inline-flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all" style={{ fontFamily: MONO, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", background: a11y ? "#fff" : "rgba(255,255,255,0.06)", border: a11y ? "1px solid #000" : "1px solid var(--ark-line)", color: a11y ? "#000" : "var(--ark-ink)" }} aria-pressed={a11y} aria-label="Toggle accessibility mode">
                {a11y ? <EyeOff size={14} /> : <Eye size={14} />}
                {a11y ? "Exit accessibility mode" : "Enable accessibility mode"}
              </button>
            </div>
          )}

          {isPrivacy && (
            <div className="mb-8 p-5 rounded-xl" style={{ background: "rgba(168,203,232,0.05)", border: "1px solid rgba(168,203,232,0.14)" }}>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1.2rem", color: "var(--ark-ink)", marginBottom: "0.75rem" }}>Summary of key points</h2>
              <ul className="grid gap-2" style={{ fontFamily: BODY, fontSize: "0.92rem", color: "var(--ark-ink-dim)", lineHeight: 1.7, paddingLeft: "1.1rem" }}>
                {PRIVACY_POLICY_SUMMARY.map((point) => (<li key={point.slice(0, 40)}>{point}</li>))}
              </ul>
            </div>
          )}

          <div className="grid gap-6">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1.35rem", color: "var(--ark-ink)", marginBottom: "0.5rem" }}>{section.title}</h2>
                <p style={{ fontFamily: BODY, fontSize: "0.96rem", color: "var(--ark-ink-dim)", lineHeight: 1.75 }}>{section.body}</p>
              </section>
            ))}
          </div>
        </Panel>
      </div>
    </main>
  );
}

/* ── Footer ───────────────────────────────────────────────────────── */
type FooterLinkItem = { label: string; action: () => void };
type FooterColumn = { title: string; links: FooterLinkItem[] };

function Footer({
  onLegalPage,
  onContact,
  onCareers,
  onProduct,
  onSpecs,
  onReserve,
  onSection,
}: {
  onLegalPage: (page: "privacy" | "terms" | "accessibility") => void;
  onContact: () => void;
  onCareers: () => void;
  onProduct: (id: ProductId) => void;
  onSpecs: () => void;
  onReserve: () => void;
  onSection: (section: string) => void;
}) {
  const columns: FooterColumn[] = [
    { title: "Products", links: [{ label: "BlackBox", action: () => onProduct("blackbox") }, { label: "Draft", action: () => onProduct("draft") }, { label: "Reserve", action: onReserve }] },
    { title: "Explore", links: [{ label: "Specs", action: onSpecs }, { label: "Mission", action: () => onSection("mission") }, { label: "Team", action: () => onSection("team") }] },
    { title: "Company", links: [{ label: "Contact", action: onContact }, { label: "Careers", action: onCareers }] },
    { title: "Legal", links: [{ label: "Privacy", action: () => onLegalPage("privacy") }, { label: "Terms", action: () => onLegalPage("terms") }, { label: "Accessibility", action: () => onLegalPage("accessibility") }] },
  ];

  return (
    <footer className="px-6 pt-16 pb-8 border-t relative" style={{ background: "var(--ark-bg-2)", borderColor: "var(--ark-line-soft)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] gap-12 lg:gap-16 items-start">
          <div className="flex flex-col gap-5 max-w-sm">
            <ImageWithFallback src={logoPanoramic} alt="Arktos Systems" className="h-12 w-auto max-w-[260px] object-contain" style={{ ...LOGO_STYLE, opacity: 0.75 }} />
            <p style={{ fontFamily: BODY, fontSize: "0.88rem", color: "var(--ark-muted)", lineHeight: 1.7, maxWidth: "22rem" }}>
              Precision bench instruments for people who build circuit boards.
            </p>
            <SocialLinkButtons compact />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-10">
            {columns.map((col) => (
              <div key={col.title} className="min-w-0">
                <p className="mb-4" style={{ fontFamily: NORDIC, fontSize: "0.66rem", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ark-faint)" }}>{col.title}</p>
                <div className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <button key={link.label} type="button" onClick={link.action} className="ark-focus text-left transition-colors duration-200 hover:text-white" style={{ fontFamily: BODY, fontSize: "0.85rem", color: "var(--ark-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ borderTop: "1px solid var(--ark-line-soft)" }}>
          <p style={{ fontFamily: MONO, fontSize: "0.72rem", color: "var(--ark-faint)" }}>© 2026 Arktos Systems, Inc.</p>
          <p style={{ fontFamily: MONO, fontSize: "0.72rem", color: "var(--ark-faint)", letterSpacing: "0.04em" }}>Engineered honestly · prototype in progress</p>
        </div>
      </div>
    </footer>
  );
}

/* ── Root ─────────────────────────────────────────────────────────── */
type Page = "home" | "reserve" | "contact" | "specs" | "careers" | "privacy" | "terms" | "accessibility" | ProductId;

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [page, setPage] = useState<Page>("home");
  const [reserveProduct, setReserveProduct] = useState<ProductId>("blackbox");
  const [a11y, setA11y] = useState(false);

  useSmoothScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("a11y-mode", a11y);
  }, [a11y]);

  const go = (next: Page) => {
    setPage(next);
    requestAnimationFrame(() => scrollToTop());
  };
  const goHome = () => go("home");
  const goReserve = (product?: ProductId) => {
    if (product) setReserveProduct(product);
    go("reserve");
  };
  const goContact = () => go("contact");
  const goSpecs = () => go("specs");
  const goCareers = () => go("careers");
  const goLegal = (p: "privacy" | "terms" | "accessibility") => go(p);
  const goProduct = (id: ProductId) => go(id);
  const goSection = (section: string) => {
    if (page !== "home") {
      setPage("home");
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(section)));
    } else {
      scrollToId(section);
    }
  };

  return (
    <div className="relative" style={{ fontFamily: BODY, background: "var(--ark-bg)", color: "var(--ark-ink)" }}>
      {!a11y && <Snow />}
      <Navbar
        scrolled={scrolled}
        showAnnouncement={showAnnouncement}
        onHome={goHome}
        onReserve={() => goReserve()}
        onContact={goContact}
        onSpecs={goSpecs}
        onProduct={goProduct}
        onSection={goSection}
        onCloseAnnouncement={() => setShowAnnouncement(false)}
      />

      {page === "home" ? (
        <>
          <Hero onBlackBox={() => goProduct("blackbox")} onDraft={() => goProduct("draft")} onReserve={() => goReserve()} />
          <ToolMarquee />
          <Products onProduct={goProduct} onReserve={() => goReserve()} />
          <SignalChain />
          <BlackBoxExploded
            eyebrow="Inside BlackBox"
            title="Every layer, accounted for."
            subtitle="Scroll — the V1 comes apart the way it goes together: printed shell, radio module, carrier PCB, bottom plate."
          />
          <Signals />
          <Mission />
          <Team />
          <CTA onReserve={() => goReserve()} onContact={goContact} />
        </>
      ) : page === "reserve" ? (
        <ReservePage onHome={goHome} initialProduct={reserveProduct} />
      ) : page === "contact" ? (
        <ContactPage onHome={goHome} />
      ) : page === "specs" ? (
        <SpecsPage onHome={goHome} onReserve={() => goReserve()} />
      ) : page === "careers" ? (
        <CareersPage onHome={goHome} />
      ) : page in PRODUCTS ? (
        <ProductDescriptionPage
          product={PRODUCTS[page as ProductId]}
          onHome={goHome}
          onBack={goHome}
          backLabel="All products"
          onReserve={() => goReserve(page as ProductId)}
          onContact={goContact}
        />
      ) : (
        <LegalPage type={page as "privacy" | "terms" | "accessibility"} onHome={goHome} a11y={a11y} onToggleA11y={() => setA11y((v) => !v)} />
      )}

      <Footer
        onLegalPage={goLegal}
        onContact={goContact}
        onCareers={goCareers}
        onProduct={goProduct}
        onSpecs={goSpecs}
        onReserve={() => goReserve()}
        onSection={goSection}
      />
      <CookieBanner onPrivacy={() => goLegal("privacy")} />
    </div>
  );
}
