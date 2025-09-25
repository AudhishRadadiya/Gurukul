export const mailSettingKeys = {
  add: () => [...mailSettingKeys.all, "add"] as const,

  all: ["mail-setting"],

  edit: (emailSettingId: string) =>
    [...mailSettingKeys.all, "edit", emailSettingId] as const,

  get: () => [...mailSettingKeys.all, "get"] as const,
} as const;
