function requireEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const DISCORD_INVITE_URL = requireEnv("VITE_DISCORD_INVITE_URL");
export const FORMSPREE_ENDPOINT = requireEnv("VITE_FORMSPREE_ENDPOINT");
export const ARKTOS_EMAIL = requireEnv("VITE_ARKTOS_EMAIL");
