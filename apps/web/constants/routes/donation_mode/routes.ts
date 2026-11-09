import { API, LIST, OPTION } from "@web/constants/routes/common";

export const DONATION_MODE_BASE_URL = `${API}/donation_mode` as const;

export const DONATION_MODE_ROUTES = {
  get: (donationModeId: string) =>
    `${DONATION_MODE_BASE_URL}/${donationModeId}` as const,

  listing: `${DONATION_MODE_BASE_URL}/${LIST}` as const,

  modeOfReceiptOptions:
    `${DONATION_MODE_BASE_URL}/${LIST}/${OPTION}/receipt` as const,

  patch: (donationModeId: string) =>
    `${DONATION_MODE_BASE_URL}/${donationModeId}` as const,

  post: `${DONATION_MODE_BASE_URL}` as const,

  userWiseOptions: (isUserWiseAll?: boolean) =>
    `${DONATION_MODE_BASE_URL}/${LIST}/${OPTION}/user-wise${isUserWiseAll ? "/all" : ""}` as const,
} as const;
