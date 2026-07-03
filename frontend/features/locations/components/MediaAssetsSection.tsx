import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";

import { ICON_COLORS } from "../constants";
import { SectionCard } from "./SectionCard";

interface Props {
  photos: string[];
  onAddPhoto: () => void;
  onRemovePhoto: (index: number) => void;
}

const THUMB_SIZE = 80;

export function MediaAssetsSection({ photos, onAddPhoto, onRemovePhoto }: Props) {
  return (
    <SectionCard
      icon={<Feather name="image" size={16} color={ICON_COLORS.primary} />}
      title="Media Assets"
      subtitle={`${photos.length} photo${photos.length === 1 ? "" : "s"} added`}
      className="mb-2"
    >
      <TouchableOpacity
        onPress={onAddPhoto}
        activeOpacity={0.8}
        className="flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 py-7"
      >
        <View className="h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Feather name="upload-cloud" size={22} color={ICON_COLORS.primary} />
        </View>
        <Text className="mt-3 text-sm font-semibold text-primary">Tap to upload location photos</Text>
        <Text className="mt-1 text-xs text-muted-foreground">Storefront, interior, or branding files</Text>
      </TouchableOpacity>

      {photos.length > 0 && (
        // Explicit height + top/right padding are the fix: without them the
        // ScrollView clips both the image and the remove badge that pokes
        // above it. Literal width/height on the Image guarantee it renders
        // at full size regardless of NativeWind class resolution timing.
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ height: THUMB_SIZE + 24 }}
          contentContainerStyle={{ gap: 12, paddingTop: 10, paddingRight: 10, paddingLeft: 2 }}
        >
          {photos.map((uri, index) => (
            <View key={`${uri}-${index}`} style={{ width: THUMB_SIZE, height: THUMB_SIZE }} className="relative">
              <Image
                source={{ uri }}
                style={{ width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: 16 }}
                className="border border-border/30"
                contentFit="cover"
              />
              <TouchableOpacity
                onPress={() => onRemovePhoto(index)}
                className="absolute -right-2 -top-2 h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-sm bg-destructive"
              >
                <Feather name="x" size={14} color={ICON_COLORS.white} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </SectionCard>
  );
}