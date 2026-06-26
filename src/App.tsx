import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView } from "motion/react";
import {
  ArrowRight,
  Zap,
  Shield,
  Globe,
  ChevronDown,
  Menu,
  X,
  Activity,
  Layers,
  Lock,
  Thermometer,
  Leaf,
  Cpu,
  Wind,
  Instagram,
  Youtube,
  MessageCircle,
  Timer,
  Eye,
  EyeOff,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { CookieBanner } from "@/components/CookieBanner";
import { PhotoBackdrop } from "@/components/PhotoBackdrop";
import { ProductDescriptionPage } from "@/components/ProductDescriptionPage";
import { images, HERO_IMG } from "@/assets/images";
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
import { PRODUCTS, COOLING_PRODUCT_IDS, KRYOS_PRODUCT_IDS, type ProductId } from "@/constants/products";
import { submitToFormspree } from "@/lib/formspree";

const {
  logoTaskbar,
  logoPanoramic,
  logoWordmark,
  glacierCave,
  glacierField,
  glacierPrototype,
  alpineBackground,
  mcdonaldLakeBackground,
  iceBeachBackground,
  legalIceBackground,
  contactBackground,
  productSpecBackground,
  careersBackground,
  kenzoTree,
  sidakProfile,
  kryosMotionBackground,
} = images;

const ARKTOS_EMAIL = "arktossystems@gmail.com";

const SOCIAL_LINK_ICONS = {
  youtube: <Youtube size={15} />,
  instagram: <Instagram size={15} />,
  discord: <MessageCircle size={15} />,
} as const;

function SocialLinkButtons({ compact = false }: { compact?: boolean }) {
  const itemStyle: React.CSSProperties = {
    borderColor: "rgba(160,200,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "oklch(0.58 0.025 228)",
    fontFamily: "'Barlow', sans-serif",
    fontSize: compact ? "0.78rem" : "0.84rem",
    textDecoration: "none",
  };

  return (
    <div className={`flex flex-wrap items-center ${compact ? "gap-3" : "gap-3"}`}>
      {SOCIAL_LINKS.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border transition-colors duration-200 hover:text-white/90 hover:border-white/20"
          style={itemStyle}
        >
          {SOCIAL_LINK_ICONS[item.id]}
          {item.label}
        </a>
      ))}
    </div>
  );
}

/* dark-bg logo treatment: invert charcoal marks to light on transparent PNGs */
const LOGO_STYLE: React.CSSProperties = {
  filter: "invert(1) brightness(1.12) contrast(1.05)",
  mixBlendMode: "screen",
};

const LOGO_SHARP: React.CSSProperties = {
  ...LOGO_STYLE,
  imageRendering: "auto",
};


/* ── Reusable glass panel ─────────────────────────────────────────── */
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

const FORM_LABEL_STYLE: React.CSSProperties = {
  fontFamily: "'DM Mono', monospace",
  fontSize: "0.68rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "oklch(0.62 0.055 216)",
};

const FORM_FIELD_CLASS = "w-full rounded-xl px-4 py-3 outline-none border";

const FORM_FIELD_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  borderColor: "rgba(160,200,255,0.18)",
  color: "rgba(255,255,255,0.92)",
  fontFamily: "'Barlow', sans-serif",
};

const CONTACT_PANEL_OUTLINE: React.CSSProperties = {
  borderColor: "rgba(160,200,255,0.34)",
  boxShadow:
    "inset 0 1.5px 0 rgba(200,230,255,0.24), inset 0 -1px 0 rgba(0,0,0,0.22), 0 24px 64px rgba(0,0,0,0.56)",
};

/* ── Button variants ─────────────────────────────────────────────── */
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
      className={`group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-medium tracking-wide overflow-hidden transition-all duration-300 ${className}`}
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
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
        }}
      />
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
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
      className={`group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-medium tracking-wide border transition-all duration-300 hover:bg-white/[0.1] hover:border-white/[0.2] ${className}`}
      style={{
        background: "rgba(160,200,255,0.06)",
        borderColor: "rgba(160,200,255,0.14)",
        color: "oklch(0.82 0.015 222)",
        boxShadow: "inset 0 1px 0 rgba(200,230,255,0.08)",
        fontFamily: "'Barlow', sans-serif",
        backdropFilter: "blur(4px)",
      }}
    >
      {children}
    </button>
  );
}

/* ── Animated snow ────────────────────────────────────────────────── */
function Snow() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 2.8 + 0.8,
        delay: Math.random() * 14,
        duration: Math.random() * 8 + 10,
        opacity: Math.random() * 0.55 + 0.15,
        drift: (Math.random() - 0.5) * 80,
      })),
    []
  );

  return (
    <>
      <style>{`
        @keyframes snowfall {
          0%   { transform: translateY(-40px) translateX(0px); opacity: 0; }
          5%   { opacity: var(--flake-opacity); }
          92%  { opacity: var(--flake-opacity); }
          100% { transform: translateY(105vh) translateX(var(--drift)); opacity: 0; }
        }
      `}</style>
      <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
        {flakes.map((f) => (
          <div
            key={f.id}
            className="absolute top-0 rounded-full bg-white"
            style={{
              left: `${f.left}%`,
              width: `${f.size}px`,
              height: `${f.size}px`,
              ["--flake-opacity" as string]: f.opacity,
              ["--drift" as string]: `${f.drift}px`,
              animation: `snowfall ${f.duration}s linear ${f.delay}s infinite`,
              opacity: 0,
            }}
          />
        ))}
      </div>
    </>
  );
}

/* ── Navbar ──────────────────────────────────────────────────────── */
type NavItem =
  | { label: string; kind: "section"; section: string }
  | { label: string; kind: "page"; page: "docs" | "cooling" | "kryos" };

const NAV_LINKS: NavItem[] = [
  { label: "Divisions", kind: "section", section: "divisions" },
  { label: "Arktos", kind: "page", page: "cooling" },
  { label: "Kryos", kind: "page", page: "kryos" },
  { label: "Mission", kind: "section", section: "mission" },
  { label: "Team", kind: "section", section: "team" },
  { label: "Docs", kind: "page", page: "docs" },
];

function Navbar({
  scrolled,
  onHome,
  onPreorder,
  onContact,
  onDocs,
  onCooling,
  onKryos,
  onNavigateSection,
}: {
  scrolled: boolean;
  onHome: () => void;
  onPreorder: () => void;
  onContact: () => void;
  onDocs: () => void;
  onCooling: () => void;
  onKryos: () => void;
  onNavigateSection: (section: string) => void;
}) {
  const handleNav = (link: NavItem) => {
    if (link.kind === "section") {
      onNavigateSection(link.section);
      return;
    }
    if (link.page === "docs") onDocs();
    if (link.page === "cooling") onCooling();
    if (link.page === "kryos") onKryos();
  };
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 pt-5"
    >
      <div
        className="max-w-6xl mx-auto flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-700"
        style={{
          backdropFilter: scrolled ? "blur(8px) saturate(1.2)" : "blur(4px)",
          background: scrolled ? "rgba(6,12,26,0.82)" : "rgba(6,12,26,0.48)",
          border: `1px solid ${scrolled ? "rgba(160,200,255,0.12)" : "rgba(160,200,255,0.07)"}`,
          boxShadow: scrolled
            ? "inset 0 1.5px 0 rgba(200,230,255,0.09), 0 8px 40px rgba(0,0,0,0.5)"
            : "none",
        }}
      >
        {/* Logo + wordmark */}
        <button className="flex items-center gap-3" onClick={onHome} aria-label="Go to home">
          <div
            className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center ring-1 ring-white/10"
            style={{
              background: "rgba(8,16,32,0.5)",
              boxShadow: "0 0 10px rgba(140,210,255,0.1)",
            }}
          >
            <ImageWithFallback
              src={logoTaskbar}
              alt="Arktos Systems"
              className="h-[76%] w-[76%] object-contain object-center"
              style={LOGO_SHARP}
            />
          </div>
          <span
            className="hidden lg:block"
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: "0.92rem",
              fontWeight: 500,
              letterSpacing: "0.48em",
              color: "rgba(235,245,255,0.72)",
              textTransform: "uppercase",
            }}
          >
            Arktos
          </span>
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <button
                type="button"
                onClick={() => handleNav(link)}
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.875rem",
                  color: "oklch(0.68 0.02 225)",
                  letterSpacing: "0.02em",
                  transition: "color 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.95)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLButtonElement).style.color = "oklch(0.68 0.02 225)")
                }
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <GhostBtn onClick={onContact}>Contact us</GhostBtn>
          <PrimaryBtn onClick={onPreorder}>
            Preorder Glacier <ArrowRight size={14} />
          </PrimaryBtn>
        </div>

        <button
          className="md:hidden transition-colors"
          style={{ color: "rgba(255,255,255,0.7)" }}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden max-w-6xl mx-auto mt-2 rounded-2xl p-6"
          style={{
            background: "rgba(6,12,26,0.9)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(160,200,255,0.12)",
          }}
        >
          <div className="mb-5 pb-5 border-b border-white/[0.08]">
            <ImageWithFallback
              src={logoWordmark}
              alt="Arktos Systems"
              className="h-7 w-auto max-w-[220px] object-contain"
              style={LOGO_SHARP}
            />
          </div>
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    handleNav(link);
                  }}
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-5 border-t border-white/[0.08] flex flex-col gap-3">
            <GhostBtn onClick={() => { setOpen(false); onContact(); }}>
              Contact us
            </GhostBtn>
            <PrimaryBtn onClick={() => { setOpen(false); onPreorder(); }}>
              Preorder Glacier <ArrowRight size={14} />
            </PrimaryBtn>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

