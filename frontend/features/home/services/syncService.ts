import axiosInstance from "@/lib/axiosInstance";
import { PlatformKey } from "../types";

/**
 * Trigger a platform sync for a single platform.
 *
 * Calls POST /api/sync → returns 202 Accepted instantly.
 * The actual sync happens in the background worker.
 * The next pull-to-refresh on the home screen will show the result.
 */
export async function syncLocationToPlatform(
  locationId: string,
  platform: PlatformKey
): Promise<{ success: boolean; errorMessage?: string }> {
  try {
    await axiosInstance.post("/api/sync", {
      locationId,
      platforms: [platform],
    });
    // 202 = job enqueued successfully. UI stays in 'syncing' state
    // until the next data fetch shows the worker's result.
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      errorMessage: err?.response?.data?.message || err?.message || "Sync request failed",
    };
  }
}

/**
 * Trigger a platform sync for multiple platforms at once.
 *
 * Sends all platforms in a single POST /api/sync call.
 * The backend enqueues one BullMQ job per platform.
 */
export async function syncLocationToAllPlatforms(
  locationId: string,
  platforms: PlatformKey[]
): Promise<Record<string, { success: boolean; errorMessage?: string }>> {
  try {
    await axiosInstance.post("/api/sync", {
      locationId,
      platforms,
    });
    // All jobs enqueued — mark all as success (pending worker result)
    return Object.fromEntries(platforms.map((p) => [p, { success: true }]));
  } catch (err: any) {
    const msg = err?.response?.data?.message || err?.message || "Sync request failed";
    return Object.fromEntries(platforms.map((p) => [p, { success: false, errorMessage: msg }]));
  }
}