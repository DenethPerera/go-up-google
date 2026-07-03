import React from "react";
import { Feather } from "@expo/vector-icons";

import { ICON_COLORS } from "../constants";
import { SocialMediaState } from "../types";
import { SectionCard } from "./SectionCard";
import { SocialInput } from "./SocialInput";

interface Props {
  values: SocialMediaState;
  onChange: (field: keyof SocialMediaState, value: string) => void;
}

export function SocialMediaSection({ values, onChange }: Props) {
  return (
    <SectionCard
      icon={<Feather name="share-2" size={16} color={ICON_COLORS.primary} />}
      title="Social Media Profiles"
      subtitle="Handles or links shown as icons on your listing card"
    >
      <SocialInput
        icon="facebook"
        iconColor={ICON_COLORS.facebook}
        placeholder="Facebook page link or username"
        value={values.facebook}
        onChangeText={(v) => onChange("facebook", v)}
        autoCapitalize="none"
      />
      <SocialInput
        icon="instagram"
        iconColor={ICON_COLORS.instagram}
        placeholder="Instagram username"
        value={values.instagram}
        onChangeText={(v) => onChange("instagram", v)}
        autoCapitalize="none"
      />
      <SocialInput
        icon="tiktok"
        iconColor={ICON_COLORS.tiktok}
        placeholder="TikTok profile link"
        value={values.tiktok}
        onChangeText={(v) => onChange("tiktok", v)}
        autoCapitalize="none"
      />
      <SocialInput
        icon="whatsapp"
        iconColor={ICON_COLORS.whatsapp}
        placeholder="WhatsApp business number"
        value={values.whatsapp}
        onChangeText={(v) => onChange("whatsapp", v)}
        keyboardType="phone-pad"
        autoCapitalize="none"
        className="mb-0"
      />
    </SectionCard>
  );
}