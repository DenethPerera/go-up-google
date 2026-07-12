import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Globe,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Tag,
  FileText,
} from "lucide-react-native";

import { useLocationDetail } from "../hooks/useLocationDetail";
import { DetailHeader } from "../components/DetailHeader";
import { StatusBanner } from "../components/StatusBanner";
import { InfoRow } from "../components/InfoRow";
import { WorkingHoursCard } from "../components/WorkingHoursCard";
import { SocialLinksCard } from "../components/SocialLinksCard";
import { PhotoGallery } from "../components/PhotoGallery";

interface LocationDetailScreenProps {
  /** MongoDB _id of the location to display */
  id: string;
}

/**
 * Full detail view for a single business location.
 *
 * Displays every field stored in LocationDocument:
 *  - Hero cover image + name overlay  (DetailHeader)
 *  - Approval status banner            (StatusBanner)
 *  - Business info rows               (InfoRow × 6)
 *  - Weekly working hours              (WorkingHoursCard)
 *  - Social media links                (SocialLinksCard)
 *  - Photo gallery                     (PhotoGallery)
 *  - Platform sync placeholder         (coming-soon pill)
 */
export default function LocationDetailScreen({ id }: LocationDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const { location, isLoading, isRefreshing, error, refresh } = useLocationDetail(id);

  // ─── Loading state ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <LinearGradient
        colors={["#4F6BCC", "#24315A", "#1A2441"]}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="mt-4 text-sm font-medium text-white/70">
          Loading location details…
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#4F6BCC", "#24315A", "#1A2441"]}
      locations={[0, 0.45, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ paddingTop: insets.top + 16 }}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-transparent"
        contentContainerClassName="px-4 pb-12 pt-2"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor="#ffffff"
          />
        }
      >
        {/* ── Error banner ──────────────────────────────────────────────── */}
        {error && (
          <View className="mb-4 rounded-2xl bg-red-500/10 border border-red-500/25 px-4 py-3">
            <Text className="text-sm font-medium text-red-400">{error}</Text>
          </View>
        )}

        {location && (
          <>
            {/* ── Hero header ──────────────────────────────────────────── */}
            <DetailHeader
              name={location.name}
              address={location.address}
              coverImage={location.photos?.[0]}
            />

            {/* ── Status banner ─────────────────────────────────────────── */}
            <StatusBanner status={location.status} />

            {/* ── Business Information card ─────────────────────────────── */}
            <View className="mb-4 rounded-2xl bg-white/8 px-4 py-2">
              <Text className="py-2 text-xs font-semibold uppercase tracking-widest text-white/40">
                Business Information
              </Text>

              <InfoRow
                label="Full Address"
                value={location.address}
                Icon={MapPin}
              />
              <InfoRow
                label="Phone"
                value={location.contact}
                Icon={Phone}
              />
              <InfoRow
                label="Website"
                value={location.website}
                Icon={Globe}
                mono
              />
              <InfoRow
                label="Email"
                value={location.email}
                Icon={Mail}
                mono
              />
              <InfoRow
                label="Category"
                value={location.category}
                Icon={Tag}
              />
              <InfoRow
                label="Description"
                value={location.description}
                Icon={FileText}
              />
            </View>

            {/* ── Working Hours ──────────────────────────────────────────── */}
            {location.workingHours &&
              Object.keys(location.workingHours).length > 0 && (
                <WorkingHoursCard workingHours={location.workingHours} />
              )}

            {/* ── Photo Gallery ──────────────────────────────────────────── */}
            <PhotoGallery photos={location.photos} />

            {/* ── Social Media ──────────────────────────────────────────── */}
            {location.social && <SocialLinksCard social={location.social} />}

            {/* ── Platform Sync Placeholder ──────────────────────────────── */}
            <View className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <View className="flex-row items-center gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <RefreshCw size={16} color="#C8D1E8" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-white">
                    Platform Sync
                  </Text>
                  <Text className="mt-0.5 text-xs text-white/50">
                    Sync options coming soon — Google, Facebook & Bing
                  </Text>
                </View>
                <View className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                  <Text className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                    Soon
                  </Text>
                </View>
              </View>
            </View>

            {/* ── Metadata footer ──────────────────────────────────────────── */}
            <View className="mt-2 items-center">
              <Text className="text-xs text-white/25">
                Added{" "}
                {new Date(location.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}
