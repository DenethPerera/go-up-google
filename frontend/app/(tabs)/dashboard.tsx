// 

import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";

const MOCK_LOCATION_PHOTOS = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&auto=format&fit=crop&q=60",
];

// ---- Theme tokens pulled from globals.css ----
const COLORS = {
  primary: "#0a4174",
  primaryForeground: "#ffffff",
  secondary: "#4e8ea2",
  accent: "#7bbde8",
  muted: "#daeaf4",
  mutedForeground: "#49769f",
  border: "#6ea2b3",
  foreground: "#001d39",
  destructive: "#ef4444",
  inputBackground: "rgba(255,255,255,0.7)",
};

export default function LocationsScreen() {
  const insets = useSafeAreaInsets();

  // Basic Business Details State
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState("");

  // Social Media Channels State
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Media / Photo Uploads State
  const [photos, setPhotos] = useState<string[]>([]);

  // Interaction & Focus UI states
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [focusedSocial, setFocusedSocial] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePhotoUploadSelection = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Location Photo Asset", "Attach photos of the storefront, interiors or branding files.", [
      {
        text: "Take Photo",
        onPress: async () => {
          const nextImg = MOCK_LOCATION_PHOTOS[photos.length % MOCK_LOCATION_PHOTOS.length];
          setPhotos([...photos, nextImg]);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleRemovePhoto = async (indexToRemove: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPhotos(photos.filter((_, idx) => idx !== indexToRemove));
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "Location name is required";
    if (!address.trim()) nextErrors.address = "Full address is required";

    if (contact.trim()) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
      if (!phoneRegex.test(contact)) nextErrors.contact = "Invalid phone number format";
    }

    if (website.trim()) {
      const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlRegex.test(website)) nextErrors.website = "Invalid website URL format";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmitLocation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Required Fields Missing", "Please check the form for errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(async () => {
      setIsSubmitting(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Location Sync Complete", "The location information has been successfully uploaded.", [
        {
          text: "Acknowledge",
          onPress: () => {
            setName(""); setAddress(""); setContact(""); setWebsite("");
            setFacebook(""); setInstagram(""); setTiktok(""); setWhatsapp("");
            setPhotos([]);
          },
        },
      ]);
    }, 2200);
  };

  // ---- Reusable bits kept local to avoid touching other files ----
  const SectionHeader = ({
    icon,
    title,
    subtitle,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
  }) => (
    <View className="mb-4 flex-row items-center">
      <View
        className="mr-3 h-9 w-9 items-center justify-center rounded-xl"
        style={{ backgroundColor: COLORS.muted }}
      >
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-base font-bold" style={{ color: COLORS.foreground }}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-0.5 text-xs" style={{ color: COLORS.mutedForeground }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: "#001d39" }}>
      {/* TOP HEADER — unchanged */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="pb-5 items-center justify-center relative"
      >
        <Text className="text-white text-xl font-semibold tracking-wide">
          Location Center
        </Text>
      </View>

      {/* WHITE BODY CONTAINER */}
      <View className="flex-1 bg-white rounded-t-[32px] overflow-hidden shadow-lg border-t border-white/20">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{
              paddingTop: 24,
              paddingHorizontal: 20,
              paddingBottom: 40,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* SECTION 1: BUSINESS DETAILS */}
            <View
              className="mb-5 rounded-3xl p-5"
              style={{ backgroundColor: "#ffffff", borderWidth: 1, borderColor: COLORS.muted }}
            >
              <SectionHeader
                icon={<Feather name="briefcase" size={16} color={COLORS.primary} />}
                title="Business Details"
                subtitle="Core information shown on your public listing"
              />

              {/* Name */}
              <View className="mb-4">
                <Text className="mb-1.5 text-sm font-semibold" style={{ color: COLORS.mutedForeground }}>
                  Location Name
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g., Downtown Flagship Store"
                  placeholderTextColor="#9ca3af"
                  className="w-full rounded-2xl px-4 py-3.5 text-base"
                  style={{
                    backgroundColor: COLORS.inputBackground,
                    borderWidth: 1.5,
                    borderColor: focusedField === "name" ? COLORS.primary : errors.name ? COLORS.destructive : COLORS.muted,
                    color: COLORS.foreground,
                  }}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                />
                {errors.name && (
                  <Text className="mt-1.5 text-sm font-medium ml-1" style={{ color: COLORS.destructive }}>
                    {errors.name}
                  </Text>
                )}
              </View>

              {/* Address */}
              <View className="mb-4">
                <Text className="mb-1.5 text-sm font-semibold" style={{ color: COLORS.mutedForeground }}>
                  Full Address
                </Text>
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="e.g., 742 Evergreen Terrace"
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={2}
                  className="w-full rounded-2xl px-4 py-3.5 text-base min-h-[70px]"
                  style={{
                    backgroundColor: COLORS.inputBackground,
                    borderWidth: 1.5,
                    borderColor: focusedField === "address" ? COLORS.primary : errors.address ? COLORS.destructive : COLORS.muted,
                    color: COLORS.foreground,
                  }}
                  onFocus={() => setFocusedField("address")}
                  onBlur={() => setFocusedField(null)}
                />
                {errors.address && (
                  <Text className="mt-1.5 text-sm font-medium ml-1" style={{ color: COLORS.destructive }}>
                    {errors.address}
                  </Text>
                )}
              </View>

              {/* Contact */}
              <View className="mb-4">
                <Text className="mb-1.5 text-sm font-semibold" style={{ color: COLORS.mutedForeground }}>
                  Contact Number
                </Text>
                <TextInput
                  value={contact}
                  onChangeText={setContact}
                  placeholder="e.g., +1 (555) 123-4567"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  className="w-full rounded-2xl px-4 py-3.5 text-base"
                  style={{
                    backgroundColor: COLORS.inputBackground,
                    borderWidth: 1.5,
                    borderColor: focusedField === "contact" ? COLORS.primary : errors.contact ? COLORS.destructive : COLORS.muted,
                    color: COLORS.foreground,
                  }}
                  onFocus={() => setFocusedField("contact")}
                  onBlur={() => setFocusedField(null)}
                />
                {errors.contact && (
                  <Text className="mt-1.5 text-sm font-medium ml-1" style={{ color: COLORS.destructive }}>
                    {errors.contact}
                  </Text>
                )}
              </View>

              {/* Website */}
              <View>
                <Text className="mb-1.5 text-sm font-semibold" style={{ color: COLORS.mutedForeground }}>
                  Website URL
                </Text>
                <TextInput
                  value={website}
                  onChangeText={setWebsite}
                  placeholder="e.g., www.goupworkspace.com"
                  placeholderTextColor="#9ca3af"
                  keyboardType="url"
                  autoCapitalize="none"
                  className="w-full rounded-2xl px-4 py-3.5 text-base"
                  style={{
                    backgroundColor: COLORS.inputBackground,
                    borderWidth: 1.5,
                    borderColor: focusedField === "website" ? COLORS.primary : errors.website ? COLORS.destructive : COLORS.muted,
                    color: COLORS.foreground,
                  }}
                  onFocus={() => setFocusedField("website")}
                  onBlur={() => setFocusedField(null)}
                />
                {errors.website && (
                  <Text className="mt-1.5 text-sm font-medium ml-1" style={{ color: COLORS.destructive }}>
                    {errors.website}
                  </Text>
                )}
              </View>
            </View>

            {/* SECTION 2: SOCIAL MEDIA PROFILES */}
            <View
              className="mb-5 rounded-3xl p-5"
              style={{ backgroundColor: "#ffffff", borderWidth: 1, borderColor: COLORS.muted }}
            >
              <SectionHeader
                icon={<Feather name="share-2" size={16} color={COLORS.primary} />}
                title="Social Media Profiles"
                subtitle="Handles or links shown as icons on your listing card"
              />

              {/* Facebook */}
              <View
                className="mb-3 flex-row items-center rounded-2xl px-4"
                style={{
                  backgroundColor: focusedSocial === "facebook" ? "#ffffff" : COLORS.inputBackground,
                  borderWidth: 1.5,
                  borderColor: focusedSocial === "facebook" ? COLORS.primary : COLORS.muted,
                }}
              >
                <View className="w-6 items-center">
                  <FontAwesome5 name="facebook" size={18} color="#1877F2" />
                </View>
                <View className="mx-3 h-5 w-px" style={{ backgroundColor: COLORS.muted }} />
                <TextInput
                  value={facebook}
                  onChangeText={setFacebook}
                  placeholder="Facebook page link or username"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                  className="flex-1 py-3.5 text-sm"
                  style={{ color: COLORS.foreground }}
                  onFocus={() => setFocusedSocial("facebook")}
                  onBlur={() => setFocusedSocial(null)}
                />
              </View>

              {/* Instagram */}
              <View
                className="mb-3 flex-row items-center rounded-2xl px-4"
                style={{
                  backgroundColor: focusedSocial === "instagram" ? "#ffffff" : COLORS.inputBackground,
                  borderWidth: 1.5,
                  borderColor: focusedSocial === "instagram" ? COLORS.primary : COLORS.muted,
                }}
              >
                <View className="w-6 items-center">
                  <FontAwesome5 name="instagram" size={18} color="#E4405F" />
                </View>
                <View className="mx-3 h-5 w-px" style={{ backgroundColor: COLORS.muted }} />
                <TextInput
                  value={instagram}
                  onChangeText={setInstagram}
                  placeholder="Instagram username"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                  className="flex-1 py-3.5 text-sm"
                  style={{ color: COLORS.foreground }}
                  onFocus={() => setFocusedSocial("instagram")}
                  onBlur={() => setFocusedSocial(null)}
                />
              </View>

              {/* TikTok */}
              <View
                className="mb-3 flex-row items-center rounded-2xl px-4"
                style={{
                  backgroundColor: focusedSocial === "tiktok" ? "#ffffff" : COLORS.inputBackground,
                  borderWidth: 1.5,
                  borderColor: focusedSocial === "tiktok" ? COLORS.primary : COLORS.muted,
                }}
              >
                <View className="w-6 items-center">
                  <FontAwesome5 name="tiktok" size={17} color="#000000" />
                </View>
                <View className="mx-3 h-5 w-px" style={{ backgroundColor: COLORS.muted }} />
                <TextInput
                  value={tiktok}
                  onChangeText={setTiktok}
                  placeholder="TikTok profile link"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                  className="flex-1 py-3.5 text-sm"
                  style={{ color: COLORS.foreground }}
                  onFocus={() => setFocusedSocial("tiktok")}
                  onBlur={() => setFocusedSocial(null)}
                />
              </View>

              {/* WhatsApp */}
              <View
                className="flex-row items-center rounded-2xl px-4"
                style={{
                  backgroundColor: focusedSocial === "whatsapp" ? "#ffffff" : COLORS.inputBackground,
                  borderWidth: 1.5,
                  borderColor: focusedSocial === "whatsapp" ? COLORS.primary : COLORS.muted,
                }}
              >
                <View className="w-6 items-center">
                  <FontAwesome5 name="whatsapp" size={18} color="#25D366" />
                </View>
                <View className="mx-3 h-5 w-px" style={{ backgroundColor: COLORS.muted }} />
                <TextInput
                  value={whatsapp}
                  onChangeText={setWhatsapp}
                  placeholder="WhatsApp business number"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  className="flex-1 py-3.5 text-sm"
                  style={{ color: COLORS.foreground }}
                  onFocus={() => setFocusedSocial("whatsapp")}
                  onBlur={() => setFocusedSocial(null)}
                />
              </View>
            </View>

            {/* SECTION 3: MEDIA ASSETS */}
            <View
              className="mb-2 rounded-3xl p-5"
              style={{ backgroundColor: "#ffffff", borderWidth: 1, borderColor: COLORS.muted }}
            >
              <SectionHeader
                icon={<Feather name="image" size={16} color={COLORS.primary} />}
                title="Media Assets"
                subtitle={`${photos.length} photo${photos.length === 1 ? "" : "s"} added`}
              />

              <TouchableOpacity
                onPress={handlePhotoUploadSelection}
                activeOpacity={0.8}
                className="flex-col items-center justify-center rounded-2xl border border-dashed py-7"
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.muted + "40" }}
              >
                <View
                  className="h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: COLORS.muted }}
                >
                  <Feather name="upload-cloud" size={22} color={COLORS.primary} />
                </View>
                <Text className="mt-3 text-sm font-semibold" style={{ color: COLORS.primary }}>
                  Tap to upload location photos
                </Text>
                <Text className="mt-1 text-xs" style={{ color: COLORS.mutedForeground }}>
                  Storefront, interior, or branding files
                </Text>
              </TouchableOpacity>

              {photos.length > 0 && (
                <ScrollView horizontal className="mt-4" showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                  {photos.map((uri, index) => (
                    <View key={index} className="relative mt-2 mr-2">
                      <Image
                        source={{ uri }}
                        className="h-20 w-20 rounded-2xl"
                        style={{ borderWidth: 1, borderColor: COLORS.muted }}
                      />
                      <TouchableOpacity
                        onPress={() => handleRemovePhoto(index)}
                        className="absolute -right-2 -top-2 h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: COLORS.destructive }}
                      >
                        <Feather name="x" size={14} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* FLOATING BOTTOM SUBMIT BUTTON */}
        <View
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          className="bg-white px-6 pt-4 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border-t"
        >
          <View style={{ borderTopColor: COLORS.muted }} />
          <TouchableOpacity
            onPress={handleSubmitLocation}
            disabled={isSubmitting}
            activeOpacity={0.85}
            className="flex-row items-center justify-center rounded-2xl py-4"
            style={{
              backgroundColor: COLORS.primary,
              opacity: isSubmitting ? 0.8 : 1,
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator color={COLORS.primaryForeground} />
            ) : (
              <>
                <Feather name="check-circle" size={18} color={COLORS.primaryForeground} style={{ marginRight: 8 }} />
                <Text className="text-base font-bold" style={{ color: COLORS.primaryForeground }}>
                  Save & Publish Location
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}