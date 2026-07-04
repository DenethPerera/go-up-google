/**
 * (app)/index.tsx
 *
 * This route group is no longer used as the primary dashboard.
 * All authenticated screens live inside (tabs)/.
 * Redirect any direct navigations here to the tabs root.
 */
import { Redirect } from "expo-router";

export default function AppIndex() {
  return <Redirect href="/(tabs)" />;
}
