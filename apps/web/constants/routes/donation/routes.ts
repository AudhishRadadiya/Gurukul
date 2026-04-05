import type { GeneralModule } from "@web/components/common/Autocomplete/hooks/useGetGeneralOptions";
import { API, LIST } from "@web/constants/routes/common";
import type { FilType } from "@web/types/shared-types";

const DONATION_BASE_URL = `${API}/donation` as const;

export const DONATION_ROUTES = {
  cancelDonationEntry: (donationId: string) =>
    `${DONATION_BASE_URL}/${donationId}` as const,

  donationLetter: `${DONATION_BASE_URL}/donation_letter` as const,

  donationReceipt: `${DONATION_BASE_URL}/donation-receipt` as const,

  export: (fileType: FilType) =>
    `${DONATION_BASE_URL}/${LIST}/${fileType}` as const,

  get: (donationId: string) => `${DONATION_BASE_URL}/${donationId}` as const,

  getLatestReceiptNo: `${DONATION_BASE_URL}/receipt_no/sequence` as const,

  listing: `${DONATION_BASE_URL}/${LIST}` as const,

  options: (module: GeneralModule) =>
    `${DONATION_BASE_URL}/${LIST}/dynamic/${module}` as const,

  patch: (donationId: string) => `${DONATION_BASE_URL}/${donationId}` as const,

  post: `${DONATION_BASE_URL}` as const,

  previousContactDetail: (donationId: string) =>
    `${DONATION_BASE_URL}/contact-detail/${donationId}` as const,

  previousDonationDetail: `${DONATION_BASE_URL}/${LIST}/dynamic` as const,

  printAddress: `${DONATION_BASE_URL}/donation-address-pdf` as const,

  sendBulkMail: `${DONATION_BASE_URL}/${LIST}/send_email` as const,
} as const;

const EVENT_WISE_BASE_URL = `${DONATION_BASE_URL}/event-wise` as const;

export const EVENT_WISE_DONATION_ROUTES = {
  export: (fileType: FilType) =>
    `${EVENT_WISE_BASE_URL}/${LIST}/${fileType}` as const,

  listing: `${EVENT_WISE_BASE_URL}/${LIST}` as const,
} as const;