/* ── Hero ────────────────────────────────────────────────────────── */
function Hero({
  onCooling,
  onKryos,
}: {
  onCooling: () => void;
  onKryos: () => void;
}) {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-center justify-center"
    >
      {/* Background image — entrance animation on load, fully static after */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ y: "6%", scale: 1.06 }}
        animate={{ y: "0%", scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src={HERO_IMG}
          alt="Snow-covered Glacier National Park mountains reflected in Lake McDonald"
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.74) saturate(1.04)" }}
        />
        {/* Atmospheric overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,8,20,0.22) 0%, rgba(4,8,20,0.08) 38%, rgba(4,8,20,0.08) 60%, rgba(4,8,20,0.72) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 30%, rgba(2,6,18,0.62) 100%)",
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-20 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-7"
      >
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(3.4rem, 9vw, 8rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.015em",
            color: "rgba(255,255,255,0.96)",
            textShadow: "0 4px 48px rgba(0,0,0,0.6)",
          }}
        >
          Two divisions.
          <br />
          <span
            style={{
              fontWeight: 700,
              background:
                "linear-gradient(110deg, oklch(0.92 0.04 210) 0%, oklch(0.8 0.11 212) 40%, oklch(0.68 0.13 196) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            One Arktos.
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 400,
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.75,
            maxWidth: "38rem",
            letterSpacing: "0.01em",
            textShadow: "0 1px 12px rgba(0,0,0,0.45)",
          }}
        >
          Arktos Systems is the parent company behind{" "}
          <strong style={{ color: "rgba(255,255,255,0.98)", fontWeight: 600 }}>
            Arktos Cooling
          </strong>{" "}
          — PC performance and phase-change cooling chambers — and{" "}
          <strong style={{ color: "rgba(255,255,255,0.98)", fontWeight: 600 }}>
            Kryos Motion
          </strong>{" "}
          — portable athlete metronomes built for peak performance.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.78, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <PrimaryBtn onClick={onCooling}>
            Arktos Cooling <ArrowRight size={15} />
          </PrimaryBtn>
          <PrimaryBtn onClick={onKryos}>
            Kryos Motion <ArrowRight size={15} />
          </PrimaryBtn>
        </motion.div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2 w-full max-w-2xl"
        >
          <GlassPanel className="px-8 py-5">
            <div className="grid grid-cols-3 divide-x divide-white/[0.07]">
              {[
                { value: "Arktos", label: "Phase-change PC thermal" },
                { value: "Kryos", label: "Athlete metronomes" },
                { value: "Systems", label: "Shared Arktos engineering" },
              ].map(({ value, label }) => (
                <div key={label} className="px-6 text-center first:pl-0 last:pr-0">
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 600,
                      fontSize: "1.65rem",
                      color: "oklch(0.88 0.07 214)",
                      letterSpacing: "0.02em",
                      marginBottom: "4px",
                    }}
                  >
                    {value}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.68rem",
                      color: "oklch(0.52 0.025 228)",
                      letterSpacing: "0.07em",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <ChevronDown size={18} style={{ color: "oklch(0.5 0.02 228)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── Divisions ───────────────────────────────────────────────────── */
function Divisions({
  onCooling,
  onKryos,
}: {
  onCooling: () => void;
  onKryos: () => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const divisions = [
    {
      eyebrow: "Arktos Cooling",
      title: "PC performance & phase-change cooling",
      body: "From Glacier air coolers to phase-change cooling chambers, Arktos Cooling engineers thermal systems for builders, studios, and high-performance compute.",
      image: legalIceBackground,
      icon: <Thermometer size={20} />,
      cta: "Explore Cooling",
      onClick: onCooling,
    },
    {
      eyebrow: "Kryos Motion",
      title: "Portable athlete metronomes",
      body: "Kryos Motion builds wearable rhythm tools that help athletes lock cadence, pace, and recovery — engineered for training floors, tracks, and travel.",
      image: kryosMotionBackground,
      icon: <Timer size={20} />,
      cta: "Explore Kryos",
      onClick: onKryos,
    },
  ];

  return (
    <section
      id="divisions"
      ref={ref}
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: "oklch(0.082 0.024 244)" }}
    >
      <PhotoBackdrop image={mcdonaldLakeBackground} position="center center" opacity={0.9} brightness={0.9} overlay="light" />
      <div className="relative max-w-6xl mx-auto flex flex-col gap-14">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "oklch(0.6 0.07 214)",
              display: "block",
              marginBottom: "1.2rem",
            }}
          >
            Arktos Systems
          </span>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.01em",
              color: "rgba(255,255,255,0.96)",
              marginBottom: "1.2rem",
            }}
          >
            A parent company for
            <br />
            <span style={{ fontWeight: 700 }}>two product lines.</span>
          </h2>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: "1.05rem",
              color: "oklch(0.62 0.018 228)",
              lineHeight: 1.82,
              maxWidth: "38rem",
            }}
          >
            Arktos Systems is the shell — shared engineering, brand, and mission —
            while Arktos Cooling and Kryos Motion each ship focused hardware for
            thermal performance and athlete rhythm.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {divisions.map((division, i) => (
            <motion.article
              key={division.eyebrow}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.12 + i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative min-h-[460px] overflow-hidden rounded-2xl border border-white/[0.12]"
              style={{
                boxShadow: "0 28px 70px rgba(0,0,0,0.55)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <img
                src={division.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "center center", filter: "brightness(0.68) saturate(0.98)" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(3,8,18,0.18) 0%, rgba(3,8,18,0.52) 42%, rgba(3,8,18,0.94) 100%)",
                }}
              />
              <div className="relative z-10 h-full flex flex-col justify-end p-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: "rgba(90,150,255,0.12)",
                    border: "1px solid rgba(90,150,255,0.18)",
                    color: "oklch(0.74 0.11 216)",
                  }}
                >
                  {division.icon}
                </div>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.68rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "oklch(0.75 0.11 205)",
                    marginBottom: "0.8rem",
                  }}
                >
                  {division.eyebrow}
                </span>
                <h3
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                    fontSize: "1.8rem",
                    lineHeight: 1.05,
                    color: "rgba(255,255,255,0.96)",
                    marginBottom: "0.85rem",
                  }}
                >
                  {division.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.95rem",
                    color: "oklch(0.72 0.02 225)",
                    lineHeight: 1.72,
                    marginBottom: "1.4rem",
                    maxWidth: "34rem",
                  }}
                >
                  {division.body}
                </p>
                <PrimaryBtn onClick={division.onClick}>
                  {division.cta} <ArrowRight size={14} />
                </PrimaryBtn>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Mission ─────────────────────────────────────────────────────── */
