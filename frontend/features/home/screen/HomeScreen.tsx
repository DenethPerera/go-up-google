import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useHomeData } from "../hooks/useHomeData";
import HomeHeader from "../components/HomeHeader";
import SummaryStatsGrid from "../components/SummaryStatsGrid";
import RecentLocationsSection from "../components/RecentLocationsSection";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// 1. Import LinearGradient
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    summary,
    locations,
    isLoading,
    isRefreshing,
    error,
    refresh,
    updateLocation,
    removeLocation,
  } = useHomeData();

  const handleAddLocation = () => {
    console.log("Navigate to: create location form");
  };

  const handleEditLocation = (id: string) => {
    console.log("Navigate to: edit location", id);
  };

  const handleSeeAllLocations = () => {
    router.push("/(tabs)/locations");
  };

  if (isLoading) {
    return (
      <View className="container-centered">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
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
        contentContainerClassName="px-4 pb-8 pt-2"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor="#ffffff"
          />
        }
      >
        <HomeHeader
          businessName="Nimal Perera"
        />

        {error && (
          <View className="mb-4 rounded-2xl bg-destructive/10 px-4 py-3">
            <Text className="text-sm font-medium text-destructive">
              {error}
            </Text>
          </View>
        )}

        {summary && <SummaryStatsGrid summary={summary} />}

        <RecentLocationsSection
          locations={locations}
          onSeeAll={handleSeeAllLocations}
          onAddLocation={handleAddLocation}
          onUpdateLocation={updateLocation}
          onDeleteLocation={removeLocation}
          onEditLocation={handleEditLocation}
        />
      </ScrollView>
    </LinearGradient>
  );
}