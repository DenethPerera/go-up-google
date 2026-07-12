import { fetchLocationById } from "@/features/locations/services/location.service";
import { LocationDocument } from "@/features/locations/types";

/**
 * Fetches a single location's full data by its MongoDB _id.
 * Delegates to the shared location.service to avoid duplicating Axios logic.
 *
 * @param id - MongoDB _id string (passed from the route param)
 */
export async function getLocationDetail(id: string): Promise<LocationDocument> {
  return fetchLocationById(id);
}