function Mission() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const pillars = [
    {
      icon: <Thermometer size={20} />,
      title: "Phase-change cooling",
      body: "Our proprietary two-phase immersion system absorbs thermal energy at the chip level, achieving up to 68% lower power consumption versus air-cooled alternatives.",
    },
    {
      icon: <Leaf size={20} />,
      title: "Closed-loop fluids",
      body: "100% of our dielectric cooling fluid is recovered, filtered, and recirculated. Zero evaporative loss, zero chemical discharge — a fully circular thermal cycle.",
    },
    {
      icon: <Cpu size={20} />,
      title: "Precision CAD design",
      body: "Every cold plate and manifold is modeled to sub-millimeter tolerances using computational fluid dynamics, maximising heat transfer with minimal material waste.",
    },
    {
      icon: <Wind size={20} />,
      title: "Waste heat recovery",
      body: "Captured thermal energy is routed to building heating systems, reducing total facility emissions and creating measurable Scope 2 carbon offsets.",
    },
  ];

  return (
    <section
      id="mission"
      ref={ref}
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: "oklch(0.085 0.024 244)" }}
    >
      <PhotoBackdrop image={alpineBackground} position="center center" opacity={0.9} brightness={0.9} overlay="light" />
      {/* grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100,150,255,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,150,255,0.028) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
      {/* glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "700px",
          height: "500px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(ellipse, rgba(60,120,255,0.07) 0%, transparent 65%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto flex flex-col gap-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "oklch(0.6 0.07 214)",
              display: "block",
              marginBottom: "1.2rem",
            }}
          >
            Our mission
          </span>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.01em",
              color: "rgba(255,255,255,0.96)",
              marginBottom: "1.4rem",
            }}
          >
            Compute shouldn&apos;t cost
            <br />
            <span style={{ fontWeight: 700 }}>the planet.</span>
          </h2>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: "1.05rem",
              color: "oklch(0.62 0.018 228)",
              lineHeight: 1.82,
              maxWidth: "36rem",
            }}
          >
            Global data centers consume more electricity than entire nations.
            Arktos Systems is the parent company behind Arktos Cooling and Kryos
            Motion — united by a conviction that performance hardware should be
            engineered responsibly, from phase-change thermal systems to athlete
            rhythm tools.
          </p>
        </motion.div>

        {/* Pillar grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.12 + i * 0.1,
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <GlassPanel className="p-7 h-full flex flex-col gap-5 hover:bg-white/[0.09] transition-colors duration-500 cursor-default">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(90,150,255,0.1)",
                    border: "1px solid rgba(90,150,255,0.18)",
                    color: "oklch(0.74 0.11 216)",
                  }}
                >
                  {p.icon}
                </div>
                <div className="flex flex-col gap-2.5">
                  <h3
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 500,
                      fontSize: "1.12rem",
                      color: "rgba(255,255,255,0.9)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontWeight: 300,
                      fontSize: "0.875rem",
                      color: "oklch(0.6 0.018 230)",
                      lineHeight: 1.78,
                    }}
                  >
                    {p.body}
                  </p>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Platform features ───────────────────────────────────────────── */
function Platform() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const features = [
    {
      icon: <Zap size={22} />,
      title: "Thermal velocity",
      body: "Chip-level heat capture in under 4μs. Phase-change absorption eliminates the lag of conventional heatsink propagation.",
      tag: "PERFORMANCE",
    },
    {
      icon: <Shield size={22} />,
      title: "Zero-contamination seals",
      body: "Tri-layer hermetic manifolds ensure dielectric fluid never contacts PCB surfaces. Fully compatible with existing server architectures.",
      tag: "RELIABILITY",
    },
    {
      icon: <Globe size={22} />,
      title: "Datacenter-scale",
      body: "Modular rack units slot into standard 42U enclosures. No facility rebuild — retrofit existing infrastructure in under a working day.",
      tag: "INTEGRATION",
    },
  ];

  return (
    <section
      id="platform"
      ref={ref}
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: "oklch(0.09 0.022 242)" }}
    >
      <PhotoBackdrop image={mcdonaldLakeBackground} position="center center" opacity={0.92} brightness={0.9} overlay="medium" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "oklch(0.6 0.07 214)",
              display: "block",
              marginBottom: "1.1rem",
            }}
          >
            Platform
          </span>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              lineHeight: 0.95,
              color: "rgba(255,255,255,0.96)",
              letterSpacing: "-0.01em",
            }}
          >
            Every layer,{" "}
            <span style={{ fontWeight: 700 }}>precision-engineered.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.12 + i * 0.12, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassPanel className="p-8 h-full flex flex-col gap-6 group hover:bg-white/[0.085] transition-colors duration-500 cursor-default">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(90,150,255,0.09)",
                    border: "1px solid rgba(90,150,255,0.16)",
                    color: "oklch(0.74 0.11 216)",
                  }}
                >
                  {f.icon}
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.66rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "oklch(0.5 0.055 212)",
                    }}
                  >
                    {f.tag}
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 500,
                      fontSize: "1.22rem",
                      color: "rgba(255,255,255,0.9)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontWeight: 300,
                      fontSize: "0.9rem",
                      color: "oklch(0.6 0.018 228)",
                      lineHeight: 1.78,
                    }}
                  >
                    {f.body}
                  </p>
                </div>
                <div
                  className="flex items-center gap-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ fontFamily: "'Barlow', sans-serif", color: "oklch(0.7 0.1 215)" }}
                >
                  Learn more <ArrowRight size={12} />
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Glacier line ────────────────────────────────────────────────── */
function GlacierLine({ onPreorder }: { onPreorder: () => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const glacierCards = [
    {
      image: glacierCave,
      eyebrow: "GLACIER CORE",
      title: "Cold air shaped by ice-cave geometry",
      body: "Our Glacier air cooler line channels dense intake paths through a fin stack inspired by frozen cavern flow: quiet, direct, and built for high thermal pressure.",
    },
    {
      image: glacierField,
      eyebrow: "AIRFLOW FIELD",
      title: "Wide-surface cooling for everyday builds",
      body: "A broad contact plate, calmer fan curve, and frosted shroud language bring the Arktos mountain theme into a practical air-cooling platform.",
    },
    {
      image: glacierPrototype,
      eyebrow: "PROTOTYPE IN PROGRESS",
      title: "Glacier white sample under development",
      body: "This early white-ice concept is being refined now: blade shape, heat pipe routing, acoustic profile, and final finish are still moving through prototype testing.",
    },
  ];

  return (
    <section
      id="glacier"
      ref={ref}
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: "oklch(0.064 0.026 246)" }}
    >
      <PhotoBackdrop image={glacierPrototype} position="center 35%" opacity={0.85} brightness={0.9} overlay="medium" />
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,8,18,0.68) 0%, rgba(5,16,34,0.86) 48%, rgba(3,8,18,0.96) 100%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
        >
          <div className="max-w-2xl">
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "oklch(0.68 0.1 204)",
                display: "block",
                marginBottom: "1.1rem",
              }}
            >
              Glacier line
            </span>
            <h2
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 300,
                fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)",
                lineHeight: 0.95,
                color: "rgba(255,255,255,0.96)",
              }}
            >
              Air coolers carved from
              <br />
              <span style={{ fontWeight: 700 }}>the coldest idea.</span>
            </h2>
          </div>
          <PrimaryBtn onClick={onPreorder}>
            Preorder Glacier <ArrowRight size={14} />
          </PrimaryBtn>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5">
          {glacierCards.map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 34 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.12 + i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative min-h-[520px] overflow-hidden rounded-2xl border border-white/[0.12]"
              style={{
                boxShadow: "0 28px 70px rgba(0,0,0,0.55)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <img
                src={card.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "center center", filter: "brightness(0.68) saturate(0.98)" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(3,8,18,0.16) 0%, rgba(3,8,18,0.45) 38%, rgba(3,8,18,0.92) 100%)",
                }}
              />
              <div className="relative z-10 h-full flex flex-col justify-end p-7">
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.68rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "oklch(0.75 0.11 205)",
                    marginBottom: "0.9rem",
                  }}
                >
                  {card.eyebrow}
                </span>
                <h3
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                    fontSize: "1.55rem",
                    lineHeight: 1.05,
                    color: "rgba(255,255,255,0.96)",
                    marginBottom: "0.85rem",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.92rem",
                    color: "oklch(0.72 0.02 225)",
                    lineHeight: 1.72,
                  }}
                >
                  {card.body}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Team ────────────────────────────────────────────────────────── */
const TEAM = [
  {
    name: "Sidak Mann",
    title: "Co-founder & Software Engineer",
    bio: "Sidak architects the embedded systems and thermal control software that drive Arktos cooling units. With a background in distributed systems and real-time firmware, he ensures every cold plate and manifold responds to load in microseconds.",
    initials: "SM",
    gradient: "linear-gradient(135deg, oklch(0.68 0.14 220), oklch(0.52 0.16 244))",
    accent: "oklch(0.74 0.11 216)",
    photo: sidakProfile,
    photoPosition: "center 32%",
  },
  {
    name: "Kenzo Liddle",
    title: "Co-founder & CAD Engineer",
    bio: "Kenzo designs the physical architecture of every Arktos cooling module — from initial CFD simulations to precision-machined cold plates. His work bridges materials science, thermodynamics, and zero-waste manufacturing principles.",
    initials: "KL",
    gradient: "linear-gradient(135deg, oklch(0.58 0.14 196), oklch(0.48 0.14 220))",
    accent: "oklch(0.68 0.13 196)",
    photo: kenzoTree,
    photoPosition: "center 52%",
  },
];

