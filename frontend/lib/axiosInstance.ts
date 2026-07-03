import axios from 'axios';

/**
 * Single Axios instance for the entire app.
 *
 * Base URL is read from EXPO_PUBLIC_API_BASE_URL in .env.
 * On a real device/emulator, this must be your machine's LAN IP, not localhost.
 * Example: http://192.168.1.100:5000
 *
 * EXPO_PUBLIC_* variables are injected by Expo at bundle time via process.env.
 */
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

// Log on module load — visible in Metro console on startup
console.log('[axiosInstance] baseURL =', BASE_URL || '⚠️  EXPO_PUBLIC_API_BASE_URL is not set!');

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attach auth tokens here in the future (e.g. Firebase ID token).
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} → ${config.baseURL}${config.url}`);
    // const token = getToken(); // placeholder for future auth
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Unwrap the `data` envelope so callers get the payload directly.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log full details to Metro console to help debugging
    console.error('[API ERROR]', {
      code: error.code,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    const message =
      error.response?.data?.message ?? error.message ?? 'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
