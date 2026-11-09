import { PhoneNumberUtil } from "google-libphonenumber";

import { mobileNoRegex } from "@web/utils/regex";

const mobileUtil = PhoneNumberUtil.getInstance();

export const isValidMobileNumber = (value: string) => {
  if (!value) {
    return true;
  }

  try {
    if (value.startsWith("91") && !mobileNoRegex.test(value)) {
      return false;
    }

    const number = mobileUtil.parseAndKeepRawInput(`+${value}`);

    return mobileUtil.isValidNumber(number);
  } catch {
    return false;
  }
};
