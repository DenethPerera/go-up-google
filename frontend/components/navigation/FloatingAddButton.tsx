import React from "react";
import { TouchableOpacity, View, Platform, GestureResponderEvent } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

// Update the interface to accept the event argument passed by Expo Router
interface FloatingAddButtonProps {
  onPress?: (e: GestureResponderEvent | any) => void;
}

export function FloatingAddButton({ onPress }: FloatingAddButtonProps) {
  // Accept the event argument here
  const handlePress = (e: GestureResponderEvent | any) => {
    // Premium tactile feedback when triggering the add action
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Pass the event back up to Expo Router so it can handle the tab switch
    if (onPress) onPress(e);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={{
        top: Platform.OS === "ios" ? -25 : -20, // Elevates the button above the bar
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View className="h-[60px] w-[60px] items-center justify-center rounded-full border-[4px] border-white bg-secondary shadow-lg shadow-[#001d39]/20">
        <Feather name="plus" size={28} color="#ffffff" />
      </View>
    </TouchableOpacity>
  );
}