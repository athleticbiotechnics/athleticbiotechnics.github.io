/* Fully code-drawn product illustrations — no photography, no generated art.
   BlackBox: a top-down dev-board render. Draft: iron + collar + inline fan. */

export function BlackBoxMockup({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 300"
      className={className}
      role="img"
      aria-label="BlackBox recorder module — a small black board with status LEDs, a USB-C port and a labelled pin header"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bb-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#12161f" />
          <stop offset="1" stopColor="#080a10" />
        </linearGradient>
        <linearGradient id="bb-usb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe6ff" />
          <stop offset="1" stopColor="#7f93ad" />
        </linearGradient>
        <filter id="bb-shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="26" stdDeviation="26" floodColor="#000" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* board */}
      <g filter="url(#bb-shadow)">
        <rect x="46" y="40" width="348" height="220" rx="16" fill="url(#bb-body)" stroke="rgba(126,156,196,0.22)" />
      </g>
      <rect x="46" y="40" width="348" height="220" rx="16" fill="none" stroke="rgba(255,255,255,0.05)" />

      {/* corner mounting holes */}
      {[
        [70, 64],
        [370, 64],
        [70, 236],
        [370, 236],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6.5" fill="#05070c" stroke="rgba(126,156,196,0.35)" />
      ))}

      {/* silkscreen traces */}
      <g stroke="rgba(168,203,232,0.16)" strokeWidth="1.2" strokeLinecap="round">
        <path d="M120 120 H190 L206 136 H250" />
        <path d="M120 150 H176 L196 170 H250" />
        <path d="M300 110 H262 L246 126 H210" />
        <path d="M300 150 H270" />
      </g>

      {/* MCU chip */}
      <rect x="176" y="118" width="76" height="64" rx="6" fill="#0a0d14" stroke="rgba(126,156,196,0.3)" />
      <g fill="rgba(126,156,196,0.35)">
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={`t${i}`} x={182 + i * 8.6} y="112" width="3" height="7" rx="1" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={`b${i}`} x={182 + i * 8.6} y="182" width="3" height="7" rx="1" />
        ))}
      </g>
      <text x="214" y="154" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="8" letterSpacing="1" fill="rgba(174,185,203,0.7)">STM32H7</text>

      {/* status LEDs + labels */}
      {[
        { y: 86, c: "#7a889e", label: "PWR" },
        { y: 108, c: "#a8cbe8", label: "REC", live: true },
        { y: 130, c: "#e9f1f9", label: "TRIG" },
        { y: 152, c: "#ffffff", label: "USB" },
      ].map((d) => (
        <g key={d.label}>
          <circle cx="86" cy={d.y} r="5.5" fill={d.c} className={d.live ? "ark-led" : ""}>
            {d.live && <title>Recording</title>}
          </circle>
          {d.live && <circle cx="86" cy={d.y} r="5.5" fill="none" stroke={d.c} strokeOpacity="0.5" className="ark-led-ring" />}
          <text x="100" y={d.y + 3} fontFamily="'IBM Plex Mono', monospace" fontSize="8.5" letterSpacing="1" fill="rgba(174,185,203,0.75)">{d.label}</text>
        </g>
      ))}

      {/* USB-C port (top edge) */}
      <rect x="196" y="34" width="48" height="12" rx="6" fill="url(#bb-usb)" />
      <rect x="203" y="37" width="34" height="6" rx="3" fill="#0a0d14" />

      {/* microSD slot */}
      <rect x="300" y="196" width="60" height="34" rx="4" fill="#0a0d14" stroke="rgba(126,156,196,0.28)" />
      <text x="330" y="217" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="7.5" fill="rgba(174,185,203,0.6)">microSD</text>

      {/* pin header (bottom edge) */}
      <g>
        {["3V3", "GND", "TX", "RX", "RST", "IO0", "IO1", "AIN"].map((p, i) => (
          <g key={p}>
            <rect x={92 + i * 30} y="248" width="16" height="16" rx="3" fill="#0a0d14" stroke="rgba(126,156,196,0.32)" />
            <rect x={98 + i * 30} y="254" width="4" height="4" rx="1" fill="#e6b866" />
            <text x={100 + i * 30} y="278" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="7.5" fill="rgba(122,136,158,0.85)">{p}</text>
          </g>
        ))}
      </g>

      {/* silkscreen wordmark */}
      <text x="86" y="196" fontFamily="var(--ark-display)" fontWeight="600" fontSize="15" letterSpacing="0.5" fill="rgba(238,242,248,0.9)">BlackBox</text>
      <text x="86" y="212" fontFamily="'IBM Plex Mono', monospace" fontSize="8" letterSpacing="2" fill="rgba(168,203,232,0.75)">AX-BB1</text>
    </svg>
  );
}

