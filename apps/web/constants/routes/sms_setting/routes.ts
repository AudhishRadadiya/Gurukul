import type { SmsSettingDetail } from "@web/components/settings/smsSettings/smsSettingsList/hooks/useGetSmsSettings";
import { API, LIST } from "@web/constants/routes/common";

export const SMS_SETTING_BASE_URL = `${API}/sms_setting` as const;

export const SMS_SETTING_ROUTES = {
  get: (smsSettingId: SmsSettingDetail["sms_setting_id"]) =>
    `${SMS_SETTING_BASE_URL}/${smsSettingId}`,

  listing: `${SMS_SETTING_BASE_URL}/${LIST}`,

  patch: (smsSettingId: SmsSettingDetail["sms_setting_id"]) =>
    `${SMS_SETTING_BASE_URL}/${smsSettingId}`,

  post: SMS_SETTING_BASE_URL,
} as const;
