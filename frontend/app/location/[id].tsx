import { useLocalSearchParams } from "expo-router";
import LocationDetailScreen from "@/features/location-details/screen/LocationDetailScreen";

/**
 * Dynamic Expo Router route: /location/[id]
 *
 * Extracts the `id` param from the URL and delegates rendering
 * entirely to LocationDetailScreen, keeping routing logic out of
 * the feature's screen component (clean architecture).
 */
export default function LocationDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LocationDetailScreen id={id} />;
}
