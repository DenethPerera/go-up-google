import { Image, Pressable, Text, View } from "react-native";
import { Bell, Search, ChevronRight } from "lucide-react-native";

export default function HomeHeader({ businessName }: { businessName: string }) {
  return (
    
    <View className="mb-8 w-full flex-row items-center justify-between">
      <Pressable className="flex-row items-center rounded-full bg-white/10 p-1 pr-4">
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=11" }}
          className="h-10 w-10 rounded-[14px] border-[1.5px]"
        />

        <Text className="ml-3 mr-1 text-base font-medium text-white">
          {businessName}
        </Text>
        <ChevronRight size={18} color="#ffffff" />
      </Pressable>

      <View className="flex-row items-center gap-4">
        <Pressable className="p-2">
          <Search size={24} color="#ffffff" />
        </Pressable>

        <Pressable className="relative h-12 w-12 items-center justify-center rounded-[18px] bg-white/10">
          <Bell size={22} color="#ffffff" />

          
        </Pressable>
      </View>
    </View>
  );
}
