import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { fetchCategories, Category } from '../services/category.service';

// ─── Constants ────────────────────────────────────────────────────────────────

const DEBOUNCE_MS   = 300;   // ms to wait after keystroke before firing query
const STALE_TIME_MS = 10 * 60 * 1000;  // 10 minutes — categories rarely change
const GC_TIME_MS    = 30 * 60 * 1000;  // 30 minutes garbage-collect window
const PAGE_SIZE     = 30;

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseCategoriesReturn {
  /** Flat list of all loaded Category items across all fetched pages */
  categories: Category[];
  /** True while the very first page is loading (initial render skeleton) */
  isLoading: boolean;
  /** True while any subsequent page is being fetched */
  isFetchingNextPage: boolean;
  /** True if there are more pages available */
  hasNextPage: boolean;
  /** Any error thrown during fetching */
  error: Error | null;
  /** Call this when the FlatList reaches the end */
  fetchNextPage: () => void;
  /** Re-trigger the query from scratch (e.g. after an error) */
  refetch: () => void;
}

/**
 * `useCategories` — TanStack Query infinite hook for the category picker.
 *
 * Features:
 *  - 300 ms debounce on `searchQuery` — no request per keystroke.
 *  - Cursor-based infinite pagination (page number).
 *  - Each unique search term is independently cached for 10 minutes.
 *  - `fetchNextPage` is a no-op when `hasNextPage` is false.
 *
 * @param searchQuery — raw text from the search input (not debounced yet)
 */
export function useCategories(searchQuery: string): UseCategoriesReturn {
  // ── Debounce the search query ─────────────────────────────────────────────
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQuery(searchQuery), DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [searchQuery]);

  // ── Infinite query ────────────────────────────────────────────────────────
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['categories', debouncedQuery] as const,

    queryFn: ({ pageParam }) =>
      fetchCategories({ q: debouncedQuery, page: pageParam as number, limit: PAGE_SIZE }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,

    staleTime: STALE_TIME_MS,
    gcTime:    GC_TIME_MS,

    // Don't hammer the server with retries if a search fails
    retry: 1,
  });

  // ── Flatten pages into a single array ────────────────────────────────────
  const categories: Category[] = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    categories,
    isLoading,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    error: error as Error | null,
    fetchNextPage,
    refetch,
  };
}
