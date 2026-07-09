import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { Switch, Text, TextInput, View } from "react-native";

import { ICON_COLORS } from "../constants";
import { SocialMediaState } from "../types";
import { SectionCard } from "./SectionCard";

// ─── types ──────────────────────────────────────────────────────────────────────
interface SocialRowProps {
  /** FontAwesome5 icon name */
  icon: React.ComponentProps<typeof FontAwesome5>["name"];
  iconColor: string;
  label: string;
  platform: keyof SocialMediaState;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: React.ComponentProps<typeof TextInput>["keyboardType"];
  isLast?: boolean;
}

// ─── Single platform row ─────────────────────────────────────────────────────────
function SocialRow({
  icon,
  iconColor,
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "url",
  isLast = false,
}: SocialRowProps) {
  // "hasAccount" drives whether the URL input is shown.
  // We pre-fill it to true when there is already a saved link.
  const [hasAccount, setHasAccount] = useState<boolean>(() => value.trim().length > 0);

  const handleToggle = (next: boolean) => {
    setHasAccount(next);
    // Clear the stored value when user says "no account"
    if (!next) onChangeText("");
  };

  return (
    <View className={["pb-1", isLast ? "" : "mb-3 border-b border-white/10"].filter(Boolean).join(" ")}>
      {/* ── Row: icon + label + toggle ───────────────────────────── */}
      <View className="flex-row items-center justify-between py-2">
        <View className="flex-row items-center gap-3">
          <View
            className="h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${iconColor}22` }}
          >
            <FontAwesome5 name={icon} size={16} color={iconColor} solid />
          </View>
          <Text className="text-sm font-medium text-foreground">{label}</Text>
        </View>

        {/* Toggle */}
        <View className="flex-row items-center gap-2">
          <Text className="text-xs text-muted-foreground">
            {hasAccount ? "Have account" : "No account"}
          </Text>
          <Switch
            value={hasAccount}
            onValueChange={handleToggle}
            trackColor={{ false: "rgba(255,255,255,0.12)", true: "#3b82f6" }}
            thumbColor={hasAccount ? "#ffffff" : "#9ca3af"}
            ios_backgroundColor="rgba(255,255,255,0.12)"
          />
        </View>
      </View>

      {/* ── Input: only shown when toggled on ────────────────────── */}
      {hasAccount && (
        <View className="mb-2 mt-1 flex-row items-center rounded-2xl border border-white/20 bg-white/5 px-4">
          <Feather name="link" size={14} color="#9ca3af" />
          <TextInput
            className="ml-2 flex-1 py-3.5 text-sm text-foreground"
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      )}
    </View>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────────
interface Props {
  values: SocialMediaState;
  onChange: (field: keyof SocialMediaState, value: string) => void;
}

export function SocialMediaSection({ values, onChange }: Props) {
  return (
    <SectionCard
      icon={<Feather name="share-2" size={16} color={ICON_COLORS.primary} />}
      title="Social Media Profiles"
      subtitle="Toggle on only the platforms your business uses"
    >
      <SocialRow
        icon="facebook"
        iconColor={ICON_COLORS.facebook}
        label="Facebook"
        platform="facebook"
        placeholder="https://facebook.com/yourpage"
        value={values.facebook}
        onChangeText={(v) => onChange("facebook", v)}
      />
      <SocialRow
        icon="instagram"
        iconColor={ICON_COLORS.instagram}
        label="Instagram"
        platform="instagram"
        placeholder="https://instagram.com/youraccount"
        value={values.instagram}
        onChangeText={(v) => onChange("instagram", v)}
      />
      <SocialRow
        icon="tiktok"
        iconColor={ICON_COLORS.tiktok}
        label="TikTok"
        platform="tiktok"
        placeholder="https://tiktok.com/@yourprofile"
        value={values.tiktok}
        onChangeText={(v) => onChange("tiktok", v)}
      />
      <SocialRow
        icon="whatsapp"
        iconColor={ICON_COLORS.whatsapp}
        label="WhatsApp Business"
        platform="whatsapp"
        placeholder="+1 555 123 4567"
        value={values.whatsapp}
        onChangeText={(v) => onChange("whatsapp", v)}
        keyboardType="phone-pad"
        isLast
      />
    </SectionCard>
  );
}