import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../context/auth";
import queryClient from "../lib/queryClient";
import "../styles/global.css";

function InitialLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Do nothing until Firebase has resolved the auth state.
    // This prevents any premature navigation / flashing.
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Not logged in — send to login screen
      router.replace("/login" as any);
    } else if (user && inAuthGroup) {
      // Already logged in but on an auth screen — send to app
      router.replace("/(tabs)" as any);
    }
  }, [user, loading, segments, router]);

  // ─── While Firebase resolves the session, show a branded splash ───────────
  // This is the key fix: render NOTHING (no Stack, no screens) until we know
  // whether the user is logged in. This eliminates the white flash of
  // (app)/index.tsx that appeared before the redirect fired.
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000000", // brand primary — no NativeWind needed here
        }}
      >
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  // ─── Auth state resolved — mount the correct stack ────────────────────────
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="location/[id]" options={{ headerShown: false }} />
        </>
      ) : (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </QueryClientProvider>
  );
}
