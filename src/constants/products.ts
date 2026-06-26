export type ProductId = "glacier" | "phase-change" | "kryos-pulse";

export type ProductSpec = {
  id: ProductId;
  division: "cooling" | "kryos";
  name: string;
  tagline: string;
  summary: string;
  features: string[];
  specs: { label: string; value: string }[];
  showHeatsink?: boolean;
};

export const PRODUCTS: Record<ProductId, ProductSpec> = {
  glacier: {
    id: "glacier",
    division: "cooling",
    name: "Glacier Air Cooler",
    tagline: "High-pressure tower airflow carved from ice-cave geometry.",
    summary:
      "Glacier is Arktos Cooling's flagship air platform: a dual-tower heatsink with frosted shroud language, calm acoustics, and a broad contact plate built for everyday performance rigs and sustained thermal loads.",
    features: [
      "Ice-cave inspired fin stack for dense, directed airflow",
      "Dual-tower layout with faceted top plates and exposed heat pipes",
      "Calmer fan curve tuned for sustained gaming and creator workloads",
      "Frosted exterior treatment drawn from the Arktos mountain visual system",
      "Prototype-stage hardware — specs may evolve before launch",
    ],
    specs: [
      { label: "Platform", value: "Tower air cooler" },
      { label: "Status", value: "Prototype in progress" },
      { label: "Acoustics", value: "Calm curve target" },
      { label: "Compatibility", value: "Modern desktop sockets (TBD)" },
      { label: "Finish", value: "Frosted white concept" },
    ],
    showHeatsink: true,
  },
  "phase-change": {
    id: "phase-change",
    division: "cooling",
    name: "Phase-Change Chamber",
    tagline: "Chip-level heat capture without legacy air limits.",
    summary:
      "Arktos phase-change chambers use two-phase immersion principles to pull heat directly off silicon. Dielectric fluid is recovered, filtered, and recirculated — a circular thermal cycle with zero evaporative loss.",
    features: [
      "Two-phase immersion for high-density compute and enthusiast builds",
      "Tri-layer hermetic manifolds keep dielectric fluid off PCB surfaces",
      "CFD-validated flow paths and CAD-modeled cold plates",
      "100% fluid recovery, filtration, and recirculation",
      "Pilot deployments for studios and performance labs",
    ],
    specs: [
      { label: "Platform", value: "Phase-change chamber" },
      { label: "Status", value: "Pilot partner program" },
      { label: "Fluid cycle", value: "Closed-loop recovery" },
      { label: "Target", value: "PC & compact compute" },
      { label: "Validation", value: "CFD + prototype testing" },
    ],
  },
  "kryos-pulse": {
    id: "kryos-pulse",
    division: "kryos",
    name: "Kryos Pulse",
    tagline: "Portable athlete metronome for honest cadence.",
    summary:
      "Kryos Pulse is a wearable rhythm tool that keeps tempo locked during sprints, lifts, and recovery — tactile cues without pulling out a phone mid-set. Built for training floors, tracks, and travel.",
    features: [
      "Wearable pacing hardware with tactile tempo cues",
      "Performance-first controls for coaches and athletes",
      "Travel-ready enclosure sized for gym bags",
      "Session profiles for sprint, lift, and recovery blocks",
      "Preorder list opening shortly",
    ],
    specs: [
      { label: "Platform", value: "Wearable metronome" },
      { label: "Status", value: "Preorder opening shortly" },
      { label: "Use cases", value: "Track, gym, travel" },
      { label: "Feedback", value: "Tactile tempo cues" },
      { label: "Division", value: "Kryos Motion" },
    ],
  },
};

export const COOLING_PRODUCT_IDS: ProductId[] = ["glacier", "phase-change"];
export const KRYOS_PRODUCT_IDS: ProductId[] = ["kryos-pulse"];
