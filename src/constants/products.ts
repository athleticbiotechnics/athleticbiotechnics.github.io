export type ProductId = "glacier" | "phase-change";

export type ProductSpec = {
  id: ProductId;
  division: "cooling";
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
    tagline: "A tower cooler shaped by ice-cave airflow.",
    summary:
      "Glacier is our flagship air cooler: a dual-tower heatsink with a frosted shroud, a quieter fan curve, and a wide contact plate for rigs that run hot for hours at a time.",
    features: [
      "Fin stack modeled on ice-cave airflow for a tighter, more directed draft",
      "Dual towers with faceted top plates and exposed heat pipes",
      "Tuned fan curve that stays quiet under sustained gaming or creative loads",
      "Frosted finish that matches the rest of the Arktos lineup",
      "Still in prototype — expect small changes before launch",
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
    tagline: "Pulls heat off the chip without the limits of air.",
    summary:
      "Our phase-change chambers use two-phase immersion to draw heat straight off the silicon. The dielectric fluid is recovered, filtered, and put back into the loop, so nothing evaporates and nothing gets thrown away.",
    features: [
      "Two-phase immersion built for dense compute and serious enthusiast rigs",
      "Tri-layer hermetic manifolds so dielectric fluid never touches the PCB",
      "Flow paths validated with CFD, cold plates modeled in CAD",
      "Closed-loop fluid recovery — nothing lost, nothing discharged",
      "Now running pilot deployments with studios and performance labs",
    ],
    specs: [
      { label: "Platform", value: "Phase-change chamber" },
      { label: "Status", value: "Pilot partner program" },
      { label: "Fluid cycle", value: "Closed-loop recovery" },
      { label: "Target", value: "PC & compact compute" },
      { label: "Validation", value: "CFD + prototype testing" },
    ],
  },
};

export const COOLING_PRODUCT_IDS: ProductId[] = ["glacier", "phase-change"];
