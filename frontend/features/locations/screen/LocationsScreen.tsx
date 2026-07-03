import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BusinessDetailsSection } from "@/features/locations/components/BusinessDetailsSection";
import { MediaAssetsSection } from "@/features/locations/components/MediaAssetsSection";
import { SocialMediaSection } from "@/features/locations/components/SocialMediaSection";
import { SubmitBar } from "@/features/locations/components/SubmitBar";
import { useLocationForm } from "@/features/locations/hooks/useLocationForm";

export default function LocationsScreen() {
  const insets = useSafeAreaInsets();
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

  return (
    <View className="flex-1 bg-primary">
      {/* TOP HEADER — unchanged */}
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="pb-5 items-center justify-center relative ">
        <Text className="text-white text-xl font-semibold tracking-wide">Location Center</Text>
      </View>

      {/* WHITE BODY CONTAINER */}
      <View className="flex-1 bg-white rounded-t-[32px] overflow-hidden shadow-lg border-t border-white/20">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
          <ScrollView
            contentContainerStyle={{ paddingTop: 24, paddingHorizontal: 20, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <BusinessDetailsSection values={form} errors={errors} onChange={updateField} />
            <SocialMediaSection values={social} onChange={updateSocial} />
            <MediaAssetsSection photos={photos} onAddPhoto={addPhoto} onRemovePhoto={removePhoto} />
          </ScrollView>
        </KeyboardAvoidingView>

        <SubmitBar isSubmitting={isSubmitting} onSubmit={submit} />
      </View>
    </View>
  );
}