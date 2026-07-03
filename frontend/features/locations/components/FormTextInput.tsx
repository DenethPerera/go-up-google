import React, { useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface FormTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  className?: string;
}

export function FormTextInput({ label, error, className, onFocus, onBlur, ...rest }: FormTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      <Text className="input-label">{label}</Text>
      <TextInput
        placeholderTextColor="#9ca3af"
        className={[
          "input-field",
          isFocused ? "input-field-focus" : "",
          error ? "border-destructive" : "",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
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
      {error ? <Text className="error-text">{error}</Text> : null}
    </View>
  );
}