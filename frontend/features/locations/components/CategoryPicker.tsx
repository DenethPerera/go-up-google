import { Feather } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCategories } from "../hooks/useCategories";
import { Category } from "../services/category.service";

// ─── Skeleton placeholder (shown on initial load) ───────────────────────────

function CategorySkeleton() {
  return (
    <View className="px-5 py-3.5 border-b border-white/5">
      <View className="h-4 w-3/4 rounded-md " />
    </View>
  );
}

// ─── Footer shown at the bottom of the list while fetching next page ─────────

function ListFooter({
  isFetchingNextPage,
}: {
  isFetchingNextPage: boolean;
}) {
  if (!isFetchingNextPage) return null;
  return (
    <View className="items-center py-4">
      <ActivityIndicator size="small" color="#60a5fa" />
    </View>
  );
}

// ─── Empty / error states ────────────────────────────────────────────────────

function EmptyState({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}) {
  if (error) {
    return (
      <View className="items-center py-10 px-6">
        <Feather name="wifi-off" size={28} color="#6b7280" />
        <Text className="mt-2 text-sm text-center text-muted-foreground">
          Failed to load categories.
        </Text>
        <TouchableOpacity
          onPress={onRetry}
          activeOpacity={0.8}
          className="mt-3 px-4 py-2 rounded-lg bg-blue-500/30 border border-blue-400/40"
        >
          <Text className="text-sm text-blue-400 font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="items-center py-10">
      <Feather name="search" size={28} color="#6b7280" />
      <Text className="mt-2 text-sm text-muted-foreground">
        No categories found
      </Text>
    </View>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

interface CategoryPickerProps {
  /** The currently selected category `value` string (GBP slug) */
  value: string;
  /** Emits the selected category's `value` field (GBP slug) */
  onChange: (categoryValue: string) => void;
  error?: string;
}

export function CategoryPicker({ value, onChange, error }: CategoryPickerProps) {
  const [modalVisible, setModalVisible]   = useState(false);
  const [searchQuery,  setSearchQuery]    = useState("");
  /** The label to display in the trigger button (resolved from server data) */
  const [selectedLabel, setSelectedLabel] = useState("");

  const insets = useSafeAreaInsets();

  const {
    categories,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error: fetchError,
    fetchNextPage,
    refetch,
  } = useCategories(modalVisible ? searchQuery : "");
  // Only run the query while the modal is open — saves bandwidth when closed.

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleOpen = useCallback(() => {
    setSearchQuery("");
    setModalVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setModalVisible(false);
    setSearchQuery("");
  }, []);

  const handleSelect = useCallback(
    (item: Category) => {
      onChange(item.value);
      setSelectedLabel(item.label);
      handleClose();
    },
    [onChange, handleClose]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ── Render helpers ────────────────────────────────────────────────────────

  const renderItem = useCallback(
    ({ item }: { item: Category }) => {
      const selected = item.value === value;
      return (
        <TouchableOpacity
          onPress={() => handleSelect(item)}
          activeOpacity={0.7}
          className={[
            "flex-row items-center justify-between px-5 py-3.5 border-b border-white/5",
            selected ? "bg-blue-500/20" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <Text
            className={`flex-1 text-sm pr-3 ${
              selected ? "font-semibold text-blue-400" : "text-foreground"
            }`}
            numberOfLines={1}
          >
            {item.label}
          </Text>
          {selected && <Feather name="check" size={15} color="#60a5fa" />}
        </TouchableOpacity>
      );
    },
    [value, handleSelect]
  );

  // Skeleton rows while the first page is loading
  const skeletonData = Array.from({ length: 10 }, (_, i) => ({ _id: `sk-${i}` }));

  // ── UI ────────────────────────────────────────────────────────────────────

  return (
    <View className="mb-4">
      <Text className="input-label">Business Category</Text>

      {/* ── Trigger button ── */}
      <TouchableOpacity
        onPress={handleOpen}
        activeOpacity={0.8}
        className={[
          "input-field flex-row items-center justify-between",
          error ? "border-destructive" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Text
          className={
            selectedLabel || value
              ? "flex-1 text-sm text-foreground"
              : "flex-1 text-sm text-[#C7D3EA]"
          }
          numberOfLines={1}
        >
          {selectedLabel || value || "Select a Google Business category"}
        </Text>
        <Feather name="chevron-down" size={16} color="#C7D3EA" />
      </TouchableOpacity>

      {error ? <Text className="error-text">{error}</Text> : null}

      {/* ── Picker modal ── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleClose}
      >
        <Pressable onPress={handleClose} className="flex-1 bg-black/50">
          {/* Inner sheet — taps don't bubble through to the backdrop */}
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{ paddingBottom: insets.bottom }}
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-[#1A2441] border border-white/10 overflow-hidden"
          >
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-white/10">
              <Text className="text-base font-bold text-foreground">
                Select Category
              </Text>
              <TouchableOpacity onPress={handleClose} hitSlop={12}>
                <Feather name="x" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Search bar */}
            <View className="px-4 pt-3 pb-2">
              <View className="flex-row items-center rounded-xl border border-white/20 bg-white/5 px-3">
                <Feather name="search" size={15} color="#9ca3af" />
                <TextInput
                  className="ml-2 flex-1 py-2.5 text-sm text-foreground"
                  placeholder="Search 4000+ categories…"
                  placeholderTextColor="#9ca3af"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                  returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchQuery("")}
                    hitSlop={8}
                  >
                    <Feather name="x-circle" size={15} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Result count badge */}
            {!isLoading && !fetchError && (
              <View className="px-5 pb-1">
                <Text className="text-xs text-muted-foreground">
                  {categories.length > 0
                    ? `Showing ${categories.length} result${categories.length !== 1 ? "s" : ""}${
                        hasNextPage ? " — scroll for more" : ""
                      }`
                    : ""}
                </Text>
              </View>
            )}

            {/* Category list */}
            {isLoading ? (
              // Skeleton shimmer on initial load
              <FlatList
                data={skeletonData}
                keyExtractor={(item) => item._id}
                style={{ maxHeight: 400 }}
                showsVerticalScrollIndicator={false}
                renderItem={() => <CategorySkeleton />}
              />
            ) : (
              <FlatList
                data={categories}
                keyExtractor={(item) => item._id}
                style={{ maxHeight: 400 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                removeClippedSubviews
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.2}
                renderItem={renderItem}
                ListFooterComponent={
                  <ListFooter isFetchingNextPage={isFetchingNextPage} />
                }
                ListEmptyComponent={
                  <EmptyState error={fetchError} onRetry={refetch} />
                }
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
