import React from "react";
import { View, Text } from "react-native";

export default function DashboardScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-lg font-semibold text-foreground">Dashboard</Text>
      <Text className="mt-2 text-sm text-muted-foreground">Dashboard content goes here.</Text>
    </View>
  );
}
