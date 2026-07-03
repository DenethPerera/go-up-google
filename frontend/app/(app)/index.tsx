import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../context/auth";

export default function DashboardScreen() {
  const { user, signOutUser } = useAuth();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of Go-Up Google?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            setLoggingOut(true);
            try {
              await signOutUser();
            } catch (error) {
              console.error("Logout Error:", error);
              setLoggingOut(false);
            }
          },
        },
      ],
    );
  };

  const getUserInitials = () => {
    if (!user) return "U";
    if (user.displayName) {
      const parts = user.displayName.split(" ");
      if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return user.displayName.substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "G";
  };

  const getJoinedDate = () => {
    if (user?.metadata?.creationTime) {
      return new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "Today";
  };

  const getProviderIcon = () => {
    if (!user) return null;
    const providerId = user.providerData[0]?.providerId;
    if (providerId === "google.com") {
      return <AntDesign name="google" size={16} color="#EA4335" />;
    }
    return <Feather name="mail" size={16} color="#0A4174" />;
  };

  const statCards = [
    {
      icon: "cloud",
      title: "Syncing",
      value: "Live",
      caption: "Google Cloud",
      tint: "bg-primary/10",
      color: "#0A4174",
    },
    {
      icon: "check-circle",
      title: "99.8%",
      value: "Uptime",
      caption: "Stable",
      tint: "bg-accent/20",
      color: "#34A853",
    },
    {
      icon: "activity",
      title: "12 ms",
      value: "Latency",
      caption: "Fast",
      tint: "bg-secondary/10",
      color: "#4E8EA2",
    },
    {
      icon: "database",
      title: "0.2 GB",
      value: "Storage",
      caption: "Tracked",
      tint: "bg-muted",
      color: "#F59E0B",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="border-b border-border bg-card px-6 pb-5 pt-14 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primary">
              <AntDesign name="arrow-up" size={20} color="white" />
            </View>
            <View className="ml-3">
              <Text className="text-xl font-bold text-foreground">
                Go-Up Dashboard
              </Text>
              <Text className="text-sm text-muted-foreground">
                Your workspace, refined
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={toggleColorScheme}
              className="mr-2 h-10 w-10 items-center justify-center rounded-full border border-border bg-background"
              activeOpacity={0.8}
            >
              <Feather
                name={colorScheme === "dark" ? "sun" : "moon"}
                size={18}
                color={colorScheme === "dark" ? "#F59E0B" : "#5F6B7A"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              disabled={loggingOut}
              className="h-10 w-10 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10"
              activeOpacity={0.8}
            >
              {loggingOut ? (
                <ActivityIndicator size="small" color="#EF4444" />
              ) : (
                <Feather name="log-out" size={18} color="#EF4444" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="p-6">
        <View className="mb-6 flex-row items-center rounded-[24px] border border-border bg-card p-4 shadow-sm">
          {user?.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              className="h-16 w-16 rounded-full border-2 border-primary"
            />
          ) : (
            <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
              <Text className="text-2xl font-bold text-primary">
                {getUserInitials()}
              </Text>
            </View>
          )}

          <View className="ml-4 flex-1">
            <Text
              className="text-xl font-bold text-foreground"
              numberOfLines={1}
            >
              {user?.displayName || "Google User"}
            </Text>
            <View className="mt-1 flex-row items-center">
              <Text
                className="mr-2 text-sm text-muted-foreground"
                numberOfLines={1}
              >
                {user?.email}
              </Text>
              {getProviderIcon()}
            </View>
          </View>
        </View>

        <View className="mb-6 rounded-[24px] border border-primary/20 bg-primary/10 p-5">
          <View className="mb-2 flex-row items-center">
            <MaterialIcons name="verified-user" size={20} color="#0A4174" />
            <Text className="ml-2 text-base font-bold text-primary">
              Protected session
            </Text>
          </View>
          <Text className="text-sm leading-5 text-foreground">
            Your Go-Up Google session is secured with Firebase Authentication
            and synced with your workspace data.
          </Text>
        </View>

        <Text className="mb-4 text-lg font-bold text-foreground">
          Workspace overview
        </Text>
        <View className="mb-6 flex-row flex-wrap justify-between">
          {statCards.map((card) => (
            <View
              key={card.title}
              className="mb-4 w-[48%] rounded-[20px] border border-border bg-card p-4 shadow-sm"
            >
              <View
                className={`mb-3 h-10 w-10 items-center justify-center rounded-full ${card.tint}`}
              >
                <Feather
                  name={card.icon as never}
                  size={20}
                  color={card.color}
                />
              </View>
              <Text className="text-2xl font-bold text-foreground">
                {card.title}
              </Text>
              <Text className="mt-1 text-xs text-muted-foreground">
                {card.caption}
              </Text>
            </View>
          ))}
        </View>

        <Text className="mb-4 text-lg font-bold text-foreground">
          Account details
        </Text>
        <View className="mb-8 rounded-[24px] border border-border bg-card p-4 shadow-sm">
          <View className="flex-row items-center justify-between border-b border-border py-3">
            <Text className="text-sm font-medium text-muted-foreground">
              Auth provider
            </Text>
            <Text className="text-sm font-semibold text-foreground">
              {user?.providerData[0]?.providerId === "google.com"
                ? "Google Account"
                : "Email & Password"}
            </Text>
          </View>

          <View className="flex-row items-center justify-between border-b border-border py-3">
            <Text className="text-sm font-medium text-muted-foreground">
              Joined
            </Text>
            <Text className="text-sm font-semibold text-foreground">
              {getJoinedDate()}
            </Text>
          </View>

          <View className="flex-row items-center justify-between border-b border-border py-3">
            <Text className="text-sm font-medium text-muted-foreground">
              Verified
            </Text>
            <View className="flex-row items-center">
              <Text className="mr-1 text-sm font-semibold text-foreground">
                {user?.emailVerified ||
                user?.providerData[0]?.providerId === "google.com"
                  ? "Yes"
                  : "No"}
              </Text>
              <AntDesign name="check-circle" size={12} color="#34A853" />
            </View>
          </View>

          <View className="py-3">
            <Text className="mb-2 text-sm font-medium text-muted-foreground">
              User identifier
            </Text>
            <Text className="rounded-2xl border border-border bg-background/70 p-2 text-xs text-foreground">
              {user?.uid}
            </Text>
          </View>
        </View>

        <View className="items-center pb-8">
          <Text className="text-xs text-muted-foreground">
            Go-Up Google Mobile App • Version 1.0.0
          </Text>
          <Text className="mt-1 text-xs text-muted-foreground">
            Built with React Native & NativeWind
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
