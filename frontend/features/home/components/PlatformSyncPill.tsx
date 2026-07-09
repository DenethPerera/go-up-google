import { ActivityIndicator, Pressable } from "react-native";
import { CheckCircle2, RefreshCw, XCircle } from "lucide-react-native";
import { PlatformSyncStatus } from "../types";
import { PLATFORM_CONFIG } from "../constants/platforms";

export default function PlatformSyncPill({ status, onSync }: { status: PlatformSyncStatus; onSync: () => void }) {
  const config = PLATFORM_CONFIG[status.platform];
  const isSyncing = status.state === "syncing";
  const PlatformIcon = config.icon; 

  return (
    <Pressable
      onPress={onSync}
      disabled={isSyncing}
      // Removed the solid backgrounds and added a subtle glassy border (border-white/20)
      className={`flex-row items-center gap-2 rounded-xl border px-3 py-2 ${
        status.state === "failed" 
          ? "border-destructive bg-destructive/10" 
          : "border-white/20 bg-transparent"
      }`}
    >
      {/* Platform Icon */}
      <PlatformIcon width={16} height={16} /> 

      {/* Status Icons */}
      {isSyncing && <ActivityIndicator size="small" color="#ffffff" />}
      
      {/* Changed success checkmark to your vibrant green since there is no background anymore */}
      {status.state === "success" && <CheckCircle2 size={14} color="#2ac181" />}
      
      {status.state === "failed" && <XCircle size={14} color="#ef4444" />}
      {status.state === "idle" && <RefreshCw size={14} color="#ffffff" />}
    </Pressable>
  );
}