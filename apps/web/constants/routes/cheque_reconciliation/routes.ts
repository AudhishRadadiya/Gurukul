import { API, LIST } from "@web/constants/routes/common";
import type { FilType } from "@web/types/shared-types";

export const CHEQUE_RECONCILIATION_BASE_URL =
  `${API}/donation/cheque_reconciliation` as const;

export const CHEQUE_RECONCILIATION_ROUTES = {
  export: (fileType: FilType) =>
    `${CHEQUE_RECONCILIATION_BASE_URL}/${LIST}/${fileType}` as const,

  get: (donationId: string) =>
    `${CHEQUE_RECONCILIATION_BASE_URL}/${donationId}` as const,

  listing: `${CHEQUE_RECONCILIATION_BASE_URL}/${LIST}` as const,

  patch: (donationId: string) =>
    `${CHEQUE_RECONCILIATION_BASE_URL}/${donationId}` as const,
} as const;