function Team() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="team"
      ref={ref}
      className="relative py-32 px-6 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, oklch(0.082 0.028 246) 0%, oklch(0.09 0.02 238) 100%)",
      }}
    >
      <PhotoBackdrop image={alpineBackground} position="center center" opacity={0.88} brightness={0.92} overlay="light" />
      {/* glow */}
      <div
        className="absolute pointer-events-none inset-0 flex items-center justify-center"
        style={{ opacity: 0.6 }}
      >
        <div
          style={{
            width: "700px",
            height: "500px",
            background: "radial-gradient(ellipse, rgba(60,120,255,0.08) 0%, transparent 68%)",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 }}
          className="mb-16"
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "oklch(0.6 0.07 214)",
              display: "block",
              marginBottom: "1.1rem",
            }}
          >
            Meet the team
          </span>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              lineHeight: 0.95,
              color: "rgba(255,255,255,0.96)",
              letterSpacing: "-0.01em",
            }}
          >
            Built by{" "}
            <span style={{ fontWeight: 700 }}>engineers</span>,
            <br />
            for engineers.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.15 + i * 0.14,
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <GlassPanel className="p-8 flex flex-col gap-6 group hover:bg-white/[0.085] transition-all duration-500 cursor-default h-full">
                {/* Avatar + name */}
                <div className="flex items-center gap-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{
                      boxShadow: `0 0 32px ${member.accent}44`,
                      border: `1px solid ${member.accent}44`,
                      background: member.gradient,
                    }}
                  >
                    <img
                      src={member.photo}
                      alt={`${member.name} profile`}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: member.photoPosition }}
                    />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 600,
                        fontSize: "1.32rem",
                        color: "rgba(255,255,255,0.94)",
                        letterSpacing: "0.01em",
                        marginBottom: "4px",
                      }}
                    >
                      {member.name}
                    </h3>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.68rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: member.accent,
                      }}
                    >
                      {member.title}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div
                  className="w-full h-px"
                  style={{ background: "rgba(160,200,255,0.09)" }}
                />

                {/* Bio */}
                <p
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.93rem",
                    color: "oklch(0.62 0.018 228)",
                    lineHeight: 1.82,
                  }}
                >
                  {member.bio}
                </p>

                {/* Co-founder tag */}
                <div className="mt-auto pt-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      background: `${member.accent}18`,
                      border: `1px solid ${member.accent}28`,
                      color: member.accent,
                    }}
                  >
                    Co-founder
                  </span>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────────────── */
function CTA({ onPreorder }: { onPreorder: () => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: "oklch(0.09 0.022 242)" }}
    >
      <PhotoBackdrop image={mcdonaldLakeBackground} position="center center" opacity={0.92} brightness={0.9} overlay="medium" />
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        <div
          style={{
            width: "900px",
            height: "450px",
            background: "radial-gradient(ellipse, rgba(70,130,255,0.07) 0%, transparent 68%)",
          }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassPanel className="px-10 py-14 flex flex-col items-center gap-6">
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "oklch(0.6 0.07 214)",
              }}
            >
              Join us
            </span>
            <h2
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 300,
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                lineHeight: 0.95,
                color: "rgba(255,255,255,0.96)",
                letterSpacing: "-0.01em",
              }}
            >
              Ready to rethink
              <br />
              <span style={{ fontWeight: 700 }}>thermal infrastructure?</span>
            </h2>
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                color: "oklch(0.62 0.018 228)",
                lineHeight: 1.8,
                maxWidth: "30rem",
                fontSize: "0.97rem",
              }}
            >
              Whether you run three racks or three hundred, we&apos;re
              accepting pilot partners for our first commercial deployment.
              No obligation — just real engineering conversations.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <PrimaryBtn onClick={onPreorder}>
                Get started today <ArrowRight size={14} />
              </PrimaryBtn>
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Arktos Cooling page ─────────────────────────────────────────── */
function CoolingPage({
  onHome,
  onPreorder,
  onProduct,
}: {
  onHome: () => void;
  onPreorder: () => void;
  onProduct: (id: ProductId) => void;
}) {
  const highlights = [
    {
      icon: <Thermometer size={20} />,
      title: "Phase-change chambers",
      body: "Two-phase immersion and chamber cooling for PC builds that need chip-level heat capture without legacy air limits.",
    },
    {
      icon: <Wind size={20} />,
      title: "Glacier air coolers",
      body: "High-pressure tower airflow, ice-cave fin geometry, and calm acoustics for everyday performance builds.",
    },
    {
      icon: <Cpu size={20} />,
      title: "PC performance focus",
      body: "CAD-modeled cold plates, CFD-validated manifolds, and builder-first specs from prototype through launch.",
    },
  ];

  return (
    <main
      className="relative min-h-screen overflow-hidden px-6 pt-36 pb-24"
      style={{ background: "oklch(0.064 0.026 246)" }}
    >
      <PhotoBackdrop image={iceBeachBackground} position="center 40%" opacity={0.78} brightness={0.94} overlay="light" />
      <div className="relative z-20 max-w-6xl mx-auto">
        <GlassPanel className="mb-8 px-5 py-4">
          <button
            onClick={onHome}
            className="inline-flex items-center gap-2 text-sm"
            style={{
              fontFamily: "'Barlow', sans-serif",
              color: "oklch(0.78 0.05 218)",
            }}
          >
            <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} />
            Back to Arktos
          </button>
        </GlassPanel>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "oklch(0.72 0.11 204)",
                display: "block",
                marginBottom: "1.2rem",
              }}
            >
              Arktos Cooling
            </span>
            <h1
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 300,
                fontSize: "clamp(3.3rem, 8vw, 7rem)",
                lineHeight: 0.92,
                color: "rgba(255,255,255,0.97)",
                marginBottom: "1.5rem",
              }}
            >
              Cool harder.
              <br />
              <span style={{ fontWeight: 700 }}>Build smarter.</span>
            </h1>
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                fontSize: "1.05rem",
                color: "oklch(0.73 0.02 228)",
                lineHeight: 1.8,
                maxWidth: "39rem",
                marginBottom: "2rem",
              }}
            >
              Arktos Cooling is the PC performance division of Arktos Systems —
              phase-change cooling chambers, Glacier air coolers, and thermal
              infrastructure for builders who refuse to trade speed for heat.
            </p>
            <PrimaryBtn onClick={onPreorder}>
              Reserve Glacier <ArrowRight size={14} />
            </PrimaryBtn>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="grid gap-4"
          >
            {highlights.map((item) => (
              <GlassPanel key={item.title} className="p-6 flex gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(90,150,255,0.1)",
                    border: "1px solid rgba(90,150,255,0.18)",
                    color: "oklch(0.74 0.11 216)",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <h2
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 500,
                      fontSize: "1.15rem",
                      color: "rgba(255,255,255,0.92)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {item.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: "0.9rem",
                      color: "oklch(0.68 0.02 228)",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              </GlassPanel>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14"
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "oklch(0.68 0.1 204)",
              display: "block",
              marginBottom: "1rem",
            }}
          >
            Products
          </span>
          <div className="grid md:grid-cols-2 gap-5">
            {COOLING_PRODUCT_IDS.map((id) => {
              const product = PRODUCTS[id];
              return (
                <GlassPanel
                  key={id}
                  className="p-6 flex flex-col gap-4 hover:bg-white/[0.07] transition-colors duration-500"
                >
                  <div>
                    <h2
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 600,
                        fontSize: "1.5rem",
                        color: "rgba(255,255,255,0.95)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {product.name}
                    </h2>
                    <p
                      style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: "0.92rem",
                        color: "oklch(0.72 0.02 228)",
                        lineHeight: 1.7,
                      }}
                    >
                      {product.tagline}
                    </p>
                  </div>
                  <PrimaryBtn onClick={() => onProduct(id)}>
                    View product <ArrowRight size={14} />
                  </PrimaryBtn>
                </GlassPanel>
              );
            })}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

