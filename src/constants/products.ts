export type ProductId = "blackbox" | "draft";

export type ProductSpec = {
  id: ProductId;
  code: string;
  division: "instruments";
  name: string;
  kind: string;
  tagline: string;
  summary: string;
  features: string[];
  specs: { label: string; value: string }[];
  status: string;
  mockup: "blackbox" | "draft";
  reserveLabel: string;
};

export const PRODUCTS: Record<ProductId, ProductSpec> = {
  blackbox: {
    id: "blackbox",
    code: "AX-BB1",
    division: "instruments",
    name: "BlackBox",
    kind: "Hardware flight recorder",
    tagline: "Rewind the moment your board died.",
    summary:
      "BlackBox is a small module that plugs into almost any embedded system — a breadboard, a Raspberry Pi, or a custom PCB — and continuously records the signals engineers check first when something fails. Instead of trying to reproduce a crash, you rewind the timeline and watch it happen.",
    features: [
      "Records power-rail voltage on up to 2 rails, with brownout and startup-dip detection",
      "Continuous board current from an INA228 high-side sensor — spikes and abnormal modes flagged",
      "Full UART capture: boot logs and firmware debug output, every line timestamped",
      "Reset-line watch that catches watchdog, brownout, and manual resets the moment they happen",
      "4 named GPIO inputs plus one configurable analog channel",
      "One color-coded harness for breadboards, Pi headers, and PCB test points; one USB-C cable to the desktop app",
    ],
    specs: [
      { label: "Processor", value: "STM32H743ZI2" },
      { label: "Current sensor", value: "TI INA228, high-side" },
      { label: "Storage", value: "microSD, circular buffer" },
      { label: "Link", value: "USB-C to USB-C, power + data" },
      { label: "Targets", value: "Breadboard / Raspberry Pi / custom PCB" },
      { label: "Status", value: "V1 prototype" },
    ],
    status: "V1 prototype",
    mockup: "blackbox",
    reserveLabel: "Reserve a BlackBox",
  },
  draft: {
    id: "draft",
    code: "AX-DR1",
    division: "instruments",
    name: "Draft",
    kind: "Solder fume extractor",
    tagline: "Solder without the smoke.",
    summary:
      "Draft is a light collar that slips over the barrel of your soldering iron and draws fumes away right at the tip. A flexible hose carries the smoke back to an inline brushless fan and an activated-carbon filter — so the plume is caught where it starts, before it ever reaches your face.",
    features: [
      "Capture at the source: the collar sits millimetres from the tip, not across the bench",
      "Fits standard iron barrels with an adjustable, heat-resistant silicone gland",
      "Quiet inline brushless fan with a variable-speed dial",
      "Replaceable activated-carbon filter cartridge for rosin and flux fumes",
      "Bench-clamp mount and a flexible hose that stays where you bend it",
      "Runs off the same USB-C supply as the rest of the bench",
    ],
    specs: [
      { label: "Capture", value: "At the tip, collar-mounted" },
      { label: "Airflow", value: "Variable-speed brushless" },
      { label: "Filter", value: "Activated-carbon cartridge" },
      { label: "Fit", value: "Adjustable silicone gland" },
      { label: "Power", value: "USB-C, 5V" },
      { label: "Status", value: "In development" },
    ],
    status: "In development",
    mockup: "draft",
    reserveLabel: "Reserve a Draft",
  },
};

export const PRODUCT_IDS: ProductId[] = ["blackbox", "draft"];
