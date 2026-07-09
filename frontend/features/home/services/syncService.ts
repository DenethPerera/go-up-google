import { PlatformKey } from "../types";

export async function syncLocationToPlatform(
  locationId: string,
  platform: PlatformKey
): Promise<{ success: boolean; errorMessage?: string }> {
  await new Promise((r) => setTimeout(r, 900));
  const fail = platform === "bing" && Math.random() > 0.4;
  return fail ? { success: false, errorMessage: "Category mapping mismatch" } : { success: true };
}

export async function syncLocationToAllPlatforms(
  locationId: string,
  platforms: PlatformKey[]
): Promise<Record<string, { success: boolean; errorMessage?: string }>> {
  const entries = await Promise.all(
    platforms.map(async (p) => [p, await syncLocationToPlatform(locationId, p)] as const)
  );
  return Object.fromEntries(entries);
}