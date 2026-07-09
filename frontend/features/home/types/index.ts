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