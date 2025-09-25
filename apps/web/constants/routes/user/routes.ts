import { API, LIST, OPTION } from "@web/constants/routes/common";

export const USER_BASE_URL = `${API}/user` as const;

export const USER_ROUTES = {
  delete: (addressTypeId: string) => `${USER_BASE_URL}/${addressTypeId}`,

  get: (addressTypeId: string) => `${USER_BASE_URL}/${addressTypeId}`,

  listing: `${USER_BASE_URL}/${LIST}`,

  options: `${USER_BASE_URL}/${LIST}/${OPTION}` as const,

  patch: (addressTypeId: string) => `${USER_BASE_URL}/${addressTypeId}`,

  post: USER_BASE_URL,
} as const;
