import { API, LIST } from "@web/constants/routes/common";

export const DRAFT_PAYMENT_BASE_URL = `${API}/temp-payment` as const;

export const DRAFT_PAYMENT_ROUTES = {
  listing: `${DRAFT_PAYMENT_BASE_URL}/${LIST}` as const,
} as const;
