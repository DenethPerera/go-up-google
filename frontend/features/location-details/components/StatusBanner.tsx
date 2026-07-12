import { Text, View } from "react-native";
import { CheckCircle2, Clock, XCircle } from "lucide-react-native";

type ApprovalStatus = "approved" | "pending" | "rejected";

interface StatusBannerProps {
  status: ApprovalStatus;
}

const STATUS_CONFIG: Record<
  ApprovalStatus,
  { label: string; description: string; icon: any; iconColor: string; bg: string; border: string }
> = {
  approved: {
    label: "Approved",
    description: "This location has been verified and approved.",
    icon: CheckCircle2,
    iconColor: "#2ac181",
    bg: "bg-[#2ac181]/10",
    border: "border-[#2ac181]/30",
  },
  pending: {
    label: "Pending Review",
    description: "This location is awaiting verification. You'll be notified once reviewed.",
    icon: Clock,
    iconColor: "#f59e0b",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  rejected: {
    label: "Rejected",
    description: "This location did not pass verification. Please review and resubmit.",
    icon: XCircle,
    iconColor: "#ef4444",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
};

/**
 * Full-width status banner displayed at the top of the detail screen.
 * Shows a contextual icon, label, and helper description for each status.
 */
export function StatusBanner({ status }: StatusBannerProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const StatusIcon = config.icon;

  return (
    <View
      className={`mb-5 flex-row items-start gap-3 rounded-2xl border px-4 py-3 ${config.bg} ${config.border}`}
    >
      <StatusIcon size={20} color={config.iconColor} style={{ marginTop: 1 }} />
      <View className="flex-1">
        <Text className="text-sm font-bold text-white">{config.label}</Text>
        <Text className="mt-0.5 text-xs text-white/60">{config.description}</Text>
      </View>
    </View>
  );
}
