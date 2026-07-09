import { Pressable, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { BusinessLocation } from "../types";
import LocationCard from "./LocationCard";
import EmptyLocationsState from "./EmptyLocationsState";

interface Props {
  locations: BusinessLocation[];
  onSeeAll: () => void;
  onAddLocation: () => void;
  onUpdateLocation: (loc: BusinessLocation) => void;
  onDeleteLocation: (id: string) => void;
  onEditLocation: (id: string) => void;
}

export default function RecentLocationsSection({ locations, onSeeAll, onAddLocation, onUpdateLocation, onDeleteLocation, onEditLocation }: Props) {
  return (
    <View className="mt-6">
      <View className="mb-5 flex-row items-center justify-between">
        <Text className="h3 text-foreground">Recent Locations</Text>
        {locations.length > 0 && (
          <Pressable onPress={onSeeAll} className="flex-row items-center gap-0.5">
            <Text className="text-sm font-semibold text-white">See all</Text>
            <ChevronRight size={16} color="#ffffff" />
          </Pressable>
        )}
      </View>

      {locations.length === 0 ? (
        <EmptyLocationsState onCreate={onAddLocation} />
      ) : (
        locations.map((loc) => (
          <LocationCard key={loc.id} location={loc} onUpdate={onUpdateLocation} onDelete={onDeleteLocation} onEdit={onEditLocation} />
        ))
      )}
    </View>
  );
}