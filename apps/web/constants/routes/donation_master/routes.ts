import { API, LIST, OPTION } from "@web/constants/routes/common";

export const DONATION_MASTER_BASE_URL = `${API}/donation_master` as const;

export const DONATION_MASTER_ROUTES = {
  delete: (donationMasterId: string) =>
    `${DONATION_MASTER_BASE_URL}/${donationMasterId}` as const,

  get: (donationMasterId: string) =>
    `${DONATION_MASTER_BASE_URL}/${donationMasterId}` as const,

  listing: `${DONATION_MASTER_BASE_URL}/${LIST}` as const,

  options: `${DONATION_MASTER_BASE_URL}/${LIST}/${OPTION}` as const,

  patch: (donationMasterId: string) =>
    `${DONATION_MASTER_BASE_URL}/${donationMasterId}` as const,

  post: `${DONATION_MASTER_BASE_URL}` as const,
} as const;
