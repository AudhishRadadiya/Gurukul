import { EVENT_CONTACT_DETAIL_EXCEL_MOBILE_HEADER } from "@web/components/Event/eventContactGroup/EventContactDetailFields/hooks/constant";
import type {
  ContactDetailExcelImportRow,
  ContactDetailItemFormValues,
} from "@web/components/Event/eventContactGroup/EventContactDetailFields/hooks/useContactDetailImport";

const getMobileNoFromRow = (
  row: ContactDetailExcelImportRow
): string | null => {
  const raw = row[EVENT_CONTACT_DETAIL_EXCEL_MOBILE_HEADER] ?? row.mobile_no;

  if (!raw) {
    return null;
  }

  return String(raw).trim();
};

export const mapContactDetailExcelRowToContactDetail = (
  row: ContactDetailExcelImportRow
): ContactDetailItemFormValues | null => {
  const mobile_no = getMobileNoFromRow(row);

  if (!mobile_no) {
    return null;
  }

  return { mobile_no, selected: false };
};

export const mapContactDetailExcelRowsToContactDetails = (
  rows: ContactDetailExcelImportRow[]
): ContactDetailItemFormValues[] => {
  const seenMobileNumbers = new Set<string>();

  return rows.reduce<ContactDetailItemFormValues[]>((uniqueContacts, row) => {
    const contact = mapContactDetailExcelRowToContactDetail(row);

    if (!contact?.mobile_no) {
      return uniqueContacts;
    }

    if (seenMobileNumbers.has(contact.mobile_no)) {
      return uniqueContacts;
    }

    seenMobileNumbers.add(contact.mobile_no);

    return [...uniqueContacts, contact];
  }, []);
};
