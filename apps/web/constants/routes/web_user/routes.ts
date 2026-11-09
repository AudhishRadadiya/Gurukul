import { API, LIST } from "@web/constants/routes/common";

export const USER_BASE_URL = `${API}/web_user` as const;

export const WEB_USER_ROUTES = {
  delete: (webUserId: string) => `${USER_BASE_URL}/${webUserId}`,

  get: (webUserId: string) => `${USER_BASE_URL}/${webUserId}`,

  listing: `${USER_BASE_URL}/${LIST}`,

  patch: (webUserId: string) => `${USER_BASE_URL}/${webUserId}`,

  post: `${USER_BASE_URL}`,
} as const;
