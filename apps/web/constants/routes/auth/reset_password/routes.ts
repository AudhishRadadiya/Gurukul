import { AUTH_BASE_URL } from "@web/constants/routes/auth/routes";

export const RESET_PASSWORD_BASE_URL =
  `${AUTH_BASE_URL}/reset_password` as const;

export const RESET_PASSWORD_ROUTES = {
  post: `${RESET_PASSWORD_BASE_URL}`,
} as const;
