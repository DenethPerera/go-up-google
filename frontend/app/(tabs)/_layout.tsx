import React from "react";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBarIcon } from "../../components/navigation/TabBarIcon";
import { FloatingAddButton } from "../../components/navigation/FloatingAddButton";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          // Edge ekata touch wenna left, right, bottom 0 karanna
          bottom: 0,
          left: 0,
          right: 0,
          
          // Base height 60k dila ekata safe area padding eka ekathu karanna (anith models walata support wenna)
          height: 60 + insets.bottom, 
          paddingBottom: insets.bottom, // iPhone home bar eken icons cover nowenna
          paddingTop: 10,
          
          backgroundColor: "#24315A", // Premium glass feel
          
          // Udin thiyena corners deka witharak round karanna
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          
          borderTopWidth: 0,
          
          // Shadow eka udata drop wenna (height: -5) hadanna, mokada tab bar eka thiyenne pahala nisa
          shadowColor: "#001d39",
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.08,
          shadowRadius: 15,
          elevation: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="home" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="locations"
        options={{
          title: "Locations",
          tabBarButton: (props) => <FloatingAddButton {...props} />,
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="bar-chart-2" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}