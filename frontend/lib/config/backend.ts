import { getApiBaseUrl, normalizeApiBaseUrl } from './api-url';

const configuredApiBaseUrl = normalizeApiBaseUrl(
  import.meta.env.NUXT_PUBLIC_API_BASE_URL as string | undefined,
);

export { getApiBaseUrl };

/** SSR / server-side default. Client code should call apiBaseUrl(). */
export const API_BASE_URL = configuredApiBaseUrl;

export function apiBaseUrl(): string {
  return getApiBaseUrl(configuredApiBaseUrl);
}
