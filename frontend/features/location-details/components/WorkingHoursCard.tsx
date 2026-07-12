import { Text, View } from "react-native";
import { Clock } from "lucide-react-native";
import { WeeklyHours, DayOfWeek } from "@/features/locations/types";

interface WorkingHoursCardProps {
  workingHours: WeeklyHours;
}

const DAY_ORDER: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const DAY_SHORT: Record<DayOfWeek, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

/** Zero-pads a number to 2 digits: 9 → "09" */
function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Formats a GBPTime object to "HH:MM" */
function formatTime(t: { hours: number; minutes: number }) {
  return `${pad(t.hours)}:${pad(t.minutes)}`;
}

/**
 * Renders the weekly working-hours schedule in a compact grid.
 * Days with `isOpen === false` are shown as "Closed".
 * Days not present in the `workingHours` object are skipped entirely.
 */
export function WorkingHoursCard({ workingHours }: WorkingHoursCardProps) {
  const entries = DAY_ORDER.filter((day) => workingHours[day] !== undefined);

  if (entries.length === 0) return null;

  return (
    <View className="mb-4 rounded-2xl bg-white/8 p-4">
      <View className="mb-3 flex-row items-center gap-2">
        <View className="h-7 w-7 items-center justify-center rounded-xl bg-white/10">
          <Clock size={14} color="#C8D1E8" />
        </View>
        <Text className="text-xs font-semibold uppercase tracking-widest text-white/40">
          Working Hours
        </Text>
      </View>

      {entries.map((day) => {
        const schedule = workingHours[day]!;
        return (
          <View key={day} className="flex-row items-center justify-between py-1.5">
            <Text className="w-10 text-sm font-semibold text-white/80">
              {DAY_SHORT[day]}
            </Text>
            {schedule.isOpen ? (
              <Text className="text-sm font-medium text-white">
                {formatTime(schedule.openTime)} – {formatTime(schedule.closeTime)}
              </Text>
            ) : (
              <Text className="text-sm font-medium text-white/30">Closed</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}
