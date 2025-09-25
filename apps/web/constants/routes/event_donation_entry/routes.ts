import { API, LIST } from "@web/constants/routes/common";
import type { FilType } from "@web/types/shared-types";

export const EVENT_MASTER_ROUTES_BASE_URL = `${API}/event_master` as const;

export const EVENT_DONATION_ENTRY_BASE_URL =
  `${EVENT_MASTER_ROUTES_BASE_URL}/event-donation-entry` as const;

export const EVENT_DONATION_ENTRY_ROUTES = {
  delete: (eventDonationId: string) =>
    `${EVENT_DONATION_ENTRY_BASE_URL}/${eventDonationId}` as const,

  donationReceiptEntryDetail:
    `${EVENT_DONATION_ENTRY_BASE_URL}/${LIST}` as const,

  donationReceiptListing:
    `${EVENT_DONATION_ENTRY_BASE_URL}/donation/${LIST}` as const,

  export: (fileType: FilType) =>
    `${EVENT_DONATION_ENTRY_BASE_URL}/${LIST}/${fileType}` as const,

  get: (eventDonationId: string) =>
    `${EVENT_DONATION_ENTRY_BASE_URL}/${eventDonationId}` as const,

  listing: `${EVENT_DONATION_ENTRY_BASE_URL}/${LIST}` as const,

  patch: (eventDonationId: string) =>
    `${EVENT_DONATION_ENTRY_BASE_URL}/${eventDonationId}` as const,

  post: `${EVENT_DONATION_ENTRY_BASE_URL}` as const,
} as const;
