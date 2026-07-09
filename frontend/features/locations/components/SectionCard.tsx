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
    <View className={["form-input-card", "mb-5", "rounded-3xl", className ?? ""].filter(Boolean).join(" ")}>
      <View className="mb-4 flex-row items-center mr-6">
        <View className="relative h-12 w-12 mr-3 items-center justify-center rounded-[18px] bg-white/10">{icon}</View> 
        <View className="flex-1">
          <Text className="text-base font-bold text-foreground">{title}</Text>
          {subtitle ? <Text className="mt-0.5 text-xs text-muted-foreground">{subtitle}</Text> : null}
        </View>
      </View>
      {children}
    </View>
  );
}