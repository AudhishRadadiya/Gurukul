import { API } from "@web/constants/routes/common";

export const IMPORT_DONATION_BASE_URL = `${API}/import_donation` as const;

export const IMPORT_DONATION_ROUTES = {
  post: `${IMPORT_DONATION_BASE_URL}` as const,
} as const;
