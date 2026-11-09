import { API, LIST } from "@web/constants/routes/common";
import type { FilType } from "@web/types/shared-types";

export const DONATION_ADDRESS_LIST_BASE_URL =
  `${API}/donation_address_list` as const;

const ADDRESS_BOOK_BASE_URL = `${API}/donation` as const;

export const DONATION_ADDRESS_LIST_ROUTES = {
  convert: () => `${DONATION_ADDRESS_LIST_BASE_URL}/convert` as const,

  listing: `${DONATION_ADDRESS_LIST_BASE_URL}` as const,

  multiIgnored: () => `${ADDRESS_BOOK_BASE_URL}/multi-ignored` as const,

  patch: (donationId: string) =>
    `${ADDRESS_BOOK_BASE_URL}/${donationId}/ignored` as const,

  post: (fileType: FilType) =>
    `${DONATION_ADDRESS_LIST_BASE_URL}/${LIST}/${fileType}` as const,
} as const;
