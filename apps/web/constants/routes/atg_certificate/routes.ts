import { API, LIST } from "@web/constants/routes/common";

export const ATG_CERTIFICATE_ROUTES_BASE_URL =
  `${API}/atg_certificate` as const;

export const ATG_CERTIFICATE_ROUTES = {
  delete: (certificateId: string) =>
    `${ATG_CERTIFICATE_ROUTES_BASE_URL}/${certificateId}` as const,

  get: (certificateId: string) =>
    `${ATG_CERTIFICATE_ROUTES_BASE_URL}/${certificateId}`,

  listing: `${ATG_CERTIFICATE_ROUTES_BASE_URL}/${LIST}` as const,

  patch: (certificateId: string) =>
    `${ATG_CERTIFICATE_ROUTES_BASE_URL}/${certificateId}` as const,

  post: `${ATG_CERTIFICATE_ROUTES_BASE_URL}` as const,
} as const;
