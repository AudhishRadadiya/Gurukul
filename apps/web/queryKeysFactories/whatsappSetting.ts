export const whatsappSettingKeys = {
  add: () => [...whatsappSettingKeys.all, "add"] as const,

  all: ["whatsapp-setting"],

  edit: (whatsappSettingId: string) =>
    [...whatsappSettingKeys.all, "edit", whatsappSettingId] as const,

  get: (whatsappSettingId: string) =>
    [...whatsappSettingKeys.all, "get", whatsappSettingId] as const,

  listing: (body: object = {}) =>
    [...whatsappSettingKeys.all, "listing", body] as const,

  options: () => [...whatsappSettingKeys.all, "options"] as const,
} as const;
