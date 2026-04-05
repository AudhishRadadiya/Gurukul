import type { AddressBookFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFrom";
import type { PreviousAddressBookData } from "@web/components/Address/address-book/AddressBook/addAddressBook/hooks/useGetPreviousAddressBookData";

export const ADDRESS_BOOK_FIELD_MAPPINGS: Array<{
  apiField: keyof PreviousAddressBookData;
  formField: keyof AddressBookFormFieldValues;
}> = [
  { apiField: "aadhar_no", formField: "aadhar_no" },
  { apiField: "address", formField: "address" },
  { apiField: "city", formField: "city" },
  { apiField: "contact_no", formField: "contact_no" },
  { apiField: "business_detail", formField: "business_detail" },
  { apiField: "driving_licence_no", formField: "driving_licence_no" },
  { apiField: "electors_number", formField: "elector_number" },
  { apiField: "email_id", formField: "email_id" },
  { apiField: "first_name", formField: "first_name" },
  { apiField: "middle_name", formField: "middle_name" },
  { apiField: "pan_no", formField: "pan_no" },
  { apiField: "passport_no", formField: "passport_no" },
  { apiField: "pincode", formField: "pincode" },
  { apiField: "surname", formField: "surname" },
] as const;
