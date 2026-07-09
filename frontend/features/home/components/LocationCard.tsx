import { Alert, Image, Pressable, Text, View } from "react-native";
// Added CheckCircle2 and Clock for the status icons
import { MapPin, MoreVertical, Pencil, RefreshCw, Trash2, CheckCircle2, Clock } from "lucide-react-native";
import { useState } from "react";
import { BusinessLocation } from "../types";
import PlatformSyncPill from "./PlatformSyncPill";
import { useLocationSync } from "../hooks/useLocationSync";
import { deleteLocation } from "../services/homeService";

interface Props {
  location: BusinessLocation;
  onUpdate: (updated: BusinessLocation) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function LocationCard({ location, onUpdate, onDelete, onEdit }: Props) {
  const { syncOne, syncAll, syncingAll } = useLocationSync(location, onUpdate);
  const [menuOpen, setMenuOpen] = useState(false);
  const failedPlatforms = location.platforms.filter((p) => p.state === "failed");

  const handleDelete = () => {
    Alert.alert("Delete location", `Remove "${location.name}" from your directory?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          onDelete(location.id);
          await deleteLocation(location.id);
        },
      },
    ]);
  };

  return (
    <View className="mb-6 rounded-3xl bg-card p-4 shadow-xl">
      <View className="flex-row items-start gap-3">
        <Image source={{ uri: location.coverImage }} className="h-14 w-14 rounded-2xl bg-muted" />
        <View className="flex-1">
          <View className="flex-row items-start justify-between">
            <Text className="h4 text-foreground pr-2" numberOfLines={1}>{location.name}</Text>
            <Pressable onPress={() => setMenuOpen((v) => !v)} hitSlop={8}>
              <MoreVertical size={18} color="#ffffff" />
            </Pressable>
          </View>
          <View className="mt-1 flex-row items-center gap-1">
            <MapPin size={14} color="#C8D1E8" />
            <Text className="text-xs text-muted-foreground" numberOfLines={1}>
              {location.address}, {location.city}
            </Text>
          </View>
          {/* StatusBadge was removed from here */}
        </View>
      </View>

      {menuOpen && (
        <View className="mt-3 flex-row gap-2 border-t border-border pt-3">
          <Pressable onPress={() => onEdit(location.id)} className="flex-row items-center gap-1.5 rounded-xl bg-muted px-3 py-2">
            <Pencil size={14} color="#0a4174" />
            <Text className="text-xs font-semibold text-primary">Edit</Text>
          </Pressable>
          <Pressable onPress={handleDelete} className="flex-row items-center gap-1.5 rounded-xl bg-destructive/10 px-3 py-2">
            <Trash2 size={14} color="#ef4444" />
            <Text className="text-xs font-semibold text-destructive">Delete</Text>
          </Pressable>
        </View>
      )}

      {/* Added "relative" and "pb-2" to this container to give the absolute icon room to breathe */}
      <View className="mt-3 border-t border-border pt-3 relative pb-2">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-md font-semibold text-muted-foreground">Platform sync</Text>
          <Pressable onPress={syncAll} disabled={syncingAll} className="flex-row items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1">
            <RefreshCw size={15} color="#ffffff" />
            <Text className="text-sm font-semibold text-white">{syncingAll ? "Syncing..." : "Sync all"}</Text>
          </Pressable>
        </View>

        {/* Added pr-10 so the pills don't overlap with the bottom-right icon if there are many platforms */}
        <View className="flex-row flex-wrap gap-2 pr-10">
          {location.platforms.map((p) => (
            <PlatformSyncPill key={p.platform} status={p} onSync={() => syncOne(p.platform)} />
          ))}
        </View>

        {failedPlatforms.length > 0 && (
          <View className="mt-2 rounded-xl bg-destructive/5 px-3 py-2 pr-10">
            {failedPlatforms.map((p) => (
              <Text key={p.platform} className="text-xs text-destructive">
                {p.platform}: {p.errorMessage ?? "Sync failed"}
              </Text>
            ))}
          </View>
        )}

        {/* STATUS ICON: Absolutely positioned in the bottom right corner */}
        <View className="absolute bottom-0 right-0">
          {location.approvalStatus === "approved" ? (
            <CheckCircle2 size={26} color="#2ac181" />
          ) : location.approvalStatus === "pending" ? (
            <Clock size={26} color="#f59e0b" />
          ) : null}
        </View>
      </View>
    </View>
  );
}