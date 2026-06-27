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
import kryosContactBackground from "@/imports/kryos-contact-background.png";
import privacyBackground from "@/imports/privacy-background.png";
import accessibilityBackground from "@/imports/accessibility-background.png";
import glacierBeachBackground from "@/imports/glacier-beach-background.png";

export type BackdropPreset = ComponentProps<typeof PhotoBackdrop>;

/** Full-resolution sources — images fit the viewport without cropping or upscaling. */
export const PAGE_BACKDROPS = {
  hero: null,
  divisions: {
    image: mcdonaldLakeBackground,
    position: "center 42%",
    opacity: 0.92,
    brightness: 0.96,
    overlay: "light",
  },
  mission: {
    image: alpineBackground,
    position: "center center",
    opacity: 0.92,
    brightness: 0.96,
    overlay: "light",
  },
  platform: {
    image: mcdonaldLakeBackground,
    position: "center 38%",
    opacity: 0.9,
    brightness: 0.96,
    overlay: "medium",
  },
  glacierLine: {
    image: glacierPrototype,
    position: "center 32%",
    opacity: 0.88,
    brightness: 0.97,
    overlay: "medium",
  },
  team: {
    image: alpineBackground,
    position: "center 36%",
    opacity: 0.9,
    brightness: 0.97,
    overlay: "light",
  },
  cta: {
    image: mcdonaldLakeBackground,
    position: "center 40%",
    opacity: 0.9,
    brightness: 0.96,
    overlay: "medium",
  },
  cooling: {
    image: glacierField,
    position: "center 48%",
    opacity: 0.82,
    brightness: 0.98,
    overlay: "light",
  },
  kryos: {
    image: kryosContactBackground,
    position: "center 42%",
    opacity: 0.88,
    brightness: 1,
    overlay: "minimal",
  },
  preorder: {
    image: glacierCave,
    position: "center 45%",
    opacity: 0.78,
    brightness: 1,
    overlay: "minimal",
  },
  contact: {
    image: kryosContactBackground,
    position: "center 42%",
    opacity: 0.88,
    brightness: 1,
    overlay: "minimal",
  },
  careers: {
    image: careersBackground,
    position: "center 44%",
    opacity: 0.92,
    brightness: 0.98,
    overlay: "light",
  },
  docs: {
    image: productSpecBackground,
    position: "center 40%",
    opacity: 0.92,
    brightness: 0.98,
    overlay: "light",
  },
  privacy: {
    image: privacyBackground,
    position: "center 38%",
    opacity: 0.92,
    brightness: 1,
    overlay: "minimal",
  },
  terms: {
    image: arcticIceBackground,
    position: "center 40%",
    opacity: 0.9,
    brightness: 0.99,
    overlay: "minimal",
  },
  accessibility: {
    image: accessibilityBackground,
    position: "center 40%",
    opacity: 0.92,
    brightness: 1,
    overlay: "minimal",
  },
  product: {
    image: glacierBeachBackground,
    position: "center 55%",
    opacity: 0.84,
    brightness: 1,
    overlay: "light",
  },
} as const satisfies Record<string, BackdropPreset | null>;
