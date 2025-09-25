import { API, LIST } from "@web/constants/routes/common";
import { USER_BASE_URL } from "@web/constants/routes/user/routes";

export const USER_PERMISSIONS_BASE_URL =
  `${USER_BASE_URL}/permissions` as const;

export const USER_PERMISSIONS_ROUTES = {
  get: (userId: string) => `${USER_PERMISSIONS_BASE_URL}/${userId}` as const,

  getPermissionModules: `${API}/permissions` as const,

  listing: `${USER_PERMISSIONS_BASE_URL}/${LIST}` as const,

  patch: (userId: string) => `${USER_PERMISSIONS_BASE_URL}/${userId}` as const,

  post: (userId: string) => `${USER_PERMISSIONS_BASE_URL}/${userId}` as const,
} as const;
