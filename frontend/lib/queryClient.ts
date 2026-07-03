import { QueryClient } from '@tanstack/react-query';

/**
 * Singleton QueryClient shared across the whole app.
 * Tuned for a mobile UX: short stale-time, aggressive garbage collection,
 * and no automatic retries on mutation failures (mutations retry manually).
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 minutes — data stays fresh
      gcTime: 1000 * 60 * 10,     // 10 minutes — then evicted from cache
      retry: 2,                    // retry failed queries twice
      refetchOnWindowFocus: false, // not meaningful in React Native
    },
    mutations: {
      retry: 0, // mutations should not auto-retry
    },
  },
});

export default queryClient;
