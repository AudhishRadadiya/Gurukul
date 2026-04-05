import type { SmsSettingDetail } from "@web/components/settings/smsSettings/smsSettingsList/hooks/useGetSmsSettings";
import { API, LIST, OPTION } from "@web/constants/routes/common";

export const SMS_SETTING_BASE_URL = `${API}/sms_setting` as const;

export const SMS_SETTING_ROUTES = {
  get: (smsSettingId: SmsSettingDetail["sms_setting_id"]) =>
    `${SMS_SETTING_BASE_URL}/${smsSettingId}` as const,

  listing: `${SMS_SETTING_BASE_URL}/${LIST}` as const,

  options: `${SMS_SETTING_BASE_URL}/${LIST}/${OPTION}` as const,

  patch: (smsSettingId: SmsSettingDetail["sms_setting_id"]) =>
    `${SMS_SETTING_BASE_URL}/${smsSettingId}` as const,

  post: `${SMS_SETTING_BASE_URL}` as const,
} as const;
