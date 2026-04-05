import { API, LIST } from "@web/constants/routes/common";

export const WEB_BANNER_BASE_URL = `${API}/web-banner` as const;

export const WEB_BANNER_ROUTES = {
  delete: (bannerId: string) => `${WEB_BANNER_BASE_URL}/${bannerId}` as const,

  get: (bannerId: string) => `${WEB_BANNER_BASE_URL}/${bannerId}` as const,

  listing: `${WEB_BANNER_BASE_URL}/${LIST}`,

  patch: (bannerId: string) => `${WEB_BANNER_BASE_URL}/${bannerId}` as const,

  post: WEB_BANNER_BASE_URL,
} as const;
