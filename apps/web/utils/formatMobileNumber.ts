import { PhoneNumberUtil } from "google-libphonenumber";

const mobileUtil = PhoneNumberUtil.getInstance();

export const formatMobileNumber = (value: string) => {
  try {
    const number = mobileUtil.parseAndKeepRawInput(`+${value}`);

    const countryCode = number.getCountryCode();

    const nationalNumber = number.getNationalNumber();

    return `+${countryCode}-${nationalNumber}`;
  } catch {
    return "-";
  }
};
