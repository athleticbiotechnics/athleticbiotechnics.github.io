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
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoDiamond from "@/imports/ChatGPT_Image_Jun_23__2026__10_27_23_AM-1.png";
import logoPanoramic from "@/imports/f91d02c4-0551-4c7a-ba6c-43bb14ed07ee-1.png";
import logoWordmark from "@/imports/baf1f67e-cc7b-4774-b710-419ff7e8d793-1.png";
import glacierCave from "@/imports/glacier-cave.jpg";
import glacierField from "@/imports/glacier-field.jpg";
import glacierPrototype from "@/imports/glacier-prototype.jpg";
import alpineBackground from "@/imports/alpine-background.avif";
import mcdonaldLakeBackground from "@/imports/mcdonald-lake-background.jpg";
import glacierSnowBackground from "@/imports/glacier-snow-background.jpg";
import legalIceBackground from "@/imports/legal-ice-background.webp";
import kenzoTree from "@/imports/kenzo-tree.jpg";
import sidakProfile from "@/imports/sidak-profile.jpg";

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

function PhotoBackdrop({
  image,
  position = "center",
  opacity = 0.9,
}: {
  image: string;
  position?: string;
  opacity?: number;
}) {
  return (
    <>
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ objectPosition: position, opacity, filter: "brightness(0.78) saturate(1.02)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,8,18,0.58) 0%, rgba(5,14,30,0.46) 45%, rgba(3,8,18,0.76) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 24%, rgba(255,255,255,0.08) 0%, transparent 55%)",
        }}
      />
    </>
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
const NAV_LINKS = ["Platform", "Mission", "Team", "Docs"];

function Navbar({
  scrolled,
  onHome,
  onPreorder,
  onNavigateSection,
}: {
  scrolled: boolean;
  onHome: () => void;
  onPreorder: () => void;
  onNavigateSection: (section: string) => void;
}) {
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
          backdropFilter: scrolled ? "blur(8px) saturate(1.2)" : "blur(4px)",
          background: scrolled ? "rgba(6,12,26,0.82)" : "rgba(6,12,26,0.48)",
          border: `1px solid ${scrolled ? "rgba(160,200,255,0.12)" : "rgba(160,200,255,0.07)"}`,
          boxShadow: scrolled
            ? "inset 0 1.5px 0 rgba(200,230,255,0.09), 0 8px 40px rgba(0,0,0,0.5)"
            : "none",
        }}
      >
        {/* Logo */}
        <button className="flex items-center" onClick={onHome} aria-label="Go to home">
          <ImageWithFallback
            src={logoDiamond}
            alt="Arktos Systems — diamond mountain mark with wordmark"
            className="h-10 w-auto object-contain"
            style={LOGO_STYLE}
          />
        </button>

        <button
          className="hidden lg:flex items-center justify-center flex-1 max-w-[240px] mx-6"
          onClick={onHome}
          aria-label="Arktos Systems home"
        >
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: "1.05rem",
              fontWeight: 500,
              letterSpacing: "0.52em",
              color: "rgba(235,245,255,0.78)",
              textTransform: "uppercase",
              textShadow: "0 0 20px rgba(140,210,255,0.16)",
            }}
          >
            Arktos
          </span>
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <button
                type="button"
                onClick={() => onNavigateSection(link.toLowerCase())}
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
                {link}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <GhostBtn>Contact us</GhostBtn>
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
              className="h-6 w-auto object-contain"
              style={LOGO_STYLE}
            />
          </div>
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onNavigateSection(link.toLowerCase());
                  }}
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-5 border-t border-white/[0.08]">
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
function Hero({ onPreorder }: { onPreorder: () => void }) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Mountain rises and expands as the user scrolls, without competing animations.
  const imgY = useTransform(scrollYProgress, [0, 1], ["4%", "-18%"]);
  // Content fades out as you scroll
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.45], ["0%", "-12%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.22]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-center justify-center"
    >
      {/* Parallax image */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: imgY, scale: imgScale, transformOrigin: "center bottom", willChange: "transform" }}
      >
        <img
          src={HERO_IMG}
          alt="Snow-covered Glacier National Park mountains reflected in Lake McDonald"
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.74) saturate(1.04)" }}
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

      {/* Content */}
      <motion.div
        className="relative z-20 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-7"
        style={{ opacity: contentOpacity, y: contentY }}
      >
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
          <PrimaryBtn onClick={onPreorder}>
            Get started today <ArrowRight size={15} />
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
      <PhotoBackdrop image={alpineBackground} position="center" opacity={0.92} />
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
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: "oklch(0.09 0.022 242)" }}
    >
      <PhotoBackdrop image={mcdonaldLakeBackground} position="center" opacity={0.94} />
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
      <PhotoBackdrop image={glacierPrototype} position="center 38%" opacity={0.9} />
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
                style={{ filter: "brightness(0.62) saturate(0.95)" }}
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
      <PhotoBackdrop image={alpineBackground} position="center" opacity={0.9} />
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
      <PhotoBackdrop image={mcdonaldLakeBackground} position="center" opacity={0.94} />
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

