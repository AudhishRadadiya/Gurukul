import type { AddressBookFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFrom";

export const addressBookKeys = {
  add: () => [...addressBookKeys.all, "add"] as const,

  all: ["address-book"] as const,

  edit: (addressBookId: string) =>
    [...addressBookKeys.all, "edit", addressBookId] as const,

  export: () => [...addressBookKeys.all, "export"] as const,

  get: (addressBookId: string) =>
    [...addressBookKeys.all, "get", addressBookId] as const,

  listing: (body: object = {}) => {
    return [...addressBookKeys.all, "listing", body] as const;
  },

  options: () => [...addressBookKeys.all, "options"] as const,

  printAddress: (addressBookIds: string[]) =>
    [...addressBookKeys.all, "printAddressBook", addressBookIds] as const,

  printAddressBook: (addressBookIds: string[]) =>
    [...addressBookKeys.all, "printAddressBook", addressBookIds] as const,

  userData: (contactNo: AddressBookFormFieldValues["contact_no"]) => {
    return [...addressBookKeys.all, "listing", contactNo] as const;
  },
} as const;
