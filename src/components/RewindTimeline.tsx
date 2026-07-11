import { useEffect, useMemo, useRef, useState } from "react";
import { Play } from "lucide-react";

/* ── The signature element ────────────────────────────────────────────
   A board's final 5.5 seconds, recorded. Drag the playhead to rewind
   through boot → load spike → brownout → watchdog → reset and watch the
   rail voltage, current, and last UART line at that exact instant.
─────────────────────────────────────────────────────────────────────── */

const DURATION = 5.5; // seconds of recording
const W = 660;
const H = 250;
const PAD_L = 8;
const PLOT_W = W - PAD_L - 8;

// Voltage plot band
const V_TOP = 26;
const V_BOT = 116;
const V_MIN = 2.6;
const V_MAX = 3.45;
// Current plot band
const C_TOP = 152;
const C_BOT = 214;
const C_MIN = 0;
const C_MAX = 950;

type EventMark = {
  t: number;
  label: string;
  uart: string;
  fault?: boolean;
};

const EVENTS: EventMark[] = [
  { t: 0.15, label: "Boot", uart: "boot: STM32H7 online" },
  { t: 1.0, label: "Init", uart: "init: peripherals ready" },
  { t: 3.8, label: "Motor enable", uart: "gpio: MOTOR_EN → HIGH" },
  { t: 4.35, label: "Brownout", uart: "adc: rail 2.91 V", fault: true },
  { t: 4.65, label: "Watchdog", uart: "fault: watchdog timeout", fault: true },
  { t: 5.05, label: "Reset", uart: "reset: board rebooting", fault: true },
];

function voltageAt(t: number): number {
  if (t < 3.8) return 3.3 + Math.sin(t * 9) * 0.012;
  if (t < 4.1) return 3.3 - (t - 3.8) * 0.2; // slight sag under load
  if (t < 4.35) return 3.24 - (t - 4.1) * (0.33 / 0.25); // plunge to 2.91
  if (t < 4.65) return 2.91 - (t - 4.35) * 0.5; // sink further
  if (t < 5.05) return 2.76 + Math.sin(t * 30) * 0.03; // ragged brownout
  if (t < 5.15) return 0.1; // reset drop
  return Math.min(3.3, 0.1 + (t - 5.15) * 9); // reboot climb
}

function currentAt(t: number): number {
  if (t < 3.8) return 180 + Math.sin(t * 7) * 6;
  if (t < 4.1) return 180 + (t - 3.8) * (540 / 0.3); // ramp to 720
  if (t < 4.35) return 720 + (t - 4.1) * (200 / 0.25); // spike to ~920
  if (t < 5.05) return 900 - (t - 4.35) * 120 + Math.sin(t * 26) * 30;
  if (t < 5.15) return 40; // collapse at reset
  return 180 + Math.sin(t * 7) * 6;
}

const xAt = (t: number) => PAD_L + (t / DURATION) * PLOT_W;
const vY = (v: number) =>
  V_BOT - ((v - V_MIN) / (V_MAX - V_MIN)) * (V_BOT - V_TOP);
const cY = (c: number) =>
  C_BOT - ((c - C_MIN) / (C_MAX - C_MIN)) * (C_BOT - C_TOP);

function buildPath(fn: (t: number) => number, y: (v: number) => number) {
  const pts: string[] = [];
  const N = 300;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * DURATION;
    pts.push(`${i === 0 ? "M" : "L"}${xAt(t).toFixed(1)} ${y(fn(t)).toFixed(1)}`);
  }
  return pts.join(" ");
}

function fmtClock(t: number) {
  const total = 10 + t; // 12:03:10 + t
  const s = Math.floor(total);
  const frac = Math.floor((total - s) * 10);
  return `12:03:${String(s).padStart(2, "0")}.${frac}`;
}