/* ── Kryos Motion page ───────────────────────────────────────────── */
function KryosPage({
  onHome,
  onContact,
  onProduct,
}: {
  onHome: () => void;
  onContact: () => void;
  onProduct: (id: ProductId) => void;
}) {
  const features = [
    {
      icon: <Timer size={20} />,
      title: "Portable athlete metronomes",
      body: "Wearable rhythm hardware that keeps cadence honest across sprints, lifts, and recovery sessions.",
    },
    {
      icon: <Activity size={20} />,
      title: "Performance-first pacing",
      body: "Built for coaches and athletes who need tactile tempo cues without pulling out a phone mid-set.",
    },
    {
      icon: <Layers size={20} />,
      title: "Travel-ready design",
      body: "Compact enough for gym bags, durable enough for daily training blocks and competition travel.",
    },
  ];

  return (
    <main
      className="relative min-h-screen overflow-hidden px-6 pt-36 pb-24"
      style={{ background: "oklch(0.064 0.026 246)" }}
    >
      <PhotoBackdrop image={kryosMotionBackground} position="center center" opacity={0.88} brightness={0.92} overlay="light" />
      <div className="relative z-20 max-w-6xl mx-auto">
        <GlassPanel className="mb-8 px-5 py-4">
          <button
            onClick={onHome}
            className="inline-flex items-center gap-2 text-sm"
            style={{
              fontFamily: "'Barlow', sans-serif",
              color: "oklch(0.78 0.05 218)",
            }}
          >
            <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} />
            Back to Arktos
          </button>
        </GlassPanel>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "oklch(0.72 0.11 204)",
                display: "block",
                marginBottom: "1.2rem",
              }}
            >
              Kryos Motion
            </span>
            <h1
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 300,
                fontSize: "clamp(3.3rem, 8vw, 7rem)",
                lineHeight: 0.92,
                color: "rgba(255,255,255,0.97)",
                marginBottom: "1.5rem",
              }}
            >
              Lock the
              <br />
              <span style={{ fontWeight: 700 }}>tempo.</span>
            </h1>
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                fontSize: "1.05rem",
                color: "oklch(0.73 0.02 228)",
                lineHeight: 1.8,
                maxWidth: "39rem",
                marginBottom: "2rem",
              }}
            >
              Kryos Motion is the athlete performance division of Arktos Systems —
              portable metronomes engineered to keep training rhythm consistent
              from warmup through final rep.
            </p>
            <div className="flex flex-wrap gap-3">
              <GhostBtn onClick={onContact}>Contact for early access</GhostBtn>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="grid gap-4"
          >
            {features.map((item) => (
              <GlassPanel key={item.title} className="p-6 flex gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(90,150,255,0.1)",
                    border: "1px solid rgba(90,150,255,0.18)",
                    color: "oklch(0.74 0.11 216)",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <h2
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 500,
                      fontSize: "1.15rem",
                      color: "rgba(255,255,255,0.92)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {item.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: "0.9rem",
                      color: "oklch(0.68 0.02 228)",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              </GlassPanel>
            ))}

            <GlassPanel className="p-7 text-center">
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.68rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "oklch(0.72 0.1 204)",
                  display: "block",
                  marginBottom: "0.8rem",
                }}
              >
                Preorder
              </span>
              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: "1rem",
                  color: "oklch(0.78 0.02 228)",
                  lineHeight: 1.7,
                }}
              >
                Kryos athlete metronome preorders are opening shortly. Reach out
                through contact if you want to be first on the list.
              </p>
            </GlassPanel>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14"
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "oklch(0.68 0.1 204)",
              display: "block",
              marginBottom: "1rem",
            }}
          >
            Products
          </span>
          <div className="grid md:grid-cols-2 gap-5">
            {KRYOS_PRODUCT_IDS.map((id) => {
              const product = PRODUCTS[id];
              return (
                <GlassPanel
                  key={id}
                  className="p-6 flex flex-col gap-4 hover:bg-white/[0.07] transition-colors duration-500"
                >
                  <div>
                    <h2
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 600,
                        fontSize: "1.5rem",
                        color: "rgba(255,255,255,0.95)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {product.name}
                    </h2>
                    <p
                      style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: "0.92rem",
                        color: "oklch(0.72 0.02 228)",
                        lineHeight: 1.7,
                      }}
                    >
                      {product.tagline}
                    </p>
                  </div>
                  <PrimaryBtn onClick={() => onProduct(id)}>
                    View product <ArrowRight size={14} />
                  </PrimaryBtn>
                </GlassPanel>
              );
            })}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

