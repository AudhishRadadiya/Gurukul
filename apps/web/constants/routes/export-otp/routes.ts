import { API } from "@web/constants/routes/common";

export const EXPORT_OTP_BASE_URL = `${API}/export-otp` as const;

export const EXPORT_OTP_ROUTES = {
  send: `${EXPORT_OTP_BASE_URL}/send` as const,
} as const;
