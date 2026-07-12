import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DayOfWeek, DaySchedule, GBPTime, WeeklyHours } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DAYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

interface Props {
  value: WeeklyHours;
  onChange: (value: WeeklyHours) => void;
  error?: string;
}

const formatTime = (time: GBPTime) => {
  const isPM = time.hours >= 12;
  const hours12 = time.hours % 12 || 12;
  const minutes = time.minutes === 0 ? '00' : time.minutes;
  return `${hours12}:${minutes} ${isPM ? 'PM' : 'AM'}`;
};

export function WorkingHoursPicker({ value, onChange, error }: Props) {
  const insets = useSafeAreaInsets();
  
  const [activeDay, setActiveDay] = useState<DayOfWeek | null>(null);
  const [activeType, setActiveType] = useState<'openTime' | 'closeTime' | null>(null);
  
  const handleToggleDay = (day: DayOfWeek, isOpen: boolean) => {
    const newVal = { ...value };
    if (isOpen) {
      newVal[day] = {
        isOpen: true,
        openTime: { hours: 9, minutes: 0 },
        closeTime: { hours: 17, minutes: 0 },
      };
    } else {
      newVal[day] = {
        isOpen: false,
        openTime: { hours: 0, minutes: 0 },
        closeTime: { hours: 0, minutes: 0 },
      };
    }
    onChange(newVal);
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    if (!activeDay || !activeType) return;
    const newVal = { ...value };
    if (newVal[activeDay]) {
      newVal[activeDay]![activeType] = { hours, minutes };
    }
    onChange(newVal);
    // Don't close immediately, let them hit "Done"
  };

  const copyMondayToAllOpen = () => {
    const monday = value['MONDAY'];
    if (!monday || !monday.isOpen) return;

    const newVal = { ...value };
    for (const day of DAYS) {
      if (day === 'MONDAY') continue;
      if (newVal[day]?.isOpen) {
        newVal[day] = {
          isOpen: true,
          openTime: { ...monday.openTime },
          closeTime: { ...monday.closeTime },
        };
      }
    }
    onChange(newVal);
  };

  const activeSchedule = activeDay ? value[activeDay] : null;
  const activeTime = activeSchedule && activeType ? activeSchedule[activeType] : null;

  return (
    <View className="mb-4">
      <Text className="input-label">Working Hours</Text>

      <View className={`w-full rounded-2xl border ${error ? 'border-destructive' : 'border-border/50'} bg-white/5 overflow-hidden`}>
        {DAYS.map((day, idx) => {
          const schedule = value[day] || { isOpen: false, openTime: { hours: 9, minutes: 0 }, closeTime: { hours: 17, minutes: 0 } };
          return (
            <View key={day} className={`px-4 py-3 flex-row items-center justify-between ${idx !== DAYS.length - 1 ? 'border-b border-border/30' : ''}`}>
              <View className="flex-row items-center w-24">
                <Switch
                  value={schedule.isOpen}
                  onValueChange={(val) => handleToggleDay(day, val)}
                  trackColor={{ false: '#3f3f46', true: '#3b82f6' }}
                  thumbColor="#ffffff"
                  className="mr-3 scale-75 origin-left"
                />
                <Text className={`text-sm font-medium ${schedule.isOpen ? 'text-white' : 'text-gray-400'}`}>
                  {day.slice(0, 3)}
                </Text>
              </View>

              {schedule.isOpen ? (
                <View className="flex-1 flex-row items-center justify-end">
                  <TouchableOpacity 
                    onPress={() => { setActiveDay(day); setActiveType('openTime'); }}
                    className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
                  >
                    <Text className="text-white text-xs">{formatTime(schedule.openTime)}</Text>
                  </TouchableOpacity>
                  <Text className="mx-2 text-gray-400 text-xs">→</Text>
                  <TouchableOpacity 
                    onPress={() => { setActiveDay(day); setActiveType('closeTime'); }}
                    className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
                  >
                    <Text className="text-white text-xs">{formatTime(schedule.closeTime)}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="flex-1 items-end pr-2">
                  <Text className="text-gray-500 text-sm italic">Closed</Text>
                </View>
              )}
            </View>
          );
        })}
        
        {value['MONDAY']?.isOpen && (
          <TouchableOpacity 
            onPress={copyMondayToAllOpen}
            className="flex-row items-center justify-center py-3 border-t border-border/30 bg-blue-500/10"
          >
            <Feather name="copy" size={14} color="#60a5fa" />
            <Text className="ml-2 text-blue-400 text-xs font-semibold">Copy Mon to all open days</Text>
          </TouchableOpacity>
        )}
      </View>

      {error ? <Text className="error-text">{error}</Text> : null}

      {/* Minimal Time Picker Modal */}
      <Modal visible={!!activeDay && !!activeType} transparent animationType="fade">
        <Pressable className="flex-1 bg-black/60 justify-center items-center px-6" onPress={() => { setActiveDay(null); setActiveType(null); }}>
          <Pressable 
            onPress={(e) => e.stopPropagation()} 
            className="w-full bg-[#1A2441] rounded-3xl border border-white/10 overflow-hidden"
          >
            <View className="px-5 py-4 border-b border-white/10 flex-row justify-between items-center bg-[#24315A]">
              <Text className="text-white font-semibold">
                {activeDay?.slice(0, 3)} {activeType === 'openTime' ? 'Opening' : 'Closing'} Time
              </Text>
              <TouchableOpacity onPress={() => { setActiveDay(null); setActiveType(null); }}>
                <Text className="text-blue-400 font-bold">Done</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center items-center py-8">
              {/* Hours Column */}
              <View className="h-40 w-16">
                <FlatList
                  data={Array.from({ length: 24 }, (_, i) => i)}
                  keyExtractor={(item) => `h-${item}`}
                  showsVerticalScrollIndicator={false}
                  initialScrollIndex={activeTime?.hours || 0}
                  getItemLayout={(data, index) => ({ length: 40, offset: 40 * index, index })}
                  renderItem={({ item }) => {
                    const isSelected = activeTime?.hours === item;
                    const isPM = item >= 12;
                    const hour12 = item % 12 || 12;
                    return (
                      <TouchableOpacity 
                        onPress={() => handleTimeChange(item, activeTime?.minutes || 0)}
                        className={`h-10 justify-center items-center ${isSelected ? 'bg-blue-500/30 rounded-lg' : ''}`}
                      >
                        <Text className={`text-lg ${isSelected ? 'text-blue-400 font-bold' : 'text-gray-400'}`}>
                          {hour12} <Text className="text-[10px] uppercase">{isPM ? 'PM' : 'AM'}</Text>
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>

              <Text className="text-white text-2xl mx-4 pb-2">:</Text>

              {/* Minutes Column (30 min granularity) */}
              <View className="h-40 w-16">
                <FlatList
                  data={[0, 30]}
                  keyExtractor={(item) => `m-${item}`}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => {
                    const isSelected = activeTime?.minutes === item;
                    return (
                      <TouchableOpacity 
                        onPress={() => handleTimeChange(activeTime?.hours || 0, item)}
                        className={`h-10 justify-center items-center mt-2 ${isSelected ? 'bg-blue-500/30 rounded-lg' : ''}`}
                      >
                        <Text className={`text-lg ${isSelected ? 'text-blue-400 font-bold' : 'text-gray-400'}`}>
                          {item === 0 ? '00' : '30'}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
