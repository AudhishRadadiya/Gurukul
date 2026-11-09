import { API, LIST } from "@web/constants/routes/common";
import type { FilType } from "@web/types/shared-types";

export const WEB_USER_HASTAK_LIST_BASE_URL = `${API}/hastak` as const;

export const WEB_USER_HASTAK_LIST_ROUTES = {
  convert: () => `${WEB_USER_HASTAK_LIST_BASE_URL}/convert` as const,

  listing: `${WEB_USER_HASTAK_LIST_BASE_URL}` as const,

  multiIgnored: () =>
    `${WEB_USER_HASTAK_LIST_BASE_URL}/ignore/multiple` as const,

  patch: () => `${WEB_USER_HASTAK_LIST_BASE_URL}/ignore` as const,

  post: (fileType: FilType) =>
    `${WEB_USER_HASTAK_LIST_BASE_URL}/${LIST}/${fileType}` as const,
} as const;
