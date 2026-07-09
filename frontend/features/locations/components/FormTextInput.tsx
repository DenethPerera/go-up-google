import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface FormTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  className?: string;
}

export function FormTextInput({
  label,
  error,
  className,
  ...rest
}: FormTextInputProps) {
  return (
    <View className="mb-4">
      <Text className="input-label">{label}</Text>

      <TextInput
        placeholderTextColor="#C7D3EA"
        className={[
          "input-field",
          error && "border-destructive",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />

      {error ? (
        <Text className="error-text">{error}</Text>
      ) : null}
    </View>
  );
}