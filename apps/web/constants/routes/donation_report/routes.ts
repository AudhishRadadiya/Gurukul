import { API } from "@web/constants/routes/common";

export const DONATION_REPORT_BASE_URL = `${API}/donation_report` as const;

export const DONATION_REPORT_ROUTES = {
  post: `${DONATION_REPORT_BASE_URL}` as const,
} as const;
