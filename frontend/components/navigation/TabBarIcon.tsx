import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";

interface TabBarIconProps {
  name: React.ComponentProps<typeof Feather>["name"];
  focused: boolean;
}

export function TabBarIcon({ name, focused }: TabBarIconProps) {
  return (
    <View className="items-center justify-center top-1">
      <Feather
        name={name}
        size={24}
        color={focused ? "#4e8ea2" : "#9ca3af"}
        style={{ marginBottom: 4 }}
      />
      {/* Active Indicator Dot */}
      {focused && (
        <View className="h-1.5 w-1.5 rounded-full bg-[#4e8ea2] shadow-sm" />
      )}
    </View>
  );
}