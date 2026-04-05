import { API, OPTION } from "@web/constants/routes/common";

export const LOCATION_BASE_URL = `${API}/location` as const;

export const LOCATION_ROUTES = {
  cityOptions: `${LOCATION_BASE_URL}/${OPTION}/city` as const,

  getLocation: `${LOCATION_BASE_URL}` as const,

  stateOptions: `${LOCATION_BASE_URL}/${OPTION}/state` as const,
} as const;
