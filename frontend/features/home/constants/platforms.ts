import { PlatformKey } from "../types";
import { ICONS } from "@/constants/icon";

export const PLATFORM_CONFIG: Record<
  PlatformKey,
  { label: string; shortLabel: string; color: string; textClass: string; background: string; icon: any }
> = {
  google: { label: "Google Business Profile", shortLabel: "Google", color: "#34A853", textClass: "text-white", background: "#34A853", icon: ICONS.GoogleLogo },
  facebook: { label: "Meta / Facebook Pages", shortLabel: "Facebook", color: "#1877F2", textClass: "text-white", background: "#1877F2", icon: ICONS.FacebookLogo },
  bing: { label: "Bing Places for Business", shortLabel: "Bing", color: "#008373", textClass: "text-white", background: " #008373", icon: ICONS.BingLogo },
  yelp: { label: "Yelp for Business", shortLabel: "Yelp", color: "#d32323", textClass: "text-[#d32323]", background: "#E8F2FA", icon: ICONS.YouTubeLogo },
  appleMaps: { label: "Apple Maps Connect", shortLabel: "Apple Maps", color: "#000000", textClass: "text-foreground", background: "#E8F2FA", icon: ICONS.YouTubeLogo },
};
export const ACTIVE_PLATFORMS: PlatformKey[] = ["google", "facebook", "bing"];