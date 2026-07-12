import { useCallback, useEffect, useState } from "react";
import { BusinessLocation, HomeSummary, toBusinessLocation } from "../types";
import { fetchHomeSummary, fetchRecentLocations } from "../services/homeService";
import { fetchLocations } from "@/features/locations/services/location.service";

export function useHomeData() {
  const [summary, setSummary] = useState<HomeSummary | null>(null);
  const [locations, setLocations] = useState<BusinessLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setIsRefreshing(true) : setIsLoading(true);
      setError(null);

      // ── Single network call — no N+1, no race condition ──────────────────
      const docs = await fetchLocations();

      const approved = docs.filter((d) => d.status === "approved").length;
      const pending   = docs.filter((d) => d.status === "pending").length;
      const rejected  = docs.filter((d) => d.status === "rejected").length;

      setSummary({
        totalLocations: docs.length,
        approved,
        pending,
        rejected,
        syncFailures: 0, // deferred until platform sync is implemented
      });

      // Show the 3 most recent for the home screen preview
      setLocations(docs.slice(0, 3).map(toBusinessLocation));
    } catch (e) {
      setError("Couldn't load your dashboard. Pull down to try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateLocation = useCallback((updated: BusinessLocation) => {
    setLocations((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  }, []);

  const removeLocation = useCallback((id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return { summary, locations, isLoading, isRefreshing, error, refresh: () => load(true), updateLocation, removeLocation };
}