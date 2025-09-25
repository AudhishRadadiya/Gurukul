import { API, LIST } from "@web/constants/routes/common";
import type { FilType } from "@web/types/shared-types";

export const DONATION_SUMMARY_BASE_URL = `${API}/donation_summary` as const;

export const DONATION_SUMMARY_ROUTES = {
  export: (fileType: FilType) =>
    `${DONATION_SUMMARY_BASE_URL}/${LIST}/${fileType}` as const,

  listing: `${DONATION_SUMMARY_BASE_URL}/${LIST}` as const,
} as const;
