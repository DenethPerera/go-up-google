import { useCallback, useEffect, useState } from "react";
import { BusinessLocation, HomeSummary } from "../types";
import { fetchHomeSummary, fetchRecentLocations } from "../services/homeService";

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
      const [summaryRes, locationsRes] = await Promise.all([
        fetchHomeSummary(),
        fetchRecentLocations(3),
      ]);
      setSummary(summaryRes);
      setLocations(locationsRes);
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