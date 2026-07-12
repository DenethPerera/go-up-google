// ─── Working Hours Types (GBP-compatible) ────────────────────────────────────

/**
 * Matches the Google Business Profile API `DayOfWeek` enum.
 * Used in `regularHours.periods[].openDay` / `closeDay`.
 */
export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

/**
 * 24-hour time value.
 * Stored as `{ hours: 0-23, minutes: 0 | 30 }` to match the
 * GBP API `TimeOfDay` object (`regularHours.periods[].openTime`).
 */
export interface GBPTime {
  hours: number;    // 0–23
  minutes: number;  // 0 or 30 (30-min granularity)
}

/**
 * One entry in the per-day working hours grid.
 * `isOpen: false` means the business is closed that day (period is omitted
 * from the GBP sync payload).
 */
export interface DaySchedule {
  isOpen: boolean;
  openTime: GBPTime;
  closeTime: GBPTime;
}

/**
 * Weekly hours map — stored in MongoDB and passed to GBP sync.
 *
 * Only days where `isOpen === true` will be included in the GBP
 * `regularHours.periods[]` array.
 *
 * Example:
 * ```json
 * {
 *   "MONDAY":  { "isOpen": true,  "openTime": { "hours": 9,  "minutes": 0  }, "closeTime": { "hours": 17, "minutes": 0  } },
 *   "TUESDAY": { "isOpen": true,  "openTime": { "hours": 9,  "minutes": 0  }, "closeTime": { "hours": 17, "minutes": 0  } },
 *   "SATURDAY":{ "isOpen": false, "openTime": { "hours": 9,  "minutes": 0  }, "closeTime": { "hours": 13, "minutes": 0  } }
 * }
 * ```
 */
export type WeeklyHours = Partial<Record<DayOfWeek, DaySchedule>>;

/**
 * GBP API period shape — produced by the `toGBPPeriods()` utility
 * when syncing to Google Business Profile.
 */
export interface GBPHoursPeriod {
  openDay:   DayOfWeek;
  closeDay:  DayOfWeek;
  openTime:  GBPTime;
  closeTime: GBPTime;
}

/**
 * Serializes a `WeeklyHours` object into the `regularHours.periods[]`
 * array expected by the GBP Business Information API v1.
 *
 * Closed days (`isOpen === false`) are excluded from the output.
 */
export function toGBPPeriods(hours: WeeklyHours): GBPHoursPeriod[] {
  return (Object.entries(hours) as [DayOfWeek, DaySchedule][])
    .filter(([, day]) => day.isOpen)
    .map(([dayName, day]) => ({
      openDay:   dayName,
      closeDay:  dayName,
      openTime:  day.openTime,
      closeTime: day.closeTime,
    }));
}

// ─── Form State ───────────────────────────────────────────────────────────────

export interface LocationFormState {
  name: string;
  address: string;
  contact: string;
  website: string;
  category: string;
  description: string;
  email: string;
  /** Structured weekly schedule — GBP-compatible, replaces the old plain string. */
  workingHours: WeeklyHours;
  latitude?: number;
  longitude?: number;
}

export interface SocialMediaState {
  facebook: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
}

export type LocationFormErrors = Partial<Record<keyof LocationFormState, string>>;

/**
 * Represents a photo picked by expo-image-picker.
 * `uri`  — local file URI (used for the preview thumbnail).
 * `type` — MIME type sent to the server.
 * `name` — filename used in FormData.
 */
export interface PhotoAsset {
  uri: string;
  type: string;
  name: string;
}

/**
 * Per-platform sync status entry, mirrors the backend syncStatus sub-document.
 */
export interface SyncStatusEntry {
  platform: string;
  state: 'idle' | 'syncing' | 'success' | 'failed';
  lastSyncedAt?: string;
  errorMessage?: string;
  externalId?: string;
}

/** The shape returned by a successful POST /api/locations */
export interface LocationDocument extends Omit<LocationFormState, 'workingHours'> {
  _id: string;
  workingHours: WeeklyHours;
  social: SocialMediaState;
  photos: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  syncStatus?: SyncStatusEntry[];
}