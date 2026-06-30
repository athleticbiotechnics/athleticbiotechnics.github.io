import { DISCORD_INVITE_URL } from "@/config/env";

export { DISCORD_INVITE_URL };

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
