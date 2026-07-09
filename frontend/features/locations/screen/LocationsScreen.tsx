import React, { useState, useEffect } from "react";
import { ActivityIndicator, InteractionManager, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { BusinessDetailsSection } from "@/features/locations/components/BusinessDetailsSection";
import { MapLocationPicker } from "@/features/locations/components/MapLocationPicker";
import { MediaAssetsSection } from "@/features/locations/components/MediaAssetsSection";
import { SocialMediaSection } from "@/features/locations/components/SocialMediaSection";
import { SubmitBar } from "@/features/locations/components/SubmitBar";
import { useLocationForm } from "@/features/locations/hooks/useLocationForm";

export default function LocationsScreen() {
  const insets = useSafeAreaInsets();
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      // A small deferral guarantees the Map component initializes off-thread
      const timer = setTimeout(() => {
        setIsLoadingPage(false);
      }, 150);
      return () => clearTimeout(timer);
    });
    return () => task.cancel();
  }, []);
  const {
    form,
    social,
    photos,
    errors,
    isSubmitting,
    updateField,
    updateSocial,
    addPhoto,
    removePhoto,
    submit,
  } = useLocationForm();

  if (isLoadingPage) {
    return (
      <LinearGradient
        colors={["#4F6BCC", "#24315A", "#1A2441"]}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ paddingTop: insets.top + 16 }}
        className="flex-1 justify-center items-center"
      >
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="mt-4 text-white/70 font-medium text-sm tracking-wide">
          Loading Location Details...
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#4F6BCC", "#24315A", "#1A2441"]}
      locations={[0, 0.45, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ paddingTop: insets.top + 16 }}
      className="flex-1"
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView
          className="flex-1 bg-transparent"
          contentContainerClassName="px-4 pb-8 pt-2"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <MapLocationPicker
            latitude={form.latitude}
            longitude={form.longitude}
            onLocationChange={(lat, lng, address) => {
              updateField("latitude", lat);
              updateField("longitude", lng);
              if (address) {
                updateField("address", address);
              }
            }}
          />
          <BusinessDetailsSection values={form} errors={errors} onChange={updateField} />
          <SocialMediaSection values={social} onChange={updateSocial} />
          <MediaAssetsSection photos={photos} onAddPhoto={addPhoto} onRemovePhoto={removePhoto} />
        </ScrollView>
      </KeyboardAvoidingView>

      <SubmitBar isSubmitting={isSubmitting} onSubmit={submit} />
    </LinearGradient>
  );
}