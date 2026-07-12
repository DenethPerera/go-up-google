import axiosInstance from '@/lib/axiosInstance';
import { auth } from '@/config/firebase';
import { LocationDocument, PhotoAsset, WeeklyHours } from '../types';

export interface CreateLocationPayload {
  name: string;
  address: string;
  contact: string;
  website: string;
  category: string;
  description: string;
  email: string;
  workingHours: WeeklyHours;
  latitude?: number;
  longitude?: number;
  social: {
    facebook: string;
    instagram: string;
    tiktok: string;
    whatsapp: string;
  };
  photos: PhotoAsset[];
}


export const submitLocation = async (
  payload: CreateLocationPayload
): Promise<LocationDocument> => {
  const formData = new FormData();

  // ─── Text fields ──────────────────────────────────────────────────────────
  formData.append('name', payload.name);
  formData.append('address', payload.address);
  formData.append('contact', payload.contact);
  formData.append('website', payload.website);
  formData.append('category', payload.category);
  formData.append('description', payload.description);
  formData.append('email', payload.email);
  formData.append('workingHours', JSON.stringify(payload.workingHours));

  if (payload.latitude !== undefined && payload.latitude !== null) {
    formData.append('latitude', String(payload.latitude));
  }
  if (payload.longitude !== undefined && payload.longitude !== null) {
    formData.append('longitude', String(payload.longitude));
  }

  // Social is a nested object — serialize to JSON so multer can parse it
  formData.append('social', JSON.stringify(payload.social));

  // ─── Photo files ──────────────────────────────────────────────────────────
  payload.photos.forEach((photo) => {
    // React Native's FormData accepts this object shape natively
    formData.append('photos', {
      uri: photo.uri,
      type: photo.type,
      name: photo.name,
    } as any);
  });

  // ─── Use fetch() for multipart, not Axios ────────────────────────────────
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
  const url = `${BASE_URL}/api/locations`;
  
  console.log('[submitLocation] Calling:', url);

  // Get current session Firebase ID Token if logged in
  const headers: Record<string, string> = {};
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const idToken = await currentUser.getIdToken(false);
      headers['Authorization'] = `Bearer ${idToken}`;
    }
  } catch (tokenErr) {
    console.warn('[submitLocation] Failed to get ID token:', tokenErr);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers,
      // Do NOT set Content-Type manually — fetch sets it with the correct
      // multipart boundary automatically when body is a FormData object.
    });
  } catch (networkErr: any) {
    console.error('[submitLocation] Network layer failed:', networkErr?.message);
    throw new Error(
      `Network Request Failed.\n\nOriginal error: ${networkErr?.message}`
    );
  }

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message ?? `Server error: ${response.status}`);
  }

  return json.data as LocationDocument;
};

/**
 * GET /api/locations
 */
export const fetchLocations = async (): Promise<LocationDocument[]> => {
  const response = await axiosInstance.get<{
    success: boolean;
    count: number;
    data: LocationDocument[];
  }>('/api/locations');
  return response.data.data;
};

/**
 * GET /api/locations/:id
 */
export const fetchLocationById = async (id: string): Promise<LocationDocument> => {
  const response = await axiosInstance.get<{ success: boolean; data: LocationDocument }>(
    `/api/locations/${id}`
  );
  return response.data.data;
};
