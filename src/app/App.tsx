import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
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
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoDiamond from "@/imports/ChatGPT_Image_Jun_23__2026__10_27_23_AM-1.png";
import logoPanoramic from "@/imports/f91d02c4-0551-4c7a-ba6c-43bb14ed07ee-1.png";
import logoWordmark from "@/imports/baf1f67e-cc7b-4774-b710-419ff7e8d793-1.png";

/* dark-bg logo treatment: invert dark-on-white to light-on-transparent */
const LOGO_STYLE: React.CSSProperties = {
  filter: "invert(1) brightness(1.1)",
  mixBlendMode: "screen",
};

/* ── Images ─────────────────────────────────────────────────────────── */
const HERO_IMG =
  "https://images.unsplash.com/photo-1507039915464-9d829b6d2d78?w=3840&q=92&fit=crop&auto=format";

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
      className={`backdrop-blur-[28px] bg-white/[0.06] border border-white/[0.12] rounded-2xl ${className}`}
      style={{
        boxShadow:
          "inset 0 1.5px 0 rgba(200,230,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.2), 0 24px 64px rgba(0,0,0,0.6)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Button variants ─────────────────────────────────────────────── */
function PrimaryBtn({
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
      className={`group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-medium tracking-wide overflow-hidden transition-all duration-300 ${className}`}
      style={{
        background:
          "linear-gradient(135deg, oklch(0.7 0.14 220) 0%, oklch(0.62 0.13 208) 100%)",
        color: "oklch(0.06 0.02 240)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 28px rgba(90,150,255,0.28)",
        fontFamily: "'Barlow', sans-serif",
      }}
    >
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.76 0.13 220) 0%, oklch(0.68 0.12 208) 100%)",
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
      className={`group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-medium tracking-wide backdrop-blur-xl border transition-all duration-300 hover:bg-white/[0.1] hover:border-white/[0.2] ${className}`}
      style={{
        background: "rgba(160,200,255,0.06)",
        borderColor: "rgba(160,200,255,0.14)",
        color: "oklch(0.82 0.015 222)",
        boxShadow: "inset 0 1px 0 rgba(200,230,255,0.08)",
        fontFamily: "'Barlow', sans-serif",
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
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
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
const NAV_LINKS = ["Platform", "Mission", "Team", "Docs"];

function Navbar({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 pt-5"
    >
      <div
        className="max-w-6xl mx-auto flex items-center justify-between rounded-2xl px-6 py-4 transition-all duration-700"
        style={{
          backdropFilter: scrolled ? "blur(32px) saturate(1.4)" : "blur(14px)",
          background: scrolled ? "rgba(6,12,26,0.78)" : "rgba(6,12,26,0.32)",
          border: `1px solid ${scrolled ? "rgba(160,200,255,0.12)" : "rgba(160,200,255,0.07)"}`,
          boxShadow: scrolled
            ? "inset 0 1.5px 0 rgba(200,230,255,0.09), 0 8px 40px rgba(0,0,0,0.5)"
            : "none",
        }}
      >
        {/* Logo */}
        <div className="flex items-center">
          <ImageWithFallback
            src={logoDiamond}
            alt="Arktos Systems — diamond mountain mark with wordmark"
            className="h-10 w-auto object-contain"
            style={LOGO_STYLE}
          />
        </div>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
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
                  ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.95)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = "oklch(0.68 0.02 225)")
                }
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <GhostBtn>Contact us</GhostBtn>
          <PrimaryBtn>
            Get early access <ArrowRight size={14} />
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
            backdropFilter: "blur(32px)",
            border: "1px solid rgba(160,200,255,0.12)",
          }}
        >
          <div className="mb-5 pb-5 border-b border-white/[0.08]">
            <ImageWithFallback
              src={logoWordmark}
              alt="Arktos Systems"
              className="h-6 w-auto object-contain"
              style={LOGO_STYLE}
            />
          </div>
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.nav>
  );
}

