import { Feather } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Google Business Profile categories ────────────────────────────────────────
// Curated list that mirrors the top-level GBP category taxonomy.
export const GBP_CATEGORIES = [
  // Food & Beverage
  "Restaurant",
  "Cafe",
  "Bakery",
  "Bar",
  "Fast Food Restaurant",
  "Pizza Restaurant",
  "Sushi Restaurant",
  "Ice Cream Shop",
  "Coffee Shop",
  "Juice Bar",
  "Food Truck",
  "Catering Service",

  // Retail
  "Clothing Store",
  "Shoe Store",
  "Electronics Store",
  "Furniture Store",
  "Grocery Store",
  "Supermarket",
  "Convenience Store",
  "Bookstore",
  "Jewelry Store",
  "Toy Store",
  "Sports Goods Store",
  "Hardware Store",
  "Gift Shop",
  "Florist",
  "Pet Store",
  "Pharmacy",

  // Health & Wellness
  "Hospital",
  "Clinic",
  "Dentist",
  "Doctor",
  "Optician",
  "Physiotherapist",
  "Chiropractor",
  "Mental Health Service",
  "Veterinarian",
  "Gym",
  "Yoga Studio",
  "Spa",
  "Beauty Salon",
  "Barber Shop",
  "Nail Salon",
  "Massage Therapist",

  // Professional & Business Services
  "Accounting Firm",
  "Law Firm",
  "Real Estate Agency",
  "Insurance Agency",
  "Financial Planning Service",
  "Marketing Agency",
  "Advertising Agency",
  "IT Service",
  "Software Company",
  "Consulting Firm",
  "Recruitment Agency",
  "Printing Service",
  "Courier Service",
  "Co-working Space",
  "Business Centre",

  // Education
  "School",
  "University",
  "College",
  "Preschool",
  "Tutoring Center",
  "Driving School",
  "Dance School",
  "Music School",
  "Art School",
  "Language School",
  "Training Center",

  // Automotive
  "Car Dealer",
  "Used Car Dealer",
  "Auto Parts Store",
  "Car Repair",
  "Car Wash",
  "Tire Shop",
  "Gas Station",
  "Parking Lot",

  // Home & Garden
  "Plumber",
  "Electrician",
  "Painter",
  "Landscaper",
  "Cleaning Service",
  "Moving Company",
  "Interior Designer",
  "Contractor",
  "Roofing Contractor",
  "HVAC Contractor",

  // Hospitality & Travel
  "Hotel",
  "Motel",
  "Hostel",
  "Resort",
  "Bed & Breakfast",
  "Travel Agency",
  "Tour Operator",
  "Airport",

  // Entertainment & Recreation
  "Movie Theater",
  "Night Club",
  "Casino",
  "Amusement Park",
  "Museum",
  "Art Gallery",
  "Zoo",
  "Bowling Alley",
  "Billiards Hall",
  "Escape Room",
  "Go Kart Track",
  "Shooting Range",
  "Arcade",

  // Beauty & Fashion
  "Cosmetics Store",
  "Perfume Store",
  "Tailor",
  "Dry Cleaner",
  "Laundromat",

  // Finance
  "Bank",
  "ATM",
  "Currency Exchange",
  "Credit Union",
  "Pawn Shop",
  "Loan Agency",

  // Religious & Community
  "Church",
  "Mosque",
  "Temple",
  "Synagogue",
  "Community Center",
  "Non-profit Organization",
  "Government Office",
  "Embassy",
  "Post Office",
  "Fire Station",
  "Police Station",

  // Other
  "Event Venue",
  "Wedding Venue",
  "Photography Studio",
  "Tattoo Shop",
  "Locksmith",
  "Storage Facility",
  "Recycling Center",
  "Cemetery",
  "Funeral Home",
] as const;

// ─── Component ──────────────────────────────────────────────────────────────────

interface CategoryPickerProps {
  value: string;
  onChange: (category: string) => void;
  error?: string;
}

export function CategoryPicker({ value, onChange, error }: CategoryPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return GBP_CATEGORIES;
    const q = searchQuery.toLowerCase();
    return GBP_CATEGORIES.filter((c) => c.toLowerCase().includes(q));
  }, [searchQuery]);

  const handleSelect = useCallback(
    (category: string) => {
      onChange(category);
      setModalVisible(false);
      setSearchQuery("");
    },
    [onChange]
  );

  const handleOpen = useCallback(() => {
    setSearchQuery("");
    setModalVisible(true);
  }, []);

  return (
    <View className="mb-4">
      <Text className="input-label">Business Category</Text>

      {/* Trigger button */}
      <TouchableOpacity
        onPress={handleOpen}
        activeOpacity={0.8}
        className={[
          "input-field flex-row items-center justify-between",
          error ? "border-destructive" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Text
          className={
            value
              ? "flex-1 text-sm text-foreground"
              : "flex-1 text-sm text-[#C7D3EA]"
          }
          numberOfLines={1}
        >
          {value || "Select a Google Business category"}
        </Text>
        <Feather name="chevron-down" size={16} color="#C7D3EA" />
      </TouchableOpacity>

      {error ? <Text className="error-text">{error}</Text> : null}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-black/50"
        >
          {/* Stop event propagation so taps inside the sheet don't close it */}
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{ paddingBottom: insets.bottom }}
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-[#1A2441] border border-white/10 overflow-hidden"
          >
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-white/10">
              <Text className="text-base font-bold text-foreground">
                Select Category
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={12}
              >
                <Feather name="x" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View className="px-4 pt-3 pb-2">
              <View className="flex-row items-center rounded-xl border border-white/20 bg-white/5 px-3">
                <Feather name="search" size={15} color="#9ca3af" />
                <TextInput
                  className="ml-2 flex-1 py-2.5 text-sm text-foreground"
                  placeholder="Search categories…"
                  placeholderTextColor="#9ca3af"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                  returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={8}>
                    <Feather name="x-circle" size={15} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* List */}
            <FlatList
              data={filtered}
              keyExtractor={(item) => item}
              style={{ maxHeight: 380 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const selected = item === value;
                return (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                    className={[
                      "flex-row items-center justify-between px-5 py-3.5 border-b border-white/5",
                      selected ? "bg-blue-500/20" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <Text
                      className={`text-sm ${selected ? "font-semibold text-blue-400" : "text-foreground"}`}
                    >
                      {item}
                    </Text>
                    {selected && (
                      <Feather name="check" size={15} color="#60a5fa" />
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View className="items-center py-10">
                  <Feather name="search" size={28} color="#6b7280" />
                  <Text className="mt-2 text-sm text-muted-foreground">
                    No categories found
                  </Text>
                </View>
              }
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
