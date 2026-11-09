import { API, LIST, OPTION } from "@web/constants/routes/common";

export const META_WHATSAPP_SETTING_ROUTES_BASE_URL =
  `${API}/meta-whatsapp-setting` as const;

export const META_WHATSAPP_SETTING_ROUTES = {
  delete: (metaWhatsappSettingId: string) =>
    `${META_WHATSAPP_SETTING_ROUTES_BASE_URL}/${metaWhatsappSettingId}` as const,

  get: (metaWhatsappSettingId: string) =>
    `${META_WHATSAPP_SETTING_ROUTES_BASE_URL}/${metaWhatsappSettingId}` as const,

  listing: `${META_WHATSAPP_SETTING_ROUTES_BASE_URL}/${LIST}` as const,

  options:
    `${META_WHATSAPP_SETTING_ROUTES_BASE_URL}/${LIST}/${OPTION}` as const,

  patch: (metaWhatsappSettingId: string) =>
    `${META_WHATSAPP_SETTING_ROUTES_BASE_URL}/${metaWhatsappSettingId}` as const,

  post: `${META_WHATSAPP_SETTING_ROUTES_BASE_URL}` as const,
} as const;
