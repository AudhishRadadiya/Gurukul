import { API, LIST, OPTION } from "@web/constants/routes/common";

export const BANK_MASTER_BASE_URL = `${API}/bank_master` as const;

export const BANK_MASTER_ROUTES = {
  get: (bankId: string) => `${BANK_MASTER_BASE_URL}/${bankId}` as const,

  listing: `${BANK_MASTER_BASE_URL}/${LIST}` as const,

  nameOptions: `${BANK_MASTER_BASE_URL}/${LIST}/${OPTION}/name ` as const,

  options: `${BANK_MASTER_BASE_URL}/${LIST}/${OPTION}` as const,

  patch: (bankId: string) => `${BANK_MASTER_BASE_URL}/${bankId}` as const,

  post: `${BANK_MASTER_BASE_URL}` as const,
} as const;
