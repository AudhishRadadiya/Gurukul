import { API } from "@web/constants/routes/common";

export const USER_LOGIN_REPORT_BASE_URL = `${API}/user/login_report` as const;

export const USER_LOGIN_REPORT_ROUTES = {
  listing: `${USER_LOGIN_REPORT_BASE_URL}`,
} as const;