export function RewindTimeline() {
  const [pos, setPos] = useState(0.845); // start parked in the fault (watchdog)
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number | null>(null);

  const voltagePath = useMemo(() => buildPath(voltageAt, vY), []);
  const currentPath = useMemo(() => buildPath(currentAt, cY), []);

  const t = pos * DURATION;
  const v = voltageAt(t);
  const c = currentAt(t);
  const px = xAt(t);
  const inFault = t >= 4.1 && t < 5.15;

  // Most recent UART line at this instant
  const lastEvent = useMemo(() => {
    let cur = EVENTS[0];
    for (const e of EVENTS) if (t >= e.t) cur = e;
    return cur;
  }, [t]);

  const replay = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPos(0.94);
      return;
    }
    if (raf.current) cancelAnimationFrame(raf.current);
    setPlaying(true);
    setPos(0);
    const start = performance.now();
    const dur = 4200;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setPos(p);
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setPlaying(false);
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  const stop = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setPlaying(false);
  };

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        background: "var(--ark-panel-2)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid var(--ark-line)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
      }}
    >
      {/* header bar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--ark-line-soft)" }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: inFault ? "var(--ark-fault)" : "var(--ark-signal)" }}
          />
          <span
            style={{
              fontFamily: "var(--ark-mono)",
              fontSize: "0.68rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--ark-ink-dim)",
            }}
          >
            BlackBox · recording playback
          </span>
        </div>
        <button
          type="button"
          onClick={playing ? stop : replay}
          className="ark-focus inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors"
          style={{
            fontFamily: "var(--ark-mono)",
            fontSize: "0.66rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--ark-signal)",
            background: "rgba(168,203,232,0.08)",
            border: "1px solid rgba(168,203,232,0.24)",
          }}
        >
          <Play size={11} />
          {playing ? "Playing" : "Replay"}
        </button>
      </div>

      {/* scope */}
      <div className="px-3 pt-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Oscilloscope trace of the board's rail voltage and current over its final seconds">
          {/* graticule */}
          <g stroke="var(--ark-line-soft)" strokeWidth="1">
            {[V_TOP, (V_TOP + V_BOT) / 2, V_BOT, C_TOP, (C_TOP + C_BOT) / 2, C_BOT].map((y) => (
              <line key={y} x1={PAD_L} y1={y} x2={W - 8} y2={y} />
            ))}
          </g>

          {/* axis labels */}
          <text x={PAD_L} y={V_TOP - 8} fontFamily="var(--ark-mono)" fontSize="9" letterSpacing="1.5" fill="var(--ark-muted)">RAIL · V</text>
          <text x={PAD_L} y={C_TOP - 8} fontFamily="var(--ark-mono)" fontSize="9" letterSpacing="1.5" fill="var(--ark-muted)">CURRENT · mA</text>
          <text x={W - 8} y={V_TOP - 8} textAnchor="end" fontFamily="var(--ark-mono)" fontSize="9" fill="var(--ark-faint)">3.30</text>
          <text x={W - 8} y={C_TOP - 8} textAnchor="end" fontFamily="var(--ark-mono)" fontSize="9" fill="var(--ark-faint)">0–950</text>

          {/* fault band */}
          <rect x={xAt(4.1)} y={V_TOP - 4} width={xAt(5.15) - xAt(4.1)} height={C_BOT - V_TOP + 8} fill="rgba(255,255,255,0.06)" />

          {/* full faint traces */}
          <path d={voltagePath} fill="none" stroke="var(--ark-signal)" strokeOpacity="0.22" strokeWidth="1.6" />
          <path d={currentPath} fill="none" stroke="var(--ark-amber)" strokeOpacity="0.2" strokeWidth="1.6" />

          {/* bright "played" portion, clipped to the playhead */}
          <clipPath id="rw-clip">
            <rect x="0" y="0" width={px} height={H} />
          </clipPath>
          <g clipPath="url(#rw-clip)">
            <path d={voltagePath} fill="none" stroke="var(--ark-signal)" strokeWidth="2.2" style={{ filter: "drop-shadow(0 0 4px rgba(168,203,232,0.4))" }} />
            <path d={currentPath} fill="none" stroke="var(--ark-amber)" strokeWidth="2" />
          </g>

          {/* event ticks */}
          {EVENTS.map((e) => (
            <g key={e.label}>
              <line
                x1={xAt(e.t)}
                y1={V_TOP - 4}
                x2={xAt(e.t)}
                y2={C_BOT + 4}
                stroke={e.fault ? "var(--ark-fault)" : "var(--ark-line)"}
                strokeOpacity={e.fault ? 0.5 : 0.7}
                strokeDasharray="3 4"
              />
              <circle cx={xAt(e.t)} cy={C_BOT + 4} r="2.5" fill={e.fault ? "var(--ark-fault)" : "var(--ark-signal)"} />
            </g>
          ))}

          {/* playhead */}
          <line x1={px} y1={V_TOP - 8} x2={px} y2={C_BOT + 8} stroke="#fff" strokeOpacity="0.7" strokeWidth="1.4" />
          <circle cx={px} cy={vY(v)} r="4.5" fill={inFault ? "var(--ark-fault)" : "var(--ark-signal)"} stroke="#05070c" strokeWidth="1.5" />
          <circle cx={px} cy={cY(c)} r="4" fill="var(--ark-amber)" stroke="#05070c" strokeWidth="1.5" />
        </svg>
      </div>

      {/* scrubber */}
      <div className="px-4 pt-1 pb-3">
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(pos * 1000)}
          onChange={(e) => {
            stop();
            setPos(Number(e.target.value) / 1000);
          }}
          aria-label="Rewind through the recording"
          className="ark-range w-full"
        />
        <div className="flex justify-between mt-1">
          {EVENTS.map((e) => (
            <button
              key={e.label}
              type="button"
              onClick={() => {
                stop();
                setPos(e.t / DURATION);
              }}
              className="ark-focus"
              style={{
                fontFamily: "var(--ark-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.04em",
                color: e.fault ? "var(--ark-fault-2)" : "var(--ark-muted)",
                background: "none",
                border: "none",
                padding: "2px 0",
                cursor: "pointer",
              }}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* readout */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-px"
        style={{ background: "var(--ark-line-soft)", borderTop: "1px solid var(--ark-line-soft)" }}
      >
        {[
          { k: "TIME", val: fmtClock(t), c: "var(--ark-ink)" },
          { k: "RAIL", val: `${v.toFixed(2)} V`, c: v < 3.0 ? "var(--ark-fault)" : "var(--ark-signal)" },
          { k: "CURRENT", val: `${Math.round(c)} mA`, c: c > 600 ? "var(--ark-amber)" : "var(--ark-ink)" },
          { k: "STATE", val: inFault ? "FAULT" : "NOMINAL", c: inFault ? "var(--ark-fault)" : "var(--ark-signal)" },
        ].map((r) => (
          <div key={r.k} className="px-4 py-3" style={{ background: "var(--ark-panel)" }}>
            <div style={{ fontFamily: "var(--ark-mono)", fontSize: "0.58rem", letterSpacing: "0.16em", color: "var(--ark-faint)" }}>{r.k}</div>
            <div style={{ fontFamily: "var(--ark-mono)", fontSize: "1rem", fontWeight: 500, color: r.c, marginTop: "3px" }}>{r.val}</div>
          </div>
        ))}
      </div>

      {/* UART tail */}
      <div
        className="px-4 py-2.5 flex items-center gap-3"
        style={{ borderTop: "1px solid var(--ark-line-soft)", background: "var(--ark-bg-2)" }}
      >
        <span style={{ fontFamily: "var(--ark-mono)", fontSize: "0.62rem", color: "var(--ark-faint)", letterSpacing: "0.12em" }}>UART</span>
        <span
          style={{
            fontFamily: "var(--ark-mono)",
            fontSize: "0.78rem",
            color: lastEvent.fault ? "var(--ark-fault-2)" : "var(--ark-ink-dim)",
          }}
        >
          <span style={{ color: "var(--ark-faint)" }}>{fmtClock(lastEvent.t)} </span>
          {lastEvent.uart}
        </span>
      </div>
    </div>
  );
}
