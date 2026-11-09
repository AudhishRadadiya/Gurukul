import { API, LIST } from "@web/constants/routes/common";

export const META_WHATSAPP_TEMPLATE_ROUTES_BASE_URL =
  `${API}/meta-whatsapp-template` as const;

export const META_WHATSAPP_TEMPLATE_ROUTES = {
  delete: (metaWhatsappTemplateId: string) =>
    `${META_WHATSAPP_TEMPLATE_ROUTES_BASE_URL}/${metaWhatsappTemplateId}` as const,

  fetchList: `${META_WHATSAPP_TEMPLATE_ROUTES_BASE_URL}/fetch-list` as const,

  fetchVariables:
    `${META_WHATSAPP_TEMPLATE_ROUTES_BASE_URL}/fetch-variables` as const,

  get: (metaWhatsappTemplateId: string) =>
    `${META_WHATSAPP_TEMPLATE_ROUTES_BASE_URL}/${metaWhatsappTemplateId}` as const,

  listing: `${META_WHATSAPP_TEMPLATE_ROUTES_BASE_URL}/${LIST}` as const,

  patch: (metaWhatsappTemplateId: string) =>
    `${META_WHATSAPP_TEMPLATE_ROUTES_BASE_URL}/${metaWhatsappTemplateId}` as const,

  post: `${META_WHATSAPP_TEMPLATE_ROUTES_BASE_URL}/fetch-and-store` as const,
} as const;

