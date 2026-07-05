import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import MapView, { Marker, MapPressEvent, Region } from "react-native-maps";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";
import { ICON_COLORS } from "../constants";
import { SectionCard } from "./SectionCard";

interface MapLocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (latitude: number, longitude: number, address?: string) => void;
}

// Default center: Colombo, Sri Lanka (representing Construction ERP root context)
const DEFAULT_LATITUDE = 6.9271;
const DEFAULT_LONGITUDE = 79.8612;

export function MapLocationPicker({ latitude, longitude, onLocationChange }: MapLocationPickerProps) {
  const mapRef = useRef<MapView | null>(null);
  const [loading, setLoading] = useState(false);
  const [reverseGeocoding, setReverseGeocoding] = useState(false);

  // Initialize region based on passed-in coords, otherwise fallback to Colombo
  const [region, setRegion] = useState<Region>({
    latitude: latitude || DEFAULT_LATITUDE,
    longitude: longitude || DEFAULT_LONGITUDE,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  // Track map region sync if coordinates change externally
  useEffect(() => {
    if (latitude && longitude) {
      setRegion((prev) => ({
        ...prev,
        latitude,
        longitude,
      }));
    }
  }, [latitude, longitude]);

  // Helper to reverse geocode and obtain a friendly address string
  const handleLocationUpdate = async (lat: number, lng: number) => {
    setReverseGeocoding(true);
    let addressStr: string | undefined = undefined;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lng,
        });

        if (reverseGeocode && reverseGeocode.length > 0) {
          const addr = reverseGeocode[0];
          // Construct formatted address: e.g. "123 Galle Road, Colombo, Sri Lanka"
          const streetInfo = [addr.streetNumber, addr.street].filter(Boolean).join(" ");
          const locationParts = [
            streetInfo,
            addr.district || addr.subregion,
            addr.city,
            addr.region,
            addr.country,
          ].filter(Boolean);
          addressStr = locationParts.join(", ");
        }
      }
    } catch (err) {
      console.warn("[MapLocationPicker] Reverse geocode failed:", err);
    } finally {
      setReverseGeocoding(false);
      onLocationChange(lat, lng, addressStr);
    }
  };

  // Get current device GPS location
  const locateMe = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Location access is needed to find your current coordinate. Please enable GPS location services in your device settings."
        );
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newRegion = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 800);
      await handleLocationUpdate(loc.coords.latitude, loc.coords.longitude);
    } catch (err: any) {
      Alert.alert("GPS Error", err?.message || "Failed to determine current location.");
    } finally {
      setLoading(false);
    }
  };

  const handleMapPress = async (e: MapPressEvent) => {
    const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
    await handleLocationUpdate(lat, lng);
  };

  return (
    <SectionCard
      icon={<Feather name="map-pin" size={16} color={ICON_COLORS.primary} />}
      title="Business Map Location"
      subtitle="Mark where your business is physically located on the map"
    >
      <View className="relative w-full rounded-2xl overflow-hidden border border-border bg-muted/20">
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onRegionChangeComplete={(r) => setRegion(r)}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {latitude && longitude ? (
            <Marker
              coordinate={{ latitude, longitude }}
              draggable
              onDragEnd={async (e) => {
                const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
                await handleLocationUpdate(lat, lng);
              }}
              title="Business Location"
              description="Hold and drag to refine positioning"
            />
          ) : null}
        </MapView>

        {/* Locate Me Overlay Button */}
        <TouchableOpacity
          onPress={locateMe}
          activeOpacity={0.8}
          className="absolute right-3 bottom-3 flex-row items-center justify-center h-10 w-10 rounded-full bg-primary shadow-lg border border-white/10"
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Feather name="crosshair" size={18} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Coordinate Metadata display */}
      <View className="mt-3 flex-row items-center justify-between rounded-xl bg-muted/40 p-3 border border-border/50">
        <View className="flex-1">
          <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            GPS Coordinates
          </Text>
          {latitude && longitude ? (
            <Text className="text-sm font-semibold text-foreground mt-0.5" numberOfLines={1}>
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </Text>
          ) : (
            <Text className="text-sm text-muted-foreground italic mt-0.5">
              Not marked. Tap on the map or click Locate Me.
            </Text>
          )}
        </View>

        {reverseGeocoding && (
          <View className="flex-row items-center mr-1">
            <ActivityIndicator size="small" color={ICON_COLORS.primary} className="mr-1.5" />
            <Text className="text-xs text-muted-foreground">Syncing address...</Text>
          </View>
        )}

        {latitude && longitude && !reverseGeocoding && (
          <View className="rounded-full bg-emerald-500/10 px-2 py-1 flex-row items-center border border-emerald-500/20">
            <Feather name="check" size={12} color="#10b981" />
            <Text className="text-[11px] font-bold text-emerald-500 ml-1">Pinned</Text>
          </View>
        )}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 220,
    width: "100%",
  },
});
