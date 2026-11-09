import { API, LIST } from "@web/constants/routes/common";

export const CSR_CERTIFICATE_ROUTES_BASE_URL =
  `${API}/csr_certificate` as const;

export const CSR_CERTIFICATE_ROUTES = {
  delete: (certificateId: string) =>
    `${CSR_CERTIFICATE_ROUTES_BASE_URL}/${certificateId}` as const,

  get: (certificateId: string) =>
    `${CSR_CERTIFICATE_ROUTES_BASE_URL}/${certificateId}` as const,

  listing: `${CSR_CERTIFICATE_ROUTES_BASE_URL}/${LIST}` as const,

  patch: (certificateId: string) =>
    `${CSR_CERTIFICATE_ROUTES_BASE_URL}/${certificateId}` as const,

  post: `${CSR_CERTIFICATE_ROUTES_BASE_URL}` as const,
} as const;