/* ── Hero ────────────────────────────────────────────────────────── */
function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Mountains rise / parallax: image moves up slower than scroll
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  // Content fades out as you scroll
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.45], ["0%", "-12%"]);
  // Image scales slightly down as you scroll in, giving a "pop" on load
  const imgScale = useTransform(scrollYProgress, [0, 0.6], [1.0, 1.06]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-center justify-center"
    >
      {/* Parallax image */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: imgY, scale: imgScale }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1.0 }}
        transition={{ duration: 10, ease: "easeOut" }}
      >
        <img
          src={HERO_IMG}
          alt="Snow-capped Swiss Alps peak rising through a sea of clouds"
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.58) saturate(0.78)" }}
        />
        {/* Atmospheric overlay — darkens edges, keeps peak luminous */}
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

      {/* Snow layer */}
      <Snow />

      {/* Content */}
      <motion.div
        className="relative z-20 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-7"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Hero logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-2"
        >
          <ImageWithFallback
            src={logoDiamond}
            alt="Arktos Systems"
            className="h-24 w-auto object-contain"
            style={{ ...LOGO_STYLE, filter: "invert(1) brightness(1.3)", opacity: 0.88 }}
          />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs"
            style={{
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              background: "rgba(80,140,255,0.1)",
              border: "1px solid rgba(120,170,255,0.2)",
              color: "oklch(0.78 0.1 216)",
              backdropFilter: "blur(14px)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "oklch(0.72 0.12 196)",
                boxShadow: "0 0 6px oklch(0.72 0.12 196)",
                animation: "pulse 2s infinite",
              }}
            />
            Sustainable thermal infrastructure
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
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
          Cool the
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
            future.
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: "1.1rem",
            color: "oklch(0.72 0.02 228)",
            lineHeight: 1.75,
            maxWidth: "38rem",
            letterSpacing: "0.01em",
          }}
        >
          Arktos Systems engineers next-generation sustainable CPU cooling
          infrastructure for data centers that demand both performance and
          planetary responsibility.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.98, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <PrimaryBtn>
            Explore our tech <ArrowRight size={15} />
          </PrimaryBtn>
          <GhostBtn>Watch overview</GhostBtn>
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
                { value: "68%", label: "Power reduction" },
                { value: "0 GWh", label: "Waste heat emitted" },
                { value: "100%", label: "Recyclable materials" },
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
        style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) as unknown as number }}
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
            Arktos Systems was founded on a single conviction: the cooling layer
            is the most leveraged point to make computation radically more
            sustainable — without sacrificing a single millisecond of
            performance.
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
      className="relative py-28 px-6"
      style={{ background: "oklch(0.09 0.022 242)" }}
    >
      <div className="max-w-6xl mx-auto">
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

/* ── Team ────────────────────────────────────────────────────────── */
const TEAM = [
  {
    name: "Sidak Mann",
    title: "Co-founder & Software Engineer",
    bio: "Sidak architects the embedded systems and thermal control software that drive Arktos cooling units. With a background in distributed systems and real-time firmware, he ensures every cold plate and manifold responds to load in microseconds.",
    initials: "SM",
    gradient: "linear-gradient(135deg, oklch(0.68 0.14 220), oklch(0.52 0.16 244))",
    accent: "oklch(0.74 0.11 216)",
  },
  {
    name: "Kenzo Liddle",
    title: "Co-founder & CAD Engineer",
    bio: "Kenzo designs the physical architecture of every Arktos cooling module — from initial CFD simulations to precision-machined cold plates. His work bridges materials science, thermodynamics, and zero-waste manufacturing principles.",
    initials: "KL",
    gradient: "linear-gradient(135deg, oklch(0.58 0.14 196), oklch(0.48 0.14 220))",
    accent: "oklch(0.68 0.13 196)",
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
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg font-semibold text-white"
                    style={{
                      background: member.gradient,
                      boxShadow: `0 0 32px ${member.accent}44`,
                      fontFamily: "'Barlow Condensed', sans-serif",
                      letterSpacing: "0.06em",
                      fontSize: "1.15rem",
                    }}
                  >
                    {member.initials}
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
function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: "oklch(0.09 0.022 242)" }}
    >
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
              <PrimaryBtn>
                Request a pilot <ArrowRight size={14} />
              </PrimaryBtn>
              <GhostBtn>Read the whitepaper</GhostBtn>
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      className="py-12 px-6 border-t"
      style={{
        background: "oklch(0.072 0.022 244)",
        borderColor: "rgba(160,200,255,0.07)",
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
        <div className="flex items-center">
          <ImageWithFallback
            src={logoPanoramic}
            alt="Arktos Systems — panoramic mountain logo"
            className="h-12 w-auto object-contain"
            style={{ ...LOGO_STYLE, opacity: 0.6 }}
          />
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-2">
          {["Privacy", "Terms", "Careers", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: "0.8rem",
                color: "oklch(0.42 0.02 230)",
                letterSpacing: "0.04em",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLAnchorElement).style.color = "oklch(0.64 0.02 225)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLAnchorElement).style.color = "oklch(0.42 0.02 230)")
              }
            >
              {l}
            </a>
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif", background: "oklch(0.09 0.022 242)" }}>
      <Navbar scrolled={scrolled} />
      <Hero />
      <Mission />
      <Platform />
      <Team />
      <CTA />
      <Footer />
    </div>
  );
}
