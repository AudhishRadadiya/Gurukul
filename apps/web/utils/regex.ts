/* eslint-disable sonarjs/single-character-alternation */
/* eslint-disable sonarjs/sonar-no-control-regex */
/* eslint-disable sonarjs/regex-complexity */
/* eslint-disable sonarjs/slow-regex */
/* eslint-disable no-control-regex */
/* eslint-disable sonarjs/concise-regex */
// eslint-disable-next-line sonarjs/concise-regex
export const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;

export const emailRegex =
  /^(((?!.*[^\x00-\x7F])[^<>()[\]\\.,;:\s@"](\.[^<>()[\]\\.,;:\s@"])*){1,64}|(".{1,64}"))@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-zA-Z\-0-9]+(?:-[a-zA-Z\-0-9]+)*([.]{1,1}))){1,4}([a-zA-Z][a-zA-Z0-9]{1,}))|(?:\[(?:(?:(i|I)(p|P)(v)6:(?:(?:[a-zA-Z\-0-9]{1,4}(?::[a-zA-Z\-0-9]{1,4}){7})|(?:(?!(?:.*[a-zA-Z\-0-9][:\]]){7,})(?:[a-zA-Z\-0-9]{1,4}(?::[a-zA-Z\-0-9]{1,4}){0,5})?::(?:[a-zA-Z\-0-9]{1,4}(?::[a-zA-Z\-0-9]{1,4}){0,5})?)))|(?:(?:(i|I)(p|P)(v)6:(?:(?:[a-zA-Z\-0-9]{1,4}(?::[a-zA-Z\-0-9]{1,4}){5}:)|(?:(?!(?:.*[a-zA-Z\-0-9]:){5,})(?:[a-zA-Z\-0-9]{1,4}(?::[a-zA-Z\-0-9]{1,4}){0,3})?::(?:[a-zA-Z\-0-9]{1,4}(?::[a-zA-Z\-0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\]))$/;

export const mobileNumberRegex =
  /^\+?\d{1,4}?[-.\s]?(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{9})$/;

export const phoneNumberRegex = /^\d{7,11}$/;

export const pinCodeRegex = /^[1-9][0-9]{5}$/;

export const aadharCardRegex = /^[2-9][0-9]{3}[0-9]{4}[0-9]{4}$/;

export const panCardRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export const voterIdRegex = /^([a-zA-Z]){3}([0-9]){7}$/;

export const licenseNumberRegex =
  /^(([A-Za-z]{2}[0-9]{2})( )|([A-Za-z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;

export const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export const bankAcNoRegex = /^(?!0+$)\d{9,18}$/;

export const uppercaseLettersRegex = /^[A-Z]+$/;

export const percentageRegex =
  /^(100(\.0{1,2})?|[1-9]?[0-9](\.\d{1,2})?)?$|^[A-F][+-]?$/;

export const tanNoRegex = /^[A-Z]{4}[0-9]{5}[A-Z]$/;

export const cinNoRegex =
  /^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/;

export const esiNoRegex = /^[A-Za-z0-9]+$/;

export const holidayNameRegex = /^[a-zA-Z0-9 ]*$/;

export const gstNoRegex =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const ptNoRegex = /^[A-Za-z0-9]+$/;

export const leaveDayRegex = /^(0(\.5|\.50)?|1(\.0|\.00)?)$/;

export const taxExemptionLimitRegex = /^(?:\d{1,8}(\.\d{1,2})?)?$/;

export const alphaNumericRegex = /^[a-zA-Z0-9]{3,10}$/;

export const alphaNumericSpaceRegex = /^[a-zA-Z0-9 ]{3,50}$/;

export const formulaRegex =
  /^(?!.*\[\s*P\s*\]\s+\[\s*P\s*\])(?!.*\[\s*([A-Z])\s*\]\s*[-+*/%]\s*\[\s*\1\s*\])(?!.*[-+*/%]{2,})(?!.*\d+e[+-]?\d+)(?!.*\([^()]*$|^[^()]*\))[\w\s[\]+*/%().-]+$/;

export const hslToHex = /hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/;

export const wholeNumberRegex = /^[1-9]\d*$/;

export const pfNoRegex = /^[A-Z]{2}\/[A-Z]{3}\/\d{7}\/\d{3}\/\d{1,7}$/;

export const uanRegex = /^\d{12}$/;

export const esicNoRegex = /^[0-9]{10}$/;

export const otpRegex = /^\d+$/;

export const mobileNoRegex = /^(91)?[6-9]\d{9}$/;

export const passportNumberRegex = /^[A-PR-WYa-pr-wy][0-9]{7}$/;

export const eventUrlRegex =
  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

export const uppercaseLetter = /[A-Z]/;

export const lowercaseLetter = /[a-z]/;

export const digit = /\d/;

export const singleLetter = /^[A-Za-z]$/;

export const singleDigit = /^\d$/;
