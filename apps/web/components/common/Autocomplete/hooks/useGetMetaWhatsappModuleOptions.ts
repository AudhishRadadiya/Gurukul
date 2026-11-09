import {
  DONATION_BULK_MESSAGE,
  DONATION_REMIDNER,
  DONATION_RECEIPT,
  OTP_TEMPLATE,
} from "@web/components/common/hooks/constant";

const optionTypes = {
  [DONATION_BULK_MESSAGE]: "Donation Bulk Message",
  [DONATION_RECEIPT]: "Donation Receipt",
  [DONATION_REMIDNER]: "Donation Reminder",
  [OTP_TEMPLATE]: "OTP Template",
};

export function useGetMetaWhatsappModuleOptions() {
  const metaWhatsappModuleOptions = [
    { label: optionTypes[DONATION_BULK_MESSAGE], value: DONATION_BULK_MESSAGE },
    { label: optionTypes[DONATION_RECEIPT], value: DONATION_RECEIPT },
    { label: optionTypes[DONATION_REMIDNER], value: DONATION_REMIDNER },
    { label: optionTypes[OTP_TEMPLATE], value: OTP_TEMPLATE },
  ];

  return { metaWhatsappModuleOptions };
}
