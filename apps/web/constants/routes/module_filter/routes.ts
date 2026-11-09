import { API } from "@web/constants/routes/common";

export const MODULE_FILTER_BASE_URL = `${API}/module_filter` as const;

export const MODULE_FILTER_ROUTES = {
  get: (moduleKey: string) => `${MODULE_FILTER_BASE_URL}/${moduleKey}` as const,

  post: `${MODULE_FILTER_BASE_URL}` as const,
} as const;
