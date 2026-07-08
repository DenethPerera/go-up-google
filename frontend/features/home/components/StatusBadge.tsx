import { Text, View } from "react-native";
import { ApprovalStatus } from "../types";
import { APPROVAL_STATUS_CONFIG } from "../constants/status";

export default function StatusBadge({ status }: { status: ApprovalStatus }) {
  const config = APPROVAL_STATUS_CONFIG[status];
  return (
    <View className={`flex-row items-center gap-1.5 rounded-full px-2.5 py-1 ${config.bgClass}`}>
      <View className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
      <Text className={`text-xs font-semibold ${config.textClass}`}>{config.label}</Text>
    </View>
  );
}