/* ── Preorder page ───────────────────────────────────────────────── */
function PreorderPage({ onHome }: { onHome: () => void }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const preorderCount = 0;

  const preorderFields = [
    ["name", "Full name", "Your name", "text", true],
    ["email", "Email", "you@example.com", "email", true],
    ["phone", "Phone", "(555) 123-4567", "tel", false],
    ["company", "Company / team", "Organization or build name", "text", false],
    ["build_type", "Build type", "Gaming, workstation, studio...", "text", false],
    ["region", "Shipping region", "Country or region", "text", false],
    ["units", "Requested units", "1", "number", false],
  ] as const;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("_subject", "[PREORDER] Glacier reserve list");
    formData.set("form_type", "Glacier Preorder");
    formData.set("_replyto", String(formData.get("email") ?? ""));

    try {
      await submitToFormspree(formData, "preorder");
      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : `Something went wrong. Please try again or email ${ARKTOS_EMAIL} directly.`
      );
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden px-6 pt-36 pb-24"
      style={{ background: "oklch(0.064 0.026 246)" }}
    >
      <PhotoBackdrop
        image={iceBeachBackground}
        position="center 40%"
        opacity={0.62}
        brightness={0.96}
        overlay="light"
      />

      <div className="relative z-20 max-w-6xl mx-auto">
        <GlassPanel className="mb-8 px-5 py-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <button
            onClick={onHome}
            className="inline-flex items-center gap-2 text-sm justify-self-start"
            style={{
              fontFamily: "'Barlow', sans-serif",
              color: "oklch(0.78 0.05 218)",
            }}
          >
            <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} />
            Back to Arktos
          </button>

          <div className="flex flex-col items-center justify-center gap-2 justify-self-center text-center">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: "oklch(0.72 0.12 196)",
                boxShadow: "0 0 14px oklch(0.72 0.12 196)",
                animation: "pulse 2s infinite",
              }}
            />
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.66rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "oklch(0.68 0.1 204)",
              }}
            >
              Live preorders
            </span>
            <strong
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "2rem",
                lineHeight: 1,
                color: "rgba(255,255,255,0.96)",
              }}
            >
              {preorderCount.toLocaleString()}
            </strong>
          </div>

          <div aria-hidden className="justify-self-end" />
        </GlassPanel>
      </div>

      <div className="relative z-20 max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pt-8"
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "oklch(0.72 0.11 204)",
              display: "block",
              marginBottom: "1.2rem",
            }}
          >
            Glacier preorder
          </span>
          <h1
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(3.3rem, 8vw, 7rem)",
              lineHeight: 0.92,
              color: "rgba(255,255,255,0.97)",
              marginBottom: "1.5rem",
            }}
          >
            Reserve the first
            <br />
            <span style={{ fontWeight: 700 }}>Glacier air cooler.</span>
          </h1>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: "1.05rem",
              color: "oklch(0.73 0.02 228)",
              lineHeight: 1.8,
              maxWidth: "39rem",
            }}
          >
            Join the early list for Arktos Glacier: a prototype-stage air cooler
            line built around calm acoustics, high-pressure airflow, and the
            frozen visual language you already love.
          </p>

          <div className="grid sm:grid-cols-3 gap-3 mt-8 max-w-2xl">
            {["Prototype access", "Launch updates", "Founders pricing"].map((item) => (
              <GlassPanel key={item} className="px-4 py-4 text-center">
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.68rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "oklch(0.72 0.08 210)",
                  }}
                >
                  {item}
                </span>
              </GlassPanel>
            ))}
          </div>

          <GlassPanel className="mt-8 overflow-hidden max-w-2xl">
            <div className="grid sm:grid-cols-[0.9fr_1.1fr] items-center">
              <div className="h-44 sm:h-full min-h-44 overflow-hidden">
                <img
                  src={iceBeachBackground}
                  alt="Glacial ice on black sand beach at sunset"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.66rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "oklch(0.72 0.1 204)",
                  }}
                >
                  Prototype preview
                </span>
                <p
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: "0.92rem",
                    color: "oklch(0.76 0.02 228)",
                    lineHeight: 1.68,
                    marginTop: "0.8rem",
                  }}
                >
                  The Glacier white sample is still in progress while we tune
                  fan geometry, acoustic profile, and final finish.
                </p>
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassPanel className="p-7" style={CONTACT_PANEL_OUTLINE}>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.68rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "oklch(0.72 0.1 204)",
                display: "block",
                marginBottom: "0.8rem",
              }}
            >
              Reserve list
            </span>
            <h2
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 500,
                fontSize: "1.6rem",
                color: "rgba(255,255,255,0.95)",
                marginBottom: "0.9rem",
              }}
            >
              Join the Glacier preorder list
            </h2>
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: "0.95rem",
                color: "oklch(0.72 0.02 228)",
                lineHeight: 1.75,
                marginBottom: "1.2rem",
              }}
            >
              Reserve your spot for prototype access, launch updates, and founders
              pricing. Joining the list is an expression of interest only — no
              payment required.
            </p>

            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                {preorderFields.map(([name, label, placeholder, type, required]) => (
                  <label
                    key={name}
                    className={`grid gap-2 ${name === "build_type" || name === "region" ? "sm:col-span-2" : ""}`}
                  >
                    <span style={FORM_LABEL_STYLE}>{label}</span>
                    <input
                      name={name}
                      type={type}
                      required={required}
                      placeholder={placeholder}
                      className={FORM_FIELD_CLASS}
                      style={FORM_FIELD_STYLE}
                    />
                  </label>
                ))}
              </div>

              <label className="grid gap-2">
                <span style={FORM_LABEL_STYLE}>Prototype access notes</span>
                <textarea
                  name="notes"
                  placeholder="Socket, case size, acoustic goals, timeline..."
                  className={`${FORM_FIELD_CLASS} min-h-28 resize-none`}
                  style={FORM_FIELD_STYLE}
                />
              </label>

              <PrimaryBtn
                type="submit"
                disabled={status === "submitting"}
                className="justify-center mt-2"
              >
                {status === "submitting" ? "Submitting..." : "Reserve Glacier"}{" "}
                {status !== "submitting" && <ArrowRight size={14} />}
              </PrimaryBtn>

              {status === "success" && (
                <div
                  className="rounded-xl px-4 py-3 border"
                  style={{
                    background: "rgba(95,210,255,0.09)",
                    borderColor: "rgba(130,220,255,0.22)",
                    color: "oklch(0.82 0.07 204)",
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  You&apos;re on the list. We&apos;ll reach out with Glacier updates soon.
                </div>
              )}

              {status === "error" && (
                <div
                  className="rounded-xl px-4 py-3 border"
                  style={{
                    background: "rgba(255,90,90,0.08)",
                    borderColor: "rgba(255,120,120,0.22)",
                    color: "oklch(0.82 0.08 20)",
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: "0.78rem",
                  color: "oklch(0.58 0.02 228)",
                  lineHeight: 1.6,
                }}
              >
                Submissions are delivered securely through Formspree to {ARKTOS_EMAIL}.
              </p>
            </form>
          </GlassPanel>
        </motion.div>
      </div>
    </main>
  );
}

/* ── Contact page ────────────────────────────────────────────────── */
function ContactPage({ onHome }: { onHome: () => void }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const contactFields = [
    ["name", "Full name", "Your name", "text", true],
    ["email", "Email", "you@example.com", "email", true],
    ["phone", "Phone", "(555) 123-4567", "tel", false],
    ["company", "Company / team", "Organization or build name", "text", false],
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
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again or email arktossystems@gmail.com directly."
      );
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden px-6 pt-36 pb-24"
      style={{ background: "oklch(0.064 0.026 246)" }}
    >
      <PhotoBackdrop
        image={contactBackground}
        position="center center"
        opacity={0.98}
        brightness={0.96}
        overlay="light"
      />

      <div className="relative z-20 max-w-6xl mx-auto">
        <GlassPanel className="mb-8 px-5 py-4" style={CONTACT_PANEL_OUTLINE}>
          <button
            onClick={onHome}
            className="inline-flex items-center gap-2 text-sm"
            style={{
              fontFamily: "'Barlow', sans-serif",
              color: "oklch(0.78 0.05 218)",
            }}
          >
            <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} />
            Back to Arktos
          </button>
        </GlassPanel>
      </div>

      <div className="relative z-20 max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pt-4"
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "oklch(0.72 0.11 204)",
              display: "block",
              marginBottom: "1.2rem",
            }}
          >
            Contact Arktos
          </span>
          <h1
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(3.3rem, 8vw, 7rem)",
              lineHeight: 0.92,
              color: "rgba(255,255,255,0.97)",
              letterSpacing: "-0.01em",
            }}
          >
            Let&apos;s start a
            <br />
            <span style={{ fontWeight: 700 }}>real conversation.</span>
          </h1>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: "1.02rem",
              color: "oklch(0.72 0.02 228)",
              lineHeight: 1.78,
              maxWidth: "34rem",
              marginTop: "1.4rem",
            }}
          >
            Whether you&apos;re exploring Glacier, planning a pilot deployment,
            or just want to talk thermal infrastructure, send us a note and the
            Arktos team will get back to you.
          </p>

          <GlassPanel className="mt-8 p-6 max-w-xl" style={CONTACT_PANEL_OUTLINE}>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "oklch(0.62 0.055 216)",
                marginBottom: "0.75rem",
              }}
            >
              Direct email
            </p>
            <a
              href={`mailto:${ARKTOS_EMAIL}`}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: "1rem",
                color: "oklch(0.84 0.07 204)",
                textDecoration: "none",
              }}
            >
              {ARKTOS_EMAIL}
            </a>
          </GlassPanel>

          <GlassPanel className="mt-4 p-6 max-w-xl" style={CONTACT_PANEL_OUTLINE}>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "oklch(0.62 0.055 216)",
                marginBottom: "0.75rem",
              }}
            >
              Community & social
            </p>
            <SocialLinkButtons />
          </GlassPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassPanel className="p-7" style={CONTACT_PANEL_OUTLINE}>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                {contactFields.map(([name, label, placeholder, type, required]) => (
                  <label
                    key={name}
                    className={`grid gap-2 ${name === "subject" ? "sm:col-span-2" : ""}`}
                  >
                    <span style={FORM_LABEL_STYLE}>{label}</span>
                    <input
                      name={name}
                      type={type}
                      required={required}
                      placeholder={placeholder}
                      className={FORM_FIELD_CLASS}
                      style={FORM_FIELD_STYLE}
                    />
                  </label>
                ))}
              </div>

              <label className="grid gap-2">
                <span style={FORM_LABEL_STYLE}>Message</span>
                <textarea
                  name="message"
                  required
                  placeholder="Tell us about your cooling goals, timeline, and how we can help."
                  className={`${FORM_FIELD_CLASS} min-h-32 resize-none`}
                  style={FORM_FIELD_STYLE}
                />
              </label>

              <PrimaryBtn
                type="submit"
                disabled={status === "submitting"}
                className="justify-center mt-2"
              >
                {status === "submitting" ? "Sending..." : "Send message"}{" "}
                {status !== "submitting" && <ArrowRight size={14} />}
              </PrimaryBtn>

              {status === "success" && (
                <div
                  className="rounded-xl px-4 py-3 border"
                  style={{
                    background: "rgba(95,210,255,0.09)",
                    borderColor: "rgba(130,220,255,0.22)",
                    color: "oklch(0.82 0.07 204)",
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  Thanks for reaching out. We&apos;ll reply to your email soon.
                </div>
              )}

              {status === "error" && (
                <div
                  className="rounded-xl px-4 py-3 border"
                  style={{
                    background: "rgba(255,120,120,0.08)",
                    borderColor: "rgba(255,160,160,0.22)",
                    color: "oklch(0.82 0.07 20)",
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: "0.82rem",
                  color: "oklch(0.58 0.02 228)",
                  lineHeight: 1.6,
                }}
              >
                Submissions are delivered securely through Formspree to
                arktossystems@gmail.com.
              </p>
            </form>
          </GlassPanel>
        </motion.div>
      </div>
    </main>
  );
}

/* ── Careers page ────────────────────────────────────────────────── */
function CareersPage({ onHome }: { onHome: () => void }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const careersFields = [
    ["name", "Full name", "Your name", "text", true],
    ["email", "Email", "you@example.com", "email", true],
    ["role", "Role of interest", "Engineering, design, operations...", "text", false],
  ] as const;

  const openRoles = [
    "Thermal & mechanical engineering",
    "Embedded systems & firmware",
    "Product design & visual identity",
    "Community & builder relations",
  ];

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
      setErrorMessage(
        error instanceof Error
          ? error.message
          : `Something went wrong. Please try again or email ${ARKTOS_EMAIL} directly.`
      );
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden px-6 pt-36 pb-24"
      style={{ background: "oklch(0.064 0.026 246)" }}
    >
      <PhotoBackdrop
        image={careersBackground}
        position="center center"
        opacity={0.98}
        brightness={0.96}
        overlay="light"
      />

      <div className="relative z-20 max-w-6xl mx-auto">
        <GlassPanel className="mb-8 px-5 py-4" style={CONTACT_PANEL_OUTLINE}>
          <button
            onClick={onHome}
            className="inline-flex items-center gap-2 text-sm"
            style={{
              fontFamily: "'Barlow', sans-serif",
              color: "oklch(0.78 0.05 218)",
            }}
          >
            <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} />
            Back to Arktos
          </button>
        </GlassPanel>
      </div>

      <div className="relative z-20 max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pt-4"
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "oklch(0.72 0.11 204)",
              display: "block",
              marginBottom: "1.2rem",
            }}
          >
            Careers at Arktos
          </span>
          <h1
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(3.3rem, 8vw, 7rem)",
              lineHeight: 0.92,
              color: "rgba(255,255,255,0.97)",
              letterSpacing: "-0.01em",
            }}
          >
            Build cold
            <br />
            <span style={{ fontWeight: 700 }}>infrastructure.</span>
          </h1>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: "1.02rem",
              color: "oklch(0.72 0.02 228)",
              lineHeight: 1.78,
              maxWidth: "34rem",
              marginTop: "1.4rem",
            }}
          >
            Arktos is a small team rethinking thermal systems for builders and
            data centers. Fill out a short application and tell us why you want
            to join.
          </p>

          <GlassPanel className="mt-8 p-6 max-w-xl" style={CONTACT_PANEL_OUTLINE}>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "oklch(0.62 0.055 216)",
                marginBottom: "0.75rem",
                display: "block",
              }}
            >
              Open focus areas
            </span>
            <ul className="grid gap-2.5">
              {openRoles.map((role) => (
                <li
                  key={role}
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: "0.92rem",
                    color: "oklch(0.76 0.02 228)",
                    lineHeight: 1.55,
                  }}
                >
                  {role}
                </li>
              ))}
            </ul>
          </GlassPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassPanel className="p-7" style={CONTACT_PANEL_OUTLINE}>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                {careersFields.map(([name, label, placeholder, type, required]) => (
                  <label
                    key={name}
                    className={`grid gap-2 ${name === "role" ? "sm:col-span-2" : ""}`}
                  >
                    <span style={FORM_LABEL_STYLE}>{label}</span>
                    <input
                      name={name}
                      type={type}
                      required={required}
                      placeholder={placeholder}
                      className={FORM_FIELD_CLASS}
                      style={FORM_FIELD_STYLE}
                    />
                  </label>
                ))}
              </div>

              <label className="grid gap-2">
                <span style={FORM_LABEL_STYLE}>Experience</span>
                <textarea
                  name="experience"
                  required
                  placeholder="Relevant work, projects, or skills you would bring to Arktos."
                  className={`${FORM_FIELD_CLASS} min-h-28 resize-none`}
                  style={FORM_FIELD_STYLE}
                />
              </label>

              <label className="grid gap-2">
                <span style={FORM_LABEL_STYLE}>Why you want to join</span>
                <textarea
                  name="why_join"
                  required
                  placeholder="What draws you to Arktos and what do you want to help build?"
                  className={`${FORM_FIELD_CLASS} min-h-28 resize-none`}
                  style={FORM_FIELD_STYLE}
                />
              </label>

              <PrimaryBtn
                type="submit"
                disabled={status === "submitting"}
                className="justify-center mt-2"
              >
                {status === "submitting" ? "Sending..." : "Send application"}{" "}
                {status !== "submitting" && <ArrowRight size={14} />}
              </PrimaryBtn>

              {status === "success" && (
                <div
                  className="rounded-xl px-4 py-3 border"
                  style={{
                    background: "rgba(95,210,255,0.09)",
                    borderColor: "rgba(130,220,255,0.22)",
                    color: "oklch(0.82 0.07 204)",
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  Thanks for applying. We&apos;ll review your message and get back to you soon.
                </div>
              )}

              {status === "error" && (
                <div
                  className="rounded-xl px-4 py-3 border"
                  style={{
                    background: "rgba(255,120,120,0.08)",
                    borderColor: "rgba(255,160,160,0.22)",
                    color: "oklch(0.82 0.07 20)",
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: "0.82rem",
                  color: "oklch(0.58 0.02 228)",
                  lineHeight: 1.6,
                }}
              >
                Submissions are delivered securely through Formspree to {ARKTOS_EMAIL}.
              </p>
            </form>
          </GlassPanel>
        </motion.div>
      </div>
    </main>
  );
}

/* ── Product specification page ──────────────────────────────────── */
function ProductSpecPage({
  onHome,
  onPreorder,
}: {
  onHome: () => void;
  onPreorder: () => void;
}) {
  const specRows = [
    ["Product line", "Glacier air cooler"],
    ["Cooling architecture", "High-pressure tower with ice-cave inspired fin stack"],
    ["Target TDP class", "Up to 250W (thermal validation in progress)"],
    ["Fan configuration", "120mm intake, calmer acoustic curve"],
    ["Heat pipe routing", "Prototype geometry under active testing"],
    ["Contact interface", "Broad nickel-plated base plate"],
    ["Enclosure", "Frosted shroud with mountain-line visual language"],
    ["Acoustic profile", "Quiet daily-build target, fan curve tuning ongoing"],
    ["Compatibility", "Standard ATX tower and workstation builds"],
    ["Finish", "Glacier white sample (development unit)"],
    ["Prototype status", "Pre-production — specifications may change"],
  ];

  const specSections = [
    {
      title: "Thermal design",
      body: "Glacier channels dense intake paths through a fin stack shaped by frozen cavern airflow. The goal is quiet, direct cooling under sustained thermal pressure without the waste heat footprint of legacy air platforms.",
    },
    {
      title: "Acoustic engineering",
      body: "Fan geometry, blade pitch, and shroud damping are still being tuned on the white prototype sample. Final acoustics will be published after validation against workstation and gaming load profiles.",
    },
    {
      title: "Materials and finish",
      body: "The current Glacier white concept uses a frosted exterior treatment and broad contact plate language drawn from the Arktos mountain theme. Final materials, coatings, and colorways may shift before launch.",
    },
    {
      title: "Prototype disclaimer",
      body: "All values on this page reflect the current development program. Performance, compatibility, dimensions, pricing, and ship windows will be finalized after thermal, acoustic, and reliability testing.",
    },
  ];

  return (
    <main
      className="relative min-h-screen overflow-hidden px-6 pt-36 pb-24"
      style={{ background: "oklch(0.064 0.026 246)" }}
    >
      <PhotoBackdrop
        image={productSpecBackground}
        position="center center"
        opacity={0.98}
        brightness={0.96}
        overlay="light"
      />

      <div className="relative z-20 max-w-6xl mx-auto">
        <GlassPanel className="mb-8 px-5 py-4" style={CONTACT_PANEL_OUTLINE}>
          <button
            onClick={onHome}
            className="inline-flex items-center gap-2 text-sm"
            style={{
              fontFamily: "'Barlow', sans-serif",
              color: "oklch(0.78 0.05 218)",
            }}
          >
            <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} />
            Back to Arktos
          </button>
        </GlassPanel>
      </div>

      <div className="relative z-20 max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pt-4"
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "oklch(0.72 0.11 204)",
              display: "block",
              marginBottom: "1.2rem",
            }}
          >
            Product documentation
          </span>
          <h1
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(3.3rem, 8vw, 7rem)",
              lineHeight: 0.92,
              color: "rgba(255,255,255,0.97)",
              letterSpacing: "-0.01em",
            }}
          >
            Glacier
            <br />
            <span style={{ fontWeight: 700 }}>specifications.</span>
          </h1>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: "1.02rem",
              color: "oklch(0.72 0.02 228)",
              lineHeight: 1.78,
              maxWidth: "34rem",
              marginTop: "1.4rem",
            }}
          >
            Current prototype targets for the Arktos Glacier air cooler line.
            These figures reflect engineering direction while the white sample
            moves through thermal, acoustic, and finish validation.
          </p>
          <PrimaryBtn onClick={onPreorder} className="mt-8">
            Preorder Glacier <ArrowRight size={14} />
          </PrimaryBtn>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-6"
        >
          <GlassPanel className="p-7 overflow-hidden" style={CONTACT_PANEL_OUTLINE}>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "oklch(0.62 0.055 216)",
                display: "block",
                marginBottom: "1rem",
              }}
            >
              Specification sheet
            </span>
            <div className="grid gap-0 divide-y divide-white/[0.08]">
              {specRows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid sm:grid-cols-[0.95fr_1.05fr] gap-3 py-3.5 first:pt-0 last:pb-0"
                >
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.72rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "oklch(0.62 0.055 216)",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: "0.95rem",
                      color: "oklch(0.84 0.02 228)",
                      lineHeight: 1.55,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </GlassPanel>

          {specSections.map((section) => (
            <GlassPanel key={section.title} className="p-7" style={CONTACT_PANEL_OUTLINE}>
              <h2
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600,
                  fontSize: "1.45rem",
                  color: "rgba(255,255,255,0.94)",
                  marginBottom: "0.55rem",
                }}
              >
                {section.title}
              </h2>
              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: "0.98rem",
                  color: "oklch(0.76 0.02 228)",
                  lineHeight: 1.75,
                }}
              >
                {section.body}
              </p>
            </GlassPanel>
          ))}
        </motion.div>
      </div>
    </main>
  );
}

