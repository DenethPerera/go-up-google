import { Text, View } from "react-native";
import { CheckCircle2, Clock, LayoutGrid, XCircle } from "lucide-react-native";
import { HomeSummary } from "../types";

export default function SummaryStatsGrid({ summary }: { summary: HomeSummary }) {
  const stats = [
    {
      label: "Locations",
      value: summary.totalLocations,
      icon: LayoutGrid,
      cardBg: "bg-[#4f86f7]", 
      iconBg: "bg-[#7199fa]", 
    },
    {
      label: "Approved",
      value: summary.approved,
      icon: CheckCircle2,
      cardBg: "bg-[#9166f0]", 
      iconBg: "bg-[#a882f3]", 
    },
    {
      label: "Pending",
      value: summary.pending,
      icon: Clock,
      cardBg: "bg-[#2ac181]", 
      iconBg: "bg-[#54cea1]", 
    },
    {
      label: "Failures",
      value: summary.syncFailures,
      icon: XCircle,
      cardBg: "bg-[#f25e9c]", 
      iconBg: "bg-[#f581b2]", 
    },
  ];

  return (
    <View className="flex-row gap-3"> 
      {stats.map((s) => (
        <View
          key={s.label}
          
          className={`flex-1 aspect-[4/5] rounded-xl p-1.5 items-center justify-center ${s.cardBg}`}
        >
          {/* 3. Shrunk the icon box to w-8 h-8 and reduced the bottom margin */}
          <View className={`w-8 h-8 rounded-lg items-center justify-center ${s.iconBg} mb-1`}>
            <s.icon size={16} color="#ffffff" />
          </View>

          {/* 4. Tweaked text sizes to ensure they never overflow */}
          <Text 
            className="text-white text-base font-extrabold text-center leading-tight"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {s.value}
          </Text>
          <Text 
            className="text-white text-[9px] font-medium text-center mt-0.5 leading-tight"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {s.label}
          </Text>
        </View>
      ))}
    </View>
  );
}