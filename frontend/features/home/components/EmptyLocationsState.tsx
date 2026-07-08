import { Pressable, Text, View } from "react-native";
import { MapPinPlus } from "lucide-react-native";

export default function EmptyLocationsState({ onCreate }: { onCreate: () => void }) {
  return (
    <View className="items-center rounded-3xl border border-dashed border-border bg-muted/40 px-6 py-10">
      <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <MapPinPlus size={26} color="#0a4174" />
      </View>
      <Text className="h4 text-foreground">No locations yet</Text>
      <Text className="mt-1 text-center text-sm text-muted-foreground">
        Add your first business location to start syncing across Google, Facebook and Bing.
      </Text>
      <Pressable onPress={onCreate} className="btn-primary mt-4 px-6 py-3">
        <Text className="font-semibold text-primary-foreground">Add Location</Text>
      </Pressable>
    </View>
  );
}