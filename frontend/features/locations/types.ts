export interface LocationFormState {
  name: string;
  address: string;
  contact: string;
  website: string;
  category: string;
  description: string;
  email: string;
  workingHours: string;
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

/** The shape returned by a successful POST /api/locations */
export interface LocationDocument extends LocationFormState {
  _id: string;
  social: SocialMediaState;
  photos: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}