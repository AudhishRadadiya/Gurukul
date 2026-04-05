import { API, LIST, OPTION } from "@web/constants/routes/common";

export const ADDRESS_TYPE_BASE_URL = `${API}/address_type` as const;

export const ADDRESS_TYPE_ROUTES = {
  get: (addressTypeId: string) => `${ADDRESS_TYPE_BASE_URL}/${addressTypeId}`,

  listing: `${ADDRESS_TYPE_BASE_URL}/${LIST}`,

  options: `${ADDRESS_TYPE_BASE_URL}/${LIST}/${OPTION}/user-wise`,

  patch: (addressTypeId: string) => `${ADDRESS_TYPE_BASE_URL}/${addressTypeId}`,

  post: ADDRESS_TYPE_BASE_URL,
} as const;
