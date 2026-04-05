import { API, LIST, OPTION } from "@web/constants/routes/common";

export const EMAIL_SETTING_ROUTES_BASE_URL = `${API}/email_setting` as const;

export const EMAIL_SETTING_ROUTES = {
  get: (emailSettingId: string) =>
    `${EMAIL_SETTING_ROUTES_BASE_URL}/${emailSettingId}` as const,

  listing: `${EMAIL_SETTING_ROUTES_BASE_URL}/${LIST}` as const,

  options: `${EMAIL_SETTING_ROUTES_BASE_URL}/${LIST}/${OPTION}` as const,

  patch: (emailSettingId: string) =>
    `${EMAIL_SETTING_ROUTES_BASE_URL}/${emailSettingId}` as const,

  post: `${EMAIL_SETTING_ROUTES_BASE_URL}` as const,
} as const;
