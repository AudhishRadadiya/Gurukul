export const metaWhatsappSettingKeys = {
  add: () => [...metaWhatsappSettingKeys.all, "add"] as const,

  all: ["meta-whatsapp-setting"],

  delete: (metaWhatsappSettingId: string) =>
    [...metaWhatsappSettingKeys.all, "delete", metaWhatsappSettingId] as const,

  edit: (metaWhatsappSettingId: string) =>
    [...metaWhatsappSettingKeys.all, "edit", metaWhatsappSettingId] as const,

  get: (metaWhatsappSettingId: string) =>
    [...metaWhatsappSettingKeys.all, "get", metaWhatsappSettingId] as const,

  listing: (body: object = {}) =>
    [...metaWhatsappSettingKeys.all, "listing", body] as const,

  options: () => [...metaWhatsappSettingKeys.all, "options"] as const,
} as const;
