export const mailSettingKeys = {
  add: () => [...mailSettingKeys.all, "add"] as const,

  all: ["mail-setting"],

  edit: (emailSettingId: string) =>
    [...mailSettingKeys.all, "edit", emailSettingId] as const,

  get: (emailSettingId: string) =>
    [...mailSettingKeys.all, "get", emailSettingId] as const,

  listing: (body: object = {}) =>
    [...mailSettingKeys.all, "listing", body] as const,

  options: () => [...mailSettingKeys.all, "options"] as const,
} as const;