/* ── Preorder page ───────────────────────────────────────────────── */
function PreorderPage({ onHome }: { onHome: () => void }) {
  const preorderCount = 0;
  const [submitted, setSubmitted] = useState(false);

  const preorderFields = [
    ["Full name", "Your name", "text"],
    ["Email", "you@example.com", "email"],
    ["Phone", "(555) 123-4567", "tel"],
    ["Company / team", "Arktos Lab, home build, studio...", "text"],
    ["Role / credentials", "CAD engineer, PC builder, IT lead...", "text"],
    ["Shipping region", "Arizona, United States", "text"],
    ["Build type", "Gaming PC, workstation, server rack...", "text"],
    ["Units wanted", "1", "number"],
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden px-6 pt-36 pb-24"
      style={{ background: "oklch(0.064 0.026 246)" }}
    >
      <PhotoBackdrop image={mcdonaldLakeBackground} position="center" opacity={0.96} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,12,26,0.72) 0%, rgba(4,9,20,0.95) 72%), radial-gradient(ellipse at 50% 20%, rgba(64,176,216,0.18) 0%, transparent 58%)",
        }}
      />
      <img
        src={glacierSnowBackground}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20"
        style={{ filter: "brightness(0.72) saturate(0.9)", mixBlendMode: "screen" }}
      />

      <div className="relative z-20 max-w-6xl mx-auto">
        <GlassPanel className="mb-8 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

          <div className="flex items-center gap-4">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: "oklch(0.72 0.12 196)",
                boxShadow: "0 0 14px oklch(0.72 0.12 196)",
                animation: "pulse 2s infinite",
              }}
            />
            <div className="flex items-baseline gap-3">
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
                  lineHeight: 0.9,
                  color: "rgba(255,255,255,0.96)",
                }}
              >
                {preorderCount.toLocaleString()}
              </strong>
            </div>
          </div>
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
                  src={glacierPrototype}
                  alt="White glacier prototype visual for the Glacier air cooler line"
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
          <GlassPanel className="p-7">
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                {preorderFields.map(([label, placeholder, type]) => (
                  <label key={label} className="grid gap-2">
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.68rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "oklch(0.62 0.055 216)",
                      }}
                    >
                      {label}
                    </span>
                    <input
                      type={type}
                      min={type === "number" ? 1 : undefined}
                      required={["Full name", "Email"].includes(label)}
                      placeholder={placeholder}
                      className="w-full rounded-xl px-4 py-3 outline-none border"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        borderColor: "rgba(160,200,255,0.18)",
                        color: "rgba(255,255,255,0.92)",
                        fontFamily: "'Barlow', sans-serif",
                      }}
                    />
                  </label>
                ))}
              </div>

              <label className="grid gap-2">
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.68rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "oklch(0.62 0.055 216)",
                  }}
                >
                  Prototype access notes
                </span>
                <textarea
                  placeholder="Tell us your cooling goals, preferred contact method, and any builder credentials we should know."
                  className="w-full min-h-28 rounded-xl px-4 py-3 outline-none border resize-none"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(160,200,255,0.18)",
                    color: "rgba(255,255,255,0.92)",
                    fontFamily: "'Barlow', sans-serif",
                  }}
                />
              </label>

              <label className="flex items-start gap-3 rounded-xl border p-4">
                <input
                  type="checkbox"
                  required
                  className="mt-1"
                  style={{ accentColor: "oklch(0.7 0.14 220)" }}
                />
                <span
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: "0.86rem",
                    color: "oklch(0.68 0.02 228)",
                    lineHeight: 1.55,
                  }}
                >
                  I understand Glacier is still a prototype and Arktos will
                  contact me before any payment, shipment, or final reservation.
                </span>
              </label>

              <PrimaryBtn className="justify-center mt-2">
                Join preorder list <ArrowRight size={14} />
              </PrimaryBtn>

              {submitted && (
                <div
                  className="rounded-xl px-4 py-3 border"
                  style={{
                    background: "rgba(95,210,255,0.09)",
                    borderColor: "rgba(130,220,255,0.22)",
                    color: "oklch(0.82 0.07 204)",
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  You&apos;re on the prototype access list. The live counter has
                  not changed until real preorders are recorded.
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
                Prototype in progress. Final specs, price, and ship window will
                be announced after thermal and acoustic validation.
              </p>
            </form>
          </GlassPanel>
        </motion.div>
      </div>
    </main>
  );
}

/* ── Legal pages ─────────────────────────────────────────────────── */
function LegalPage({
  type,
  onHome,
}: {
  type: "privacy" | "terms";
  onHome: () => void;
}) {
  const isPrivacy = type === "privacy";
  const sections = isPrivacy
    ? [
        {
          title: "What we collect",
          body: "When you join the Glacier preorder list, Arktos collects the details you choose to submit, including name, email, phone, company or team, build type, shipping region, requested units, and prototype access notes.",
        },
        {
          title: "How we use it",
          body: "We use preorder information to contact interested builders, validate demand, plan prototype access, estimate regional launch needs, and send product updates related to Glacier and Arktos Systems.",
        },
        {
          title: "Prototype access",
          body: "Submitting the form does not create a purchase, payment obligation, or guaranteed shipment. We will contact you before any paid reservation or prototype program begins.",
        },
        {
          title: "Data choices",
          body: "You can ask us to update or remove your preorder information by contacting Arktos Systems. We do not sell preorder list information.",
        },
      ]
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
      <img
        src={legalIceBackground}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ objectPosition: "center", filter: "brightness(0.92) saturate(1.06)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,8,18,0.2) 0%, rgba(3,8,18,0.36) 48%, rgba(3,8,18,0.58) 100%)",
        }}
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
            {isPrivacy ? "Privacy Policy" : "Terms of Service"}
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
            Last updated June 24, 2026. This page is written for the current
            Arktos Systems prototype website and Glacier preorder flow.
          </p>

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
}: {
  onLegalPage: (page: "privacy" | "terms") => void;
}) {
  const footerLinks = [
    { label: "Privacy", action: () => onLegalPage("privacy") },
    { label: "Terms", action: () => onLegalPage("terms") },
    { label: "Careers", action: undefined },
    { label: "Contact", action: undefined },
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
            className="h-12 w-auto object-contain"
            style={{ ...LOGO_STYLE, opacity: 0.6 }}
          />

          <div className="flex flex-wrap items-center gap-3">
            {[
              { icon: <Youtube size={15} />, label: "YouTube @ArktosSystems" },
              { icon: <Instagram size={15} />, label: "Instagram @Arktos_Systems" },
              { icon: <MessageCircle size={15} />, label: "Support Discord coming soon" },
            ].map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border"
                style={{
                  borderColor: "rgba(160,200,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  color: "oklch(0.58 0.025 228)",
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: "0.78rem",
                }}
              >
                {item.icon}
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-2">
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
  const [page, setPage] = useState<"home" | "preorder" | "privacy" | "terms">("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const goLegalPage = (nextPage: "privacy" | "terms") => {
    setPage(nextPage);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  return (
    <div
      className="relative"
      style={{ fontFamily: "'Barlow', sans-serif", background: "oklch(0.09 0.022 242)" }}
    >
      <Snow />
      <Navbar
        scrolled={scrolled}
        onHome={goHome}
        onPreorder={goPreorder}
        onNavigateSection={goSection}
      />
      {page === "home" ? (
        <>
          <Hero onPreorder={goPreorder} />
          <Mission />
          <Platform />
          <GlacierLine onPreorder={goPreorder} />
          <Team />
          <CTA onPreorder={goPreorder} />
        </>
      ) : page === "preorder" ? (
        <PreorderPage onHome={goHome} />
      ) : (
        <LegalPage type={page} onHome={goHome} />
      )}
      <Footer onLegalPage={goLegalPage} />
    </div>
  );
}
