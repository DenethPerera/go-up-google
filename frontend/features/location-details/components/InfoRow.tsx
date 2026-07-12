import { Text, View } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface InfoRowProps {
  label: string;
  value?: string | null;
  Icon?: LucideIcon;
  iconColor?: string;
  mono?: boolean;
}

/**
 * Reusable label + value row used throughout the LocationDetailScreen.
 * Renders nothing if `value` is empty/null — avoids blank rows.
 */
export function InfoRow({ label, value, Icon, iconColor = "#C8D1E8", mono = false }: InfoRowProps) {
  if (!value) return null;

  return (
    <View className="flex-row items-start gap-3 py-3 border-b border-white/10">
      {Icon && (
        <View className="mt-0.5 h-7 w-7 items-center justify-center rounded-xl bg-white/10">
          <Icon size={14} color={iconColor} />
        </View>
      )}
      <View className="flex-1">
        <Text className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/40">
          {label}
        </Text>
        <Text
          className={`text-sm text-white ${mono ? "font-mono" : "font-medium"}`}
          selectable
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