/* ── Legal pages ─────────────────────────────────────────────────── */
function LegalPage({
  type,
  onHome,
  a11y,
  onToggleA11y,
}: {
  type: "privacy" | "terms" | "accessibility";
  onHome: () => void;
  a11y: boolean;
  onToggleA11y: () => void;
}) {
  const isPrivacy = type === "privacy";
  const isAccessibility = type === "accessibility";
  const sections = isPrivacy
    ? PRIVACY_POLICY_SECTIONS
    : isAccessibility
      ? ACCESSIBILITY_SECTIONS
      : [
        {
          title: "Use of the site",
          body: "This site presents Arktos Systems concepts, prototype information, and early access opportunities. Product details may change as engineering validation continues.",
        },
        {
          title: "Preorders",
          body: "Joining the Glacier preorder list is an expression of interest only. It does not reserve final inventory, guarantee price, confirm specifications, or require payment.",
        },
        {
          title: "Prototype status",
          body: "Glacier hardware is in prototype development. Performance, acoustics, compatibility, materials, availability, and shipping windows may change before launch.",
        },
        {
          title: "Site content",
          body: "Arktos names, graphics, product concepts, and site assets are presented for Arktos Systems and may not be reused as a competing product identity without permission.",
        },
      ];

  return (
    <main
      className="relative min-h-screen overflow-hidden px-6 pt-36 pb-24"
      style={{ background: "oklch(0.064 0.026 246)" }}
    >
      <PhotoBackdrop
        image={legalIceBackground}
        position="center center"
        opacity={0.95}
        brightness={0.94}
        overlay="light"
      />

      <div className="relative z-20 max-w-4xl mx-auto">
        <button
          onClick={onHome}
          className="mb-8 inline-flex items-center gap-2 text-sm"
          style={{
            fontFamily: "'Barlow', sans-serif",
            color: "oklch(0.78 0.05 218)",
          }}
        >
          <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} />
          Back to Arktos
        </button>

        <GlassPanel className="p-8 md:p-12">
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "oklch(0.72 0.11 204)",
              display: "block",
              marginBottom: "1.1rem",
            }}
          >
            Arktos Systems
          </span>
          <h1
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(3rem, 7vw, 5.8rem)",
              lineHeight: 0.95,
              color: "rgba(255,255,255,0.97)",
              marginBottom: "1rem",
            }}
          >
            {isPrivacy ? "Privacy Policy" : isAccessibility ? "Accessibility Statement" : "Terms of Service"}
          </h1>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: "0.95rem",
              color: "oklch(0.75 0.02 228)",
              lineHeight: 1.75,
              maxWidth: "42rem",
              marginBottom: "2rem",
            }}
          >
            Last updated{" "}
            {isPrivacy
              ? PRIVACY_POLICY_LAST_UPDATED
              : isAccessibility
                ? ACCESSIBILITY_LAST_UPDATED
                : "June 24, 2026"}
            .
            {isPrivacy
              ? ` ${PRIVACY_POLICY_INTRO}`
              : isAccessibility
                ? " This statement describes how we approach accessibility on the Arktos Systems website."
                : " This page is written for the current Arktos Systems prototype website and Glacier preorder flow."}
          </p>

          {isAccessibility && (
            <div
              className="mb-8 p-5 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              style={{
                background: "rgba(90,150,255,0.06)",
                border: "1px solid rgba(90,150,255,0.12)",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                    fontSize: "1.2rem",
                    color: "rgba(255,255,255,0.94)",
                    marginBottom: "0.35rem",
                  }}
                >
                  Accessibility mode
                </h2>
                <p
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: "0.92rem",
                    color: "oklch(0.76 0.02 228)",
                    lineHeight: 1.65,
                  }}
                >
                  Turn on high-contrast reading mode across the site.
                </p>
              </div>
              <button
                onClick={onToggleA11y}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: a11y ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.08)",
                  border: a11y ? "1px solid rgba(0,0,0,0.3)" : "1px solid rgba(160,200,255,0.18)",
                  color: a11y ? "#000" : "rgba(255,255,255,0.9)",
                }}
                aria-pressed={a11y}
                aria-label="Toggle accessibility mode"
              >
                {a11y ? <EyeOff size={14} /> : <Eye size={14} />}
                {a11y ? "Exit Accessibility Mode" : "Enable Accessibility Mode"}
              </button>
            </div>
          )}

          {isPrivacy && (
            <div
              className="mb-8 p-5 rounded-xl"
              style={{
                background: "rgba(90,150,255,0.06)",
                border: "1px solid rgba(90,150,255,0.12)",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  color: "rgba(255,255,255,0.94)",
                  marginBottom: "0.75rem",
                }}
              >
                Summary of Key Points
              </h2>
              <ul
                className="grid gap-2"
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: "0.92rem",
                  color: "oklch(0.76 0.02 228)",
                  lineHeight: 1.7,
                  paddingLeft: "1.1rem",
                }}
              >
                {PRIVACY_POLICY_SUMMARY.map((point) => (
                  <li key={point.slice(0, 40)}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-6">
            {sections.map((section) => (
              <section key={section.title}>
                <h2
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                    fontSize: "1.45rem",
                    color: "rgba(255,255,255,0.94)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {section.title}
                </h2>
                <p
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: "0.98rem",
                    color: "oklch(0.76 0.02 228)",
                    lineHeight: 1.75,
                  }}
                >
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </GlassPanel>
      </div>
    </main>
  );
}

/* ── Footer ──────────────────────────────────────────────────────── */
function Footer({
  onLegalPage,
  onContact,
  onCareers,
  onCooling,
  onKryos,
}: {
  onLegalPage: (page: "privacy" | "terms" | "accessibility") => void;
  onContact: () => void;
  onCareers: () => void;
  onCooling: () => void;
  onKryos: () => void;
}) {
  const footerLinks = [
    { label: "Arktos Cooling", action: () => onCooling() },
    { label: "Kryos Motion", action: () => onKryos() },
    { label: "Privacy", action: () => onLegalPage("privacy") },
    { label: "Terms", action: () => onLegalPage("terms") },
    { label: "Accessibility", action: () => onLegalPage("accessibility") },
    { label: "Careers", action: () => onCareers() },
    { label: "Contact", action: () => onContact() },
  ];

  return (
    <footer
      className="py-12 px-6 border-t"
      style={{
        background: "oklch(0.072 0.022 244)",
        borderColor: "rgba(160,200,255,0.07)",
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <ImageWithFallback
            src={logoPanoramic}
            alt="Arktos Systems — panoramic mountain logo"
            className="h-14 w-auto max-w-[280px] object-contain"
            style={{ ...LOGO_SHARP, opacity: 0.72 }}
          />

          <SocialLinkButtons compact />
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-2 items-center">
          {footerLinks.map((l) => (
            <button
              key={l.label}
              type="button"
              onClick={l.action}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: "0.8rem",
                color: "oklch(0.42 0.02 230)",
                letterSpacing: "0.04em",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLButtonElement).style.color = "oklch(0.64 0.02 225)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLButtonElement).style.color = "oklch(0.42 0.02 230)")
              }
            >
              {l.label}
            </button>
          ))}
        </nav>

        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            color: "oklch(0.36 0.02 230)",
          }}
        >
          © 2026 Arktos Systems, Inc.
        </p>
      </div>
    </footer>
  );
}


