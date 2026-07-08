import React, { useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface SocialInputProps extends TextInputProps {
  icon: React.ComponentProps<typeof FontAwesome5>["name"];
  iconColor: string;
  className?: string;
}

export function SocialInput({ icon, iconColor, className, onFocus, onBlur, ...rest }: SocialInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={[
        "mb-3 flex-row items-center rounded-2xl border px-4",
        isFocused ? "border-blue-400  " : "border-white",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <View className="w-6 items-center">
        <FontAwesome5 name={icon} size={18} color={iconColor} />
      </View>
      <View className="mx-3 h-5 w-px bg-border/30" />
      <TextInput
        placeholderTextColor="#9ca3af"
        className="flex-1 py-3.5 text-sm text-foreground"
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
    </View>
  );
}