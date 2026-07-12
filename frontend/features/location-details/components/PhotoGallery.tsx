import { Dimensions, FlatList, Image, Text, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const THUMB_SIZE = SCREEN_WIDTH * 0.42;

interface PhotoGalleryProps {
  photos: string[];
}

/**
 * Horizontal scrollable gallery of all location photos.
 * Renders nothing when there are no photos.
 */
export function PhotoGallery({ photos }: PhotoGalleryProps) {
  if (!photos || photos.length === 0) return null;

  return (
    <View className="mb-4">
      <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
        Photos ({photos.length})
      </Text>
      <FlatList
        data={photos}
        keyExtractor={(_, i) => String(i)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item, index }) => (
          <Image
            source={{ uri: item }}
            style={{
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: 16,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
            resizeMode="cover"
            accessible
            accessibilityLabel={`Location photo ${index + 1}`}
          />
        )}
      />
    </View>
  );
}
