import { BusinessLocation, HomeSummary } from "../types";

// TODO: replace with real API calls (e.g. axios instance from services/api.ts)
const MOCK_LOCATIONS: BusinessLocation[] = [
  {
    id: "loc_1",
    name: "Cinnamon Grand Bakery",
    address: "No 42, Galle Road",
    city: "Colombo 03",
    coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300",
    approvalStatus: "approved",
    createdAt: "2026-07-02T09:12:00Z",
    platforms: [
      { platform: "google", state: "success", lastSyncedAt: "2026-07-04T10:00:00Z" },
      { platform: "facebook", state: "success", lastSyncedAt: "2026-07-04T10:01:00Z" },
      { platform: "bing", state: "failed", errorMessage: "Invalid business category" },
    ],
  },
  {
    id: "loc_2",
    name: "Kandy Spice Garden",
    address: "18 Peradeniya Road",
    city: "Kandy",
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300",
    approvalStatus: "pending",
    createdAt: "2026-07-03T14:30:00Z",
    platforms: [
      { platform: "google", state: "idle" },
      { platform: "facebook", state: "idle" },
      { platform: "bing", state: "idle" },
    ],
  },
  {
    id: "loc_3",
    name: "Galle Fort Coffee Co.",
    address: "23 Church Street",
    city: "Galle",
    coverImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300",
    approvalStatus: "rejected",
    createdAt: "2026-07-01T08:00:00Z",
    platforms: [
      { platform: "google", state: "failed", errorMessage: "Duplicate listing found" },
      { platform: "facebook", state: "idle" },
      { platform: "bing", state: "idle" },
    ],
  },
];

export async function fetchRecentLocations(limit = 3): Promise<BusinessLocation[]> {
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_LOCATIONS.slice(0, limit);
}

export async function fetchHomeSummary(): Promise<HomeSummary> {
  await new Promise((r) => setTimeout(r, 300));
  return { totalLocations: 12, approved: 8, pending: 3, rejected: 1, syncFailures: 2 };
}

export async function deleteLocation(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
}