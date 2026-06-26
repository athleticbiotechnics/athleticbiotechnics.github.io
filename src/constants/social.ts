export const DISCORD_INVITE_URL =
  import.meta.env.VITE_DISCORD_INVITE_URL ?? "https://discord.gg/U9GSFVrhkk";

export const SOCIAL_LINKS = [
  {
    id: "youtube",
    label: "YouTube @ArktosSystems",
    href: "https://www.youtube.com/@ArktosSystems",
  },
  {
    id: "instagram",
    label: "Instagram @Arktos_Systems",
    href: "https://www.instagram.com/Arktos_Systems/",
  },
  {
    id: "discord",
    label: "Join Arktos Discord",
    href: DISCORD_INVITE_URL,
  },
] as const;
