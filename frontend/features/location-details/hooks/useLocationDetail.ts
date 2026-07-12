import { useCallback, useEffect, useState } from "react";
import { LocationDocument } from "@/features/locations/types";
import { getLocationDetail } from "../services/locationDetailService";

interface UseLocationDetailResult {
  location: LocationDocument | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Fetches and caches the full LocationDocument for a given id.
 *
 * - Loads on mount.
 * - Exposes `refresh()` for pull-to-refresh.
 * - Error messages are user-friendly; raw errors are only logged.
 */
export function useLocationDetail(id: string): UseLocationDetailResult {
  const [location, setLocation] = useState<LocationDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (isRefresh = false) => {
      if (!id) return;
      try {
        isRefresh ? setIsRefreshing(true) : setIsLoading(true);
        setError(null);
        const data = await getLocationDetail(id);
        setLocation(data);
      } catch (e: any) {
        console.error("[useLocationDetail] Failed to load location:", e?.message);
        setError("Couldn't load location details. Pull down to try again.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [id]
  );

  useEffect(() => {
    load();
  }, [load]);

  return {
    location,
    isLoading,
    isRefreshing,
    error,
    refresh: () => load(true),
  };
}
