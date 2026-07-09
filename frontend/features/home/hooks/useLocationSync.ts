import { useState } from "react";
import { BusinessLocation, PlatformKey, SyncState } from "../types";
import { syncLocationToAllPlatforms, syncLocationToPlatform } from "../services/syncService";
import { ACTIVE_PLATFORMS } from "../constants/platforms";

export function useLocationSync(location: BusinessLocation, onUpdate: (updated: BusinessLocation) => void) {
  const [syncingAll, setSyncingAll] = useState(false);

  const setPlatformState = (platform: PlatformKey, state: SyncState, errorMessage?: string) => {
    onUpdate({
      ...location,
      platforms: location.platforms.map((p) =>
        p.platform === platform
          ? { ...p, state, errorMessage, lastSyncedAt: state === "success" ? new Date().toISOString() : p.lastSyncedAt }
          : p
      ),
    });
  };

  const syncOne = async (platform: PlatformKey) => {
    setPlatformState(platform, "syncing");
    const result = await syncLocationToPlatform(location.id, platform);
    setPlatformState(platform, result.success ? "success" : "failed", result.errorMessage);
  };

  const syncAll = async () => {
    setSyncingAll(true);
    ACTIVE_PLATFORMS.forEach((p) => setPlatformState(p, "syncing"));
    const results = await syncLocationToAllPlatforms(location.id, ACTIVE_PLATFORMS);
    ACTIVE_PLATFORMS.forEach((p) => setPlatformState(p, results[p].success ? "success" : "failed", results[p].errorMessage));
    setSyncingAll(false);
  };

  return { syncOne, syncAll, syncingAll };
}