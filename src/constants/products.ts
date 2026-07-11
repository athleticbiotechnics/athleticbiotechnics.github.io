export type ProductId = "blackbox";

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
  mockup: "blackbox";
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
      "BlackBox is a small module you clip onto almost any embedded system — a breadboard, a Raspberry Pi, a custom PCB — and leave running. It keeps a rolling record of the signals you check first when something goes wrong. So instead of trying to make a crash happen again, you just scrub back through the timeline and watch it play out.",
    features: [
      "Watches power-rail voltage on up to two rails and flags brownouts and startup dips",
      "Tracks board current the whole time, and marks the spikes and odd draws when they happen",
      "Captures every line of UART — boot logs, debug prints — each one timestamped",
      "Catches resets as they land, whether it's the watchdog, a brownout, or your finger on the button",
      "Four GPIO inputs you can name, plus one analog channel for whatever else you're watching",
      "One color-coded harness for breadboards, Pi headers, and test points; one USB-C cable to the app",
    ],
    specs: [
      { label: "Processor", value: "32-bit ARM microcontroller" },
      { label: "Current sensor", value: "High-side, precision" },
      { label: "Storage", value: "Onboard, rolling buffer" },
      { label: "Link", value: "USB-C to USB-C, power + data" },
      { label: "Targets", value: "Breadboard / Raspberry Pi / custom PCB" },
      { label: "Status", value: "V1 prototype" },
    ],
    status: "V1 prototype",
    mockup: "blackbox",
    reserveLabel: "Reserve a BlackBox",
  },
};

export const PRODUCT_IDS: ProductId[] = ["blackbox"];
