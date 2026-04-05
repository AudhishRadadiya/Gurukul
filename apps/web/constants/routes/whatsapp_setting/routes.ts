import { API, LIST, OPTION } from "@web/constants/routes/common";

export const WHATSAPP_SETTING_ROUTES_BASE_URL =
  `${API}/whatsapp-setting` as const;

export const WHATSAPP_SETTING_ROUTES = {
  get: (whatsappSettingId: string) =>
    `${WHATSAPP_SETTING_ROUTES_BASE_URL}/${whatsappSettingId}` as const,

  listing: `${WHATSAPP_SETTING_ROUTES_BASE_URL}/${LIST}` as const,

  options: `${WHATSAPP_SETTING_ROUTES_BASE_URL}/${LIST}/${OPTION}` as const,

  patch: (whatsappSettingId: string) =>
    `${WHATSAPP_SETTING_ROUTES_BASE_URL}/${whatsappSettingId}` as const,

  post: `${WHATSAPP_SETTING_ROUTES_BASE_URL}` as const,
} as const;
