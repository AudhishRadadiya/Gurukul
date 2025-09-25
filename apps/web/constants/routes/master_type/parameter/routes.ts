import { LIST, OPTION } from "@web/constants/routes/common";
import { MASTER_TYPE_BASE_URL } from "@web/constants/routes/master_type/routes";

export const PARAMETER_BASE_URL = `${MASTER_TYPE_BASE_URL}/parameter` as const;

export const PARAMETER_ROUTES = {
  delete: (masterParameterId: string) =>
    `${PARAMETER_BASE_URL}/${masterParameterId}` as const,

  get: (masterParameterId: string) =>
    `${PARAMETER_BASE_URL}/${masterParameterId}` as const,

  listing: `${PARAMETER_BASE_URL}/${LIST}` as const,

  options: `${PARAMETER_BASE_URL}/${LIST}/${OPTION}` as const,

  patch: (masterParameterId: string) =>
    `${PARAMETER_BASE_URL}/${masterParameterId}` as const,

  post: `${PARAMETER_BASE_URL}` as const,
} as const;
