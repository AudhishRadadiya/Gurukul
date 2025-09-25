import type { FilType } from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useGetDonorAddressExport";
import type { Status } from "@web/components/common/Autocomplete/hooks/useGetStatusOptions";
import { API, LIST } from "@web/constants/routes/common";

export const DONATION_ADDRESS_LIST_BASE_URL =
  `${API}/donation_address_list` as const;

const ADDRESS_BOOK_BASE_URL = `${API}/address_book` as const;

export const DONATION_ADDRESS_LIST_ROUTES = {
  listing: (status: Status) =>
    `${DONATION_ADDRESS_LIST_BASE_URL}?status=${status}` as const,

  multiIgnored: () => `${ADDRESS_BOOK_BASE_URL}/multi-ignored` as const,

  patch: (donationId: string) =>
    `${ADDRESS_BOOK_BASE_URL}/${donationId}/ignored` as const,

  post: (status: Status, fileType: FilType) =>
    `${DONATION_ADDRESS_LIST_BASE_URL}/${LIST}/${fileType}?status=${status}` as const,
} as const;