/* ── Root ────────────────────────────────────────────────────────── */
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [page, setPage] = useState<
    | "home"
    | "preorder"
    | "contact"
    | "docs"
    | "careers"
    | "privacy"
    | "terms"
    | "accessibility"
    | "cooling"
    | "kryos"
    | ProductId
  >("home");
  const [a11y, setA11y] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("a11y-mode", a11y);
  }, [a11y]);

  const toggleA11y = () => setA11y((v) => !v);

  const goHome = () => {
    setPage("home");
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const goPreorder = () => {
    setPage("preorder");
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const goSection = (section: string) => {
    setPage("home");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const target = document.getElementById(section);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    });
  };

  const goContact = () => {
    setPage("contact");
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const goDocs = () => {
    setPage("docs");
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const goCareers = () => {
    setPage("careers");
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const goLegalPage = (nextPage: "privacy" | "terms" | "accessibility") => {
    setPage(nextPage);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const goProduct = (id: ProductId) => {
    setPage(id);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const goCooling = () => {
    setPage("cooling");
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const goKryos = () => {
    setPage("kryos");
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  return (
    <div
      className="relative"
      style={{ fontFamily: "'Barlow', sans-serif", background: "oklch(0.09 0.022 242)" }}
    >
      {!a11y && <Snow />}
      <Navbar
        scrolled={scrolled}
        onHome={goHome}
        onPreorder={goPreorder}
        onContact={goContact}
        onDocs={goDocs}
        onCooling={goCooling}
        onKryos={goKryos}
        onNavigateSection={goSection}
      />
      {page === "home" ? (
        <>
          <Hero onCooling={goCooling} onKryos={goKryos} />
          <Divisions onCooling={goCooling} onKryos={goKryos} />
          <Mission />
          <Platform />
          <GlacierLine onPreorder={goPreorder} />
          <Team />
          <CTA onPreorder={goPreorder} />
        </>
      ) : page === "preorder" ? (
        <PreorderPage onHome={goHome} />
      ) : page === "cooling" ? (
        <CoolingPage onHome={goHome} onPreorder={goPreorder} onProduct={goProduct} />
      ) : page === "kryos" ? (
        <KryosPage onHome={goHome} onContact={goContact} onProduct={goProduct} />
      ) : page === "contact" ? (
        <ContactPage onHome={goHome} />
      ) : page === "docs" ? (
        <ProductSpecPage onHome={goHome} onPreorder={goPreorder} />
      ) : page === "careers" ? (
        <CareersPage onHome={goHome} />
      ) : page in PRODUCTS ? (
        <ProductDescriptionPage
          product={PRODUCTS[page as ProductId]}
          onHome={goHome}
          onBack={PRODUCTS[page as ProductId].division === "cooling" ? goCooling : goKryos}
          backLabel={
            PRODUCTS[page as ProductId].division === "cooling"
              ? "Back to Arktos Cooling"
              : "Back to Kryos Motion"
          }
          onReserve={goPreorder}
          onContact={goContact}
        />
      ) : (
        <LegalPage
          type={page as "privacy" | "terms" | "accessibility"}
          onHome={goHome}
          a11y={a11y}
          onToggleA11y={toggleA11y}
        />
      )}
      <Footer
        onLegalPage={goLegalPage}
        onContact={goContact}
        onCareers={goCareers}
        onCooling={goCooling}
        onKryos={goKryos}
      />
      <CookieBanner onPrivacy={() => goLegalPage("privacy")} />
    </div>
  );
}
