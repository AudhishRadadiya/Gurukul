import { API, LIST } from "@web/constants/routes/common";

export const WHATSAPP_HISTORY_BASE_URL = `${API}/whatsapp_history` as const;

export const WHATSAPP_HISTORY_ROUTES = {
  listing: `${WHATSAPP_HISTORY_BASE_URL}/${LIST}` as const,
} as const;
