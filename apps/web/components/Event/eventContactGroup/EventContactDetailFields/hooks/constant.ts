import type { ContactDetailItemFormValues } from "@web/components/Event/eventContactGroup/EventContactDetailFields/hooks/useContactDetailImport";

export const EVENT_CONTACT_DETAIL_SAMPLE_FILE =
  // eslint-disable-next-line sonarjs/no-clear-text-protocols
  "https://api.gurukul.work/api/upload/excel/contacts-table.xlsx";

export const EVENT_CONTACT_DETAIL_EXCEL_MOBILE_HEADER = "Mobile No";

export const contactDetailItemDefaultValues: ContactDetailItemFormValues = {
  mobile_no: null,
  selected: false,
};
