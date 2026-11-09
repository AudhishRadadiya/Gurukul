export const metaWhatsappTemplateKeys = {
  add: () => [...metaWhatsappTemplateKeys.all, "add"] as const,

  all: ["meta-whatsapp-template"],

  delete: (metaWhatsappTemplateId: string) =>
    [...metaWhatsappTemplateKeys.all, "delete", metaWhatsappTemplateId] as const,

  edit: (metaWhatsappTemplateId: string) =>
    [...metaWhatsappTemplateKeys.all, "edit", metaWhatsappTemplateId] as const,

  fetchList: (whatsappNumberId?: string | null) =>
    [...metaWhatsappTemplateKeys.all, "fetch-list", whatsappNumberId] as const,

  fetchVariables: (body: object = {}) =>
    [...metaWhatsappTemplateKeys.all, "fetch-variables", body] as const,

  get: (metaWhatsappTemplateId: string) =>
    [...metaWhatsappTemplateKeys.all, "get", metaWhatsappTemplateId] as const,

  listing: (body: object = {}) =>
    [...metaWhatsappTemplateKeys.all, "listing", body] as const,
} as const;

