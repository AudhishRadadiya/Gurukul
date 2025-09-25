import { API, LIST } from "@web/constants/routes/common";

export const CANCEL_RECEIPT_BASE_URL = `${API}/cancel_receipt` as const;

export const GENERATE_RECEIPT_BASE_URL = `${API}/donation/receipt_no` as const;

export const CANCEL_RECEIPT_ROUTES = {
  generateReceiptNumber: `${GENERATE_RECEIPT_BASE_URL}` as const,

  listing: `${CANCEL_RECEIPT_BASE_URL}/${LIST}` as const,

  post: `${CANCEL_RECEIPT_BASE_URL}` as const,
} as const;
