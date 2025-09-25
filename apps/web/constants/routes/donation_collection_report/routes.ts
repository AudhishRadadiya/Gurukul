import { API, LIST } from "@web/constants/routes/common";
import type { FilType } from "@web/types/shared-types";

export const DONATION_COLLECTION_REPORT_BASE_URL =
  `${API}/donation_collection_report` as const;

export const DONATION_COLLECTION_REPORT_ROUTES = {
  export: (fileType: FilType) =>
    `${DONATION_COLLECTION_REPORT_BASE_URL}/${LIST}/${fileType}` as const,

  getCurrencyDetail: (dailyDonationId: string) =>
    `${DONATION_COLLECTION_REPORT_BASE_URL}/${dailyDonationId}` as const,

  listing: `${DONATION_COLLECTION_REPORT_BASE_URL}/${LIST}` as const,

  patch: (dailyDonationId: string) =>
    `${DONATION_COLLECTION_REPORT_BASE_URL}/${dailyDonationId}` as const,
} as const;
