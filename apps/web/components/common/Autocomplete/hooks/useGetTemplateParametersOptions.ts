export const COUNTER_BASE = 1 as const;
export const DONATION = 2 as const;
export const BILL_ENTRY = 3 as const;
export const MAIL = 4 as const;
export const PAYMENT = 5 as const;
export const GUEST_BOOKING = 6 as const;
export const OTHER = 7 as const;
export const LOGIN_OTP = 8 as const;

export type TemplateParameter = {
  label: string;
  value: string;
};

type TemplateParameterKeys =
  | typeof BILL_ENTRY
  | typeof COUNTER_BASE
  | typeof DONATION
  | typeof GUEST_BOOKING
  | typeof LOGIN_OTP
  | typeof MAIL
  | typeof OTHER
  | typeof PAYMENT;

const templateParametersMap: Record<
  TemplateParameterKeys,
  TemplateParameter[]
> = {
  [BILL_ENTRY]: [
    // Bill Entry
    { label: "Date and Time", value: "[DT]" },
    { label: "Total Sale", value: "[TSale]" },
    { label: "Cash Opening", value: "[CHOP]" },
    { label: "Cash Receive", value: "[CHRE]" },
    { label: "Cash Payment", value: "[CHPT]" },
    { label: "Cash Balance", value: "[CHBAL]" },
  ],
  [COUNTER_BASE]: [
    // Counter Base
    { label: "Counter Head Name", value: "[CHEAD]" },
    { label: "Counter Name", value: "[CNAME]" },
    { label: "Date and Time", value: "[DTE]" },
    { label: "Counter Amount", value: "[CAMT]" },
    { label: "Ticket Description", value: "[TDESC]" },
    { label: "User Name", value: "[UN]" },
    { label: "Cancel Amount", value: "[NAMT]" },
    { label: "Dis", value: "[DIS]" },
    { label: "Difference", value: "[DIFF]" },
  ],
  [DONATION]: [
    // Donation
    { label: "Donation Amount", value: "[DAMT]" },
    { label: "Suvichar", value: "[SVICHAR]" },
    { label: "Event Name", value: "[EVNT]" },
  ],
  [GUEST_BOOKING]: [
    // Guest Booking
    { label: "Booking Name", value: "[NAME]" },
    { label: "Booking At", value: "[BOOKINGAT]" },
    { label: "Booking Id", value: "[BOOKINGID]" },
    { label: "Room Required", value: "[ROOMREQUIRED]" },
    { label: "Room Type", value: "[ROOMTYPE]" },
    { label: "CheckIn Date", value: "[CHECKINDATE]" },
    { label: "CheckOut Date", value: "[CHECKOUTDATE]" },
    { label: "Cancel Policy", value: "[CANCELPOLICY]" },
    { label: "Mobile No", value: "[MOBILENO]" },
    { label: "Email Id", value: "[EMAILID]" },
    { label: "Trust Name", value: "[TRUSTNAME]" },
  ],
  [LOGIN_OTP]: [
    // Login OTP
    { label: "User Name", value: "[USERNAME]" },
    { label: "Login OTP", value: "[UOTP]" },
  ],
  [MAIL]: [
    // Mail
    { label: "Donation Amount", value: "[DAMT]" },
    { label: "Donar Receipt Name", value: "[DNAME]" },
    { label: "Receipt No", value: "[RENO]" },
  ],
  [OTHER]: [
    // Other
    { label: "Partnar Name", value: "[PARTNAME]" },
    { label: "Date and Time", value: "[DT]" },
    { label: "Cheque No", value: "[CHQ]" },
    { label: "Payment", value: "[AMT]" },
    { label: "Previous Balance", value: "[PRBAL]" },
    { label: "Net Balance", value: "[NETBAL]" },
    { label: "Pay Mode", value: "[PMODE]" },
  ],
  [PAYMENT]: [
    // Payment
    { label: "Customer Name", value: "[CUSTNAME]" },
    { label: "Date and Time", value: "[DT]" },
    { label: "Cheque No", value: "[CHQ]" },
    { label: "Payment", value: "[AMT]" },
    { label: "Previous Balance", value: "[PRBAL]" },
    { label: "Net Balance", value: "[NETBAL]" },
    { label: "Customer Firm Name", value: "[CustFirm]" },
    { label: "Company Name", value: "[CName]" },
  ],
};

export type TemplateType = keyof typeof templateParametersMap;

export function useGetTemplateParametersOptions(templateType: TemplateType) {
  const templateParametersOptions: TemplateParameter[] =
    templateType && templateParametersMap[templateType];

  return { templateParametersOptions };
}
