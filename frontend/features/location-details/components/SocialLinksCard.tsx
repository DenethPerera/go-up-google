import { Linking, Pressable, Text, View } from "react-native";
import { AtSign, MessageCircle, Music } from "lucide-react-native";
import { ICONS } from "@/constants/icon";
import { SocialMediaState } from "@/features/locations/types";

interface SocialLinksCardProps {
  social: SocialMediaState;
}

const FacebookLogo = ICONS.FacebookLogo;

interface SocialLink {
  key: keyof SocialMediaState;
  label: string;
  color: string;
  buildUrl: (value: string) => string;
  renderIcon: () => React.ReactElement;
}

const SOCIAL_CONFIG: SocialLink[] = [
  {
    key: "facebook",
    label: "Facebook",
    color: "#1877F2",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://facebook.com/${v}`),
    renderIcon: () => <FacebookLogo width={16} height={16} />,
  },
  {
    key: "instagram",
    label: "Instagram",
    color: "#E4405F",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://instagram.com/${v}`),
    renderIcon: () => <AtSign size={16} color="#E4405F" />,
  },
  {
    key: "tiktok",
    label: "TikTok",
    color: "#ffffff",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://tiktok.com/@${v}`),
    renderIcon: () => <Music size={16} color="#ffffff" />,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    color: "#25D366",
    buildUrl: (v) => `https://wa.me/${v.replace(/\D/g, "")}`,
    renderIcon: () => <MessageCircle size={16} color="#25D366" />,
  },
];

/**
 * Renders tappable social media pills for each platform that has a value.
 * Tapping opens the URL in the device's default browser/app via Linking.
 */
export function SocialLinksCard({ social }: SocialLinksCardProps) {
  const activeLinks = SOCIAL_CONFIG.filter((s) => !!social[s.key]);

  if (activeLinks.length === 0) return null;

  return (
    <View className="mb-4 rounded-2xl bg-white/8 p-4">
      <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
        Social Media
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {activeLinks.map((s) => {
          const url = s.buildUrl(social[s.key] as string);
          return (
            <Pressable
              key={s.key}
              onPress={() => Linking.openURL(url).catch(() => null)}
              className="flex-row items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2"
            >
              {s.renderIcon()}
              <Text className="text-sm font-semibold text-white">{s.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

