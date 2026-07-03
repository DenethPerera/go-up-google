import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";

import { PHONE_REGEX, URL_REGEX } from "../constants";
import { LocationFormErrors, LocationFormState, PhotoAsset, SocialMediaState } from "../types";
import { useSubmitLocation } from "./useSubmitLocation";

const INITIAL_FORM: LocationFormState = {
  name: "",
  address: "",
  contact: "",
  website: "",
  category: "",
  description: "",
  email: "",
  workingHours: "",
};

const INITIAL_SOCIAL: SocialMediaState = {
  facebook: "",
  instagram: "",
  tiktok: "",
  whatsapp: "",
};

export function useLocationForm() {
  const [form, setForm] = useState<LocationFormState>(INITIAL_FORM);
  const [social, setSocial] = useState<SocialMediaState>(INITIAL_SOCIAL);
  const [photos, setPhotos] = useState<PhotoAsset[]>([]);
  const [errors, setErrors] = useState<LocationFormErrors>({});

  // ─── Reset ────────────────────────────────────────────────────────────────
  const reset = () => {
    setForm(INITIAL_FORM);
    setSocial(INITIAL_SOCIAL);
    setPhotos([]);
    setErrors({});
  };

  // ─── TanStack Query mutation ───────────────────────────────────────────────
  const { mutate, isPending: isSubmitting } = useSubmitLocation({ onSuccess: reset });

  // ─── Field updates ────────────────────────────────────────────────────────
  const updateField = (field: keyof LocationFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateSocial = (field: keyof SocialMediaState, value: string) => {
    setSocial((prev) => ({ ...prev, [field]: value }));
  };

  // ─── Photo picker ─────────────────────────────────────────────────────────
  const addPhoto = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Alert.alert(
      "Location Photo Asset",
      "Attach photos of the storefront, interiors or branding files.",
      [
        {
          text: "Take Photo",
          onPress: () => openCamera(),
        },
        {
          text: "Choose from Library",
          onPress: () => openLibrary(),
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Camera access is needed to take photos.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
    });
    handlePickerResult(result);
  };

  const openLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Photo library access is needed to select photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.85,
      selectionLimit: 10,
    });
    handlePickerResult(result);
  };

  const handlePickerResult = (result: ImagePicker.ImagePickerResult) => {
    if (result.canceled || !result.assets) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const newAssets: PhotoAsset[] = result.assets.map((asset) => ({
      uri: asset.uri,
      // expo-image-picker provides mimeType; fall back to jpeg
      type: asset.mimeType ?? "image/jpeg",
      // derive a filename from the URI or generate a timestamp-based name
      name: asset.fileName ?? `location_photo_${Date.now()}.jpg`,
    }));

    setPhotos((prev) => [...prev, ...newAssets]);
  };

  const removePhoto = async (index: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Validation ───────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const nextErrors: LocationFormErrors = {};
    if (!form.name.trim()) nextErrors.name = "Location name is required";
    if (!form.address.trim()) nextErrors.address = "Full address is required";
    if (form.contact.trim() && !PHONE_REGEX.test(form.contact)) {
      nextErrors.contact = "Invalid phone number format";
    }
    if (form.website.trim() && !URL_REGEX.test(form.website)) {
      nextErrors.website = "Invalid website URL format";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const submit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!validate()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Required Fields Missing", "Please check the form for errors before submitting.");
      return;
    }

    mutate({ ...form, social, photos });
  };

  return {
    form,
    social,
    // Expose the URI strings so MediaAssetsSection stays unchanged
    photos: photos.map((p) => p.uri),
    errors,
    isSubmitting,
    updateField,
    updateSocial,
    addPhoto,
    removePhoto,
    submit,
  };
}