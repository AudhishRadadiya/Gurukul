import type { SmsTemplateDetail } from "@web/components/settings/sms-template/smsTemplateList/hooks/useGetSmsTemplate";
import { API, LIST } from "@web/constants/routes/common";

export const SMS_TEMPLATE_BASE_URL = `${API}/sms_template` as const;

export const SMS_TEMPLATE_ROUTES = {
  delete: (smsTemplateId: SmsTemplateDetail["sms_template_id"]) =>
    `${SMS_TEMPLATE_BASE_URL}/${smsTemplateId}` as const,

  get: (smsTemplateId: SmsTemplateDetail["sms_template_id"]) =>
    `${SMS_TEMPLATE_BASE_URL}/${smsTemplateId}` as const,

  listing: `${SMS_TEMPLATE_BASE_URL}/${LIST}` as const,

  patch: (smsTemplateId: SmsTemplateDetail["sms_template_id"]) =>
    `${SMS_TEMPLATE_BASE_URL}/${smsTemplateId}` as const,

  post: `${SMS_TEMPLATE_BASE_URL}` as const,
} as const;