export function DraftMockup({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 300"
      className={className}
      role="img"
      aria-label="Draft fume extractor — a soldering iron with a collar near the tip, a hose to an inline fan and carbon filter drawing smoke away"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="dr-iron" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1a2029" />
          <stop offset="1" stopColor="#0a0d13" />
        </linearGradient>
        <linearGradient id="dr-fan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12161f" />
          <stop offset="1" stopColor="#080b11" />
        </linearGradient>
        <radialGradient id="dr-tip" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffb066" />
          <stop offset="1" stopColor="#c8611f" />
        </radialGradient>
        <filter id="dr-shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="22" stdDeviation="22" floodColor="#000" floodOpacity="0.55" />
        </filter>
      </defs>

      {/* smoke drawn toward the collar */}
      <g className="ark-smoke" fill="none" stroke="rgba(174,185,203,0.4)" strokeWidth="3" strokeLinecap="round">
        <path className="ark-smoke-1" d="M120 150 C 128 120, 150 118, 156 96" />
        <path className="ark-smoke-2" d="M126 156 C 138 132, 158 128, 168 104" />
      </g>

      {/* soldering iron: handle -> barrel -> tip (lower-left to mid) */}
      <g filter="url(#dr-shadow)">
        {/* handle */}
        <rect x="18" y="214" width="118" height="30" rx="15" transform="rotate(-24 77 229)" fill="url(#dr-iron)" stroke="rgba(126,156,196,0.22)" />
        {/* barrel */}
        <rect x="104" y="176" width="66" height="14" rx="7" transform="rotate(-24 137 183)" fill="#20262f" stroke="rgba(126,156,196,0.25)" />
      </g>
      {/* tip */}
      <path d="M150 150 L140 168 L128 156 Z" transform="rotate(-24 139 158)" fill="url(#dr-tip)" />
      <circle cx="132" cy="152" r="8" fill="url(#dr-tip)" opacity="0.5" />

      {/* extraction collar around the barrel near the tip */}
      <g transform="rotate(-24 150 150)">
        <ellipse cx="150" cy="150" rx="12" ry="20" fill="none" stroke="var(--ark-signal)" strokeOpacity="0.8" strokeWidth="4" />
        <ellipse cx="150" cy="150" rx="12" ry="20" fill="rgba(168,203,232,0.06)" />
      </g>

      {/* flexible hose collar -> fan */}
      <path
        d="M168 138 C 230 96, 300 96, 336 120"
        fill="none"
        stroke="#161b24"
        strokeWidth="20"
        strokeLinecap="round"
      />
      <path
        d="M168 138 C 230 96, 300 96, 336 120"
        fill="none"
        stroke="rgba(126,156,196,0.22)"
        strokeWidth="20"
        strokeLinecap="round"
        strokeDasharray="2 12"
      />

      {/* inline fan + filter cylinder (right) */}
      <g filter="url(#dr-shadow)">
        <rect x="322" y="96" width="96" height="96" rx="16" fill="url(#dr-fan)" stroke="rgba(126,156,196,0.24)" />
      </g>
      {/* fan grille ring */}
      <circle cx="370" cy="144" r="34" fill="#05070c" stroke="rgba(126,156,196,0.3)" />
      {/* spinning blades */}
      <g className="ark-fan">
        {Array.from({ length: 6 }).map((_, i) => (
          <path
            key={i}
            d="M370 144 Q 386 116 400 126 Q 385 141 370 144 Z"
            fill="rgba(168,203,232,0.5)"
            transform={`rotate(${i * 60} 370 144)`}
          />
        ))}
      </g>
      <circle cx="370" cy="144" r="7" fill="#0a0d14" stroke="rgba(126,156,196,0.5)" />
      {/* speed dial */}
      <circle cx="404" cy="176" r="7" fill="#0a0d14" stroke="var(--ark-signal)" strokeOpacity="0.6" />
      <line x1="404" y1="176" x2="404" y2="171" stroke="var(--ark-signal)" strokeWidth="1.6" strokeLinecap="round" />

      {/* labels */}
      <text x="370" y="210" textAnchor="middle" fontFamily="var(--ark-display)" fontWeight="600" fontSize="13" fill="rgba(238,242,248,0.9)">Draft</text>
      <text x="150" y="248" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="8" letterSpacing="2" fill="rgba(168,203,232,0.7)">AX-DR1 · CAPTURE AT THE TIP</text>
    </svg>
  );
}

export function DeviceMockup({
  kind,
  className = "",
}: {
  kind: "blackbox" | "draft";
  className?: string;
}) {
  return kind === "blackbox" ? (
    <BlackBoxMockup className={className} />
  ) : (
    <DraftMockup className={className} />
  );
}
