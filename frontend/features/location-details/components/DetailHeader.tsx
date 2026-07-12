import { Image, Pressable, Text, View } from "react-native";
import { ArrowLeft, MapPin } from "lucide-react-native";
import { useRouter } from "expo-router";

interface DetailHeaderProps {
  name: string;
  address: string;
  coverImage?: string;
}

/**
 * Full-bleed hero header for the LocationDetailScreen.
 * Shows the cover photo (or a gradient placeholder), a back button,
 * and the location name + address overlaid at the bottom.
 */
export function DetailHeader({ name, address, coverImage }: DetailHeaderProps) {
  const router = useRouter();

  return (
    <View className="relative mb-6 h-52 w-full overflow-hidden rounded-3xl bg-white/10">
      {coverImage ? (
        <Image
          source={{ uri: coverImage }}
          className="absolute inset-0 h-full w-full"
          resizeMode="cover"
        />
      ) : (
        <View className="absolute inset-0 items-center justify-center">
          <MapPin size={40} color="rgba(255,255,255,0.3)" />
        </View>
      )}

      {/* Gradient overlay for text legibility */}
      <View
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(20,30,70,0.45)" }}
      />

      {/* Back button */}
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        className="absolute left-4 top-4 h-10 w-10 items-center justify-center rounded-2xl bg-black/30"
      >
        <ArrowLeft size={20} color="#ffffff" />
      </Pressable>

      {/* Name + address overlay */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-4">
        <Text
          className="text-xl font-bold text-white"
          numberOfLines={1}
        >
          {name}
        </Text>
        {!!address && (
          <View className="mt-1 flex-row items-center gap-1">
            <MapPin size={13} color="rgba(255,255,255,0.75)" />
            <Text className="text-xs text-white/75" numberOfLines={1}>
              {address}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
