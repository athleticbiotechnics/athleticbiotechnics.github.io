import type { ComponentProps } from "react";
import type { PhotoBackdrop } from "@/components/PhotoBackdrop";
import glacierCave from "@/imports/glacier-cave.jpg";
import glacierField from "@/imports/glacier-field.jpg";
import mcdonaldLakeBackground from "@/imports/mcdonald-lake-background.jpg";
import alpineBackground from "@/imports/alpine-background.avif";
import glacierPrototype from "@/imports/glacier-prototype.jpg";
import arcticIceBackground from "@/imports/arctic-ice-real.jpg";
import legalIceBackground from "@/imports/legal-ice-background.webp";
import careersBackground from "@/imports/careers-background.jpg";
import productSpecBackground from "@/imports/product-spec-background.jpg";
import kryosMotionBackground from "@/imports/kryos-motion-background.jpg";
import glacierBeachBackground from "@/imports/glacier-beach-background.png";

export type BackdropPreset = ComponentProps<typeof PhotoBackdrop>;

/** Full-resolution sources with tuned crop — avoids upscaling low-res PNGs on full pages. */
export const PAGE_BACKDROPS = {
  hero: null,
  divisions: {
    image: mcdonaldLakeBackground,
    position: "center 42%",
    opacity: 0.92,
    brightness: 0.96,
    overlay: "light",
    scale: 1.02,
  },
  mission: {
    image: alpineBackground,
    position: "center center",
    opacity: 0.92,
    brightness: 0.96,
    overlay: "light",
    scale: 1.02,
  },
  platform: {
    image: mcdonaldLakeBackground,
    position: "center 38%",
    opacity: 0.9,
    brightness: 0.96,
    overlay: "medium",
    scale: 1.02,
  },
  glacierLine: {
    image: glacierPrototype,
    position: "center 32%",
    opacity: 0.88,
    brightness: 0.97,
    overlay: "medium",
    scale: 1.04,
  },
  team: {
    image: alpineBackground,
    position: "center 36%",
    opacity: 0.9,
    brightness: 0.97,
    overlay: "light",
    scale: 1.02,
  },
  cta: {
    image: mcdonaldLakeBackground,
    position: "center 40%",
    opacity: 0.9,
    brightness: 0.96,
    overlay: "medium",
    scale: 1.02,
  },
  cooling: {
    image: glacierField,
    position: "center 48%",
    opacity: 0.82,
    brightness: 0.98,
    overlay: "light",
    scale: 1.05,
  },
  kryos: {
    image: kryosMotionBackground,
    position: "center center",
    opacity: 0.9,
    brightness: 0.98,
    overlay: "light",
    scale: 1.08,
  },
  preorder: {
    image: glacierCave,
    position: "center 45%",
    opacity: 0.78,
    brightness: 1,
    overlay: "minimal",
    scale: 1.06,
  },
  contact: {
    image: glacierField,
    position: "center 52%",
    opacity: 0.88,
    brightness: 0.99,
    overlay: "minimal",
    scale: 1.06,
  },
  careers: {
    image: careersBackground,
    position: "center 44%",
    opacity: 0.92,
    brightness: 0.98,
    overlay: "light",
    scale: 1.03,
  },
  docs: {
    image: productSpecBackground,
    position: "center 40%",
    opacity: 0.92,
    brightness: 0.98,
    overlay: "light",
    scale: 1.03,
  },
  privacy: {
    image: legalIceBackground,
    position: "center 38%",
    opacity: 0.9,
    brightness: 0.99,
    overlay: "minimal",
    scale: 1.05,
  },
  terms: {
    image: arcticIceBackground,
    position: "center 40%",
    opacity: 0.9,
    brightness: 0.99,
    overlay: "minimal",
    scale: 1.05,
  },
  accessibility: {
    image: legalIceBackground,
    position: "center 38%",
    opacity: 0.9,
    brightness: 0.99,
    overlay: "minimal",
    scale: 1.05,
  },
  product: {
    image: glacierBeachBackground,
    position: "center 55%",
    opacity: 0.84,
    brightness: 1,
    overlay: "light",
    scale: 1.12,
  },
} as const satisfies Record<string, BackdropPreset | null>;
