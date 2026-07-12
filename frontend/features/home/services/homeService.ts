import axiosInstance from "@/lib/axiosInstance";
import { fetchLocations } from "@/features/locations/services/location.service";
import { BusinessLocation, HomeSummary, toBusinessLocation } from "../types";

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetches the `limit` most-recent locations from the backend.
 *
 * A single GET /api/locations call is made (the backend already sorts
 * newest-first). The mapper `toBusinessLocation` converts the full
 * LocationDocument into the lightweight BusinessLocation card shape.
 *
 * Query optimisation note: we fetch ALL user locations here (the backend
 * returns only the authenticated user's documents). Slicing on the client
 * avoids a separate "recent" endpoint while reusing the same response
 * payload that fetchHomeSummary also consumes.
 */
export async function fetchRecentLocations(limit = 3): Promise<BusinessLocation[]> {
  const docs = await fetchLocations();
  return docs.slice(0, limit).map(toBusinessLocation);
}

/**
 * Derives the HomeSummary from the full locations list.
 *
 * Single network call shared with fetchRecentLocations — no extra endpoint
 * needed. syncFailures is always 0 until platform sync is implemented.
 */
export async function fetchHomeSummary(): Promise<HomeSummary> {
  const docs = await fetchLocations();

  const approved = docs.filter((d) => d.status === "approved").length;
  const pending   = docs.filter((d) => d.status === "pending").length;
  const rejected  = docs.filter((d) => d.status === "rejected").length;

  return {
    totalLocations: docs.length,
    approved,
    pending,
    rejected,
    syncFailures: 0, // platform sync not yet implemented
  };
}

/**
 * Deletes a location by id.
 * Calls DELETE /api/locations/:id — auth token is attached automatically
 * by the axiosInstance request interceptor.
 */
export async function deleteLocation(id: string): Promise<void> {
  await axiosInstance.delete(`/api/locations/${id}`);
}