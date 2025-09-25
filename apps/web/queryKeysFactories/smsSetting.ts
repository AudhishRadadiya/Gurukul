import type { SmsSettingDetail } from "@web/components/settings/smsSettings/smsSettingsList/hooks/useGetSmsSettings";

export const smsSettingKeys = {
  add: () => [...smsSettingKeys.all, "add"] as const,

  all: ["sms-setting"] as const,

  edit: (smsSettingId: SmsSettingDetail["sms_setting_id"]) =>
    [...smsSettingKeys.all, "edit", smsSettingId] as const,

  get: (smsSettingId: SmsSettingDetail["sms_setting_id"]) =>
    [...smsSettingKeys.all, "get", smsSettingId] as const,

  listing: (body: object = {}) => {
    return [...smsSettingKeys.all, "listing", body] as const;
  },
} as const;
