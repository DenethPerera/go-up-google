import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { ICON_COLORS } from "../constants";

interface Props {
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function SubmitBar({ isSubmitting, onSubmit }: Props) {
  const insets = useSafeAreaInsets();

  // useBottomTabBarHeight() assumes this screen lives inside a navigator
  // built on @react-navigation/bottom-tabs (Expo Router's <Tabs/> uses this
  // under the hood). If you're using a fully custom tab bar component
  // instead, swap this for that component's fixed height value.
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View
      style={{ paddingBottom: tabBarHeight + 20 }}
      className="bg-white px-6 pt-4 border-t border-border"
    >
      <TouchableOpacity
        onPress={onSubmit}
        disabled={isSubmitting}
        activeOpacity={0.85}
        className="btn-primary"
        style={{ opacity: isSubmitting ? 0.8 : 1 }}
      >
        {isSubmitting ? (
          <ActivityIndicator color={ICON_COLORS.white} />
        ) : (
          <>
            <Feather name="check-circle" size={18} color={ICON_COLORS.white} style={{ marginRight: 8 }} />
            <Text className="text-base font-bold text-primary-foreground">Save & Publish Location</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}