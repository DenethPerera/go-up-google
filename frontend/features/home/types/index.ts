import { LocationDocument } from "@/features/locations/types";

export type ApprovalStatus = "approved" | "pending" | "rejected";
export type SyncState = "idle" | "syncing" | "success" | "failed";
export type PlatformKey = "google" | "facebook" | "bing" | "yelp" | "appleMaps";

export interface PlatformSyncStatus {
  platform: PlatformKey;
  state: SyncState;
  lastSyncedAt?: string;
  errorMessage?: string;
}

export interface BusinessLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  coverImage?: string;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  platforms: PlatformSyncStatus[];
}

export interface HomeSummary {
  totalLocations: number;
  approved: number;
  pending: number;
  rejected: number;
  syncFailures: number;
}

// ─── Mapper ──────────────────────────────────────────────────────────────────

/** The three platforms currently shown in the UI. */
const ACTIVE_PLATFORMS: PlatformKey[] = ["google", "facebook", "bing"];

/**
 * Maps a backend `LocationDocument` to the home-screen `BusinessLocation` shape.
 *
 * `platforms` is built from real `syncStatus[]` data returned by the API.
 * Platforms that haven't been synced yet (no entry in syncStatus) default
 * to 'idle' state so the sync pills always render for all active platforms.
 */
export function toBusinessLocation(doc: LocationDocument): BusinessLocation {
  // Build a lookup of existing sync status entries from the backend
  const syncMap = new Map(
    (doc.syncStatus ?? []).map((s) => [s.platform, s])
  );

  // For each active platform, use the real state if it exists, otherwise 'idle'
  const platforms: PlatformSyncStatus[] = ACTIVE_PLATFORMS.map((platform) => {
    const entry = syncMap.get(platform);
    if (entry) {
      return {
        platform,
        state: entry.state as SyncState,
        lastSyncedAt: entry.lastSyncedAt,
        errorMessage: entry.errorMessage,
      };
    }
    // No sync entry yet — show as idle (ready to sync)
    return { platform, state: "idle" as SyncState };
  });

  return {
    id: doc._id,
    name: doc.name,
    address: doc.address,
    city: "",          // LocationDocument has no separate city field yet
    coverImage: doc.photos?.[0],
    approvalStatus: doc.status as ApprovalStatus,
    createdAt: doc.createdAt,
    platforms,
  };
}