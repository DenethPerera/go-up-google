import React from "react";
import { Text, View } from "react-native";

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ icon, title, subtitle, children, className }: SectionCardProps) {
  return (
    <View className={["card", "mb-5", "rounded-3xl", className ?? ""].filter(Boolean).join(" ")}>
      <View className="mb-4 flex-row items-center">
        <View className="mr-3 h-9 w-9 items-center justify-center rounded-xl bg-muted">{icon}</View> 
        <View className="flex-1">
          <Text className="text-base font-bold text-foreground">{title}</Text>
          {subtitle ? <Text className="mt-0.5 text-xs text-muted-foreground">{subtitle}</Text> : null}
        </View>
      </View>
      {children}
    </View>
  );
}