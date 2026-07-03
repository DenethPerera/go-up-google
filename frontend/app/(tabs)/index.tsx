import React from "react";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-lg font-semibold text-foreground">Home</Text>
      <Text className="mt-2 text-sm text-muted-foreground">
        Welcome to the tabs area after login.
      </Text>
    </View>
  );
}
