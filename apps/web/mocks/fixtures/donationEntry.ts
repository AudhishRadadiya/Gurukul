import { faker } from "@faker-js/faker";

import type { DonationEntry } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationEntry";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

export function getDonationEntryDetails(): DonationEntry {
  return {
    aadhar_no: faker.string.numeric(12),
    address: faker.location.streetAddress(),
    amount: faker.number.int({ max: 100000, min: 100 }),
    atg: faker.datatype.boolean(),
    bank_name: faker.company.name(),
    cancel_date: faker.date.past().toISOString(),
    cheque_no: faker.string.alphanumeric(6).toUpperCase(),
    city: faker.location.city(),
    contact_no: `91${faker.string.numeric(10)}`,
    contribution_id: faker.string.uuid(),
    date: faker.date.recent().toISOString(),
    district: faker.location.city(),
    dl_no: `DL-${faker.string.alphanumeric(12).toUpperCase()}`,
    donation_id: faker.string.uuid(),
    donation_mode: faker.helpers.arrayElement([
      "Cash",
      "Cheque",
      "Bank Transfer",
    ]),
    donation_type: faker.helpers.arrayElement(["One Time", "Recurring"]),
    edit_by: faker.internet.userName(),
    edit_date: faker.date.recent().toISOString(),
    elector_number: `EPIC${faker.string.alphanumeric(10).toUpperCase()}`,
    email: faker.internet.email(),
    entry_by: faker.internet.userName(),
    entry_date: faker.date.recent().toISOString(),
    event: faker.lorem.words(3),
    first_name: faker.person.firstName(),
    full_count: faker.string.numeric(3),
    is_cancel: faker.datatype.boolean(),
    is_cancel_active: faker.datatype.boolean(),
    is_reminder: faker.datatype.boolean(),
    middle_name: faker.person.middleName(),
    mode_of_receipt: faker.helpers.arrayElement(["Manual", "Online"]),
    organize_remark: faker.lorem.sentence(),
    pan_no:
      faker.string.fromCharacters("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5) +
      faker.string.numeric(4) +
      faker.string.fromCharacters("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 1),
    passport_no: `P${faker.string.alphanumeric(7).toUpperCase()}`,
    prasad: faker.datatype.boolean(),
    receipt_name: faker.person.fullName(),
    receipt_no: faker.string.alphanumeric(10).toUpperCase(),
    ref_receipt_no: faker.string.alphanumeric(8).toUpperCase(),
    remark: faker.lorem.sentence(),
    reminder_date: faker.date.soon().toISOString(),
    reminder_note: faker.lorem.sentence(),
    state: faker.location.state(),
    surname: faker.person.lastName(),
    taluko: faker.location.county(),
    trust_id: faker.string.uuid(),
    trust_name: faker.company.name(),
    zip_code: parseInt(faker.location.zipCode("######")),
  };
}

export const GET_DONATION_ENTRY_MOCK_DATA: ApiSuccessResponse<DonationEntry> = {
  data: getDonationEntryDetails(),
  message: "Donation Entry Get Successfully.",
};

export const EDIT_DONATION_ENTRY_MOCK_DATA: EmptyApiSuccessResponse = {
  data: null,
  message: "Donation Entry Updated Successfully.",
};
