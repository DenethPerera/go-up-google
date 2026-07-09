export const PHONE_REGEX = /^\+?[0-9\s\-()]{7,15}$/;
export const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

// Vector icon components (Feather, FontAwesome5) accept a literal `color`
// prop — they can't read Tailwind classes or CSS variables. Rather than
// hardcoding hex in every component, we mirror the relevant tokens from
// globals.css once, here, and never reference a raw hex value anywhere else.
export const ICON_COLORS = {
  primary: "#ffffff",
  white: "#ffffff",
  destructive: "#ef4444",
  facebook: "#1877F2",
  instagram: "#E4405F",
  tiktok: "#000000",
  whatsapp: "#25D366",
} as const;