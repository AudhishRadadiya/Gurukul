import type { SmsTemplateDetail } from "@web/components/settings/sms-template/smsTemplateList/hooks/useGetSmsTemplate";

export const smsTemplateKeys = {
  add: () => [...smsTemplateKeys.all, "add"] as const,

  all: ["sms-template"],

  delete: (smsTemplateId: SmsTemplateDetail["sms_template_id"]) =>
    [...smsTemplateKeys.all, "delete", smsTemplateId] as const,

  edit: (smsTemplateId: SmsTemplateDetail["sms_template_id"]) =>
    [...smsTemplateKeys.all, "edit", smsTemplateId] as const,

  get: (smsTemplateId: SmsTemplateDetail["sms_template_id"]) =>
    [...smsTemplateKeys.all, "get", smsTemplateId] as const,

  listing: (body: object = {}) =>
    [...smsTemplateKeys.all, "listing", body] as const,
} as const;
