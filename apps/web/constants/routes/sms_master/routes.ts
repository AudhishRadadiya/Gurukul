import { API, LIST, OPTION } from "@web/constants/routes/common";

export const SMS_MASTER_BASE_URL = `${API}/sms_master` as const;

export const SMS_MASTER_ROUTES = {
  delete: (smsMasterId: string) =>
    `${SMS_MASTER_BASE_URL}/${smsMasterId}` as const,

  get: (smsMasterId: string) =>
    `${SMS_MASTER_BASE_URL}/${smsMasterId}` as const,

  listing: `${SMS_MASTER_BASE_URL}/${LIST}` as const,

  options: `${SMS_MASTER_BASE_URL}/${LIST}/${OPTION}` as const,

  patch: (smsMasterId: string) =>
    `${SMS_MASTER_BASE_URL}/${smsMasterId}` as const,

  post: `${SMS_MASTER_BASE_URL}` as const,
} as const;
