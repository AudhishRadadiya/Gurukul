"use client";

import { Stack } from "@mui/material";
import { useQueryState } from "nuqs";

import { EDIT_ADDRESS_BOOK } from "@web/app/address/address-book/hooks/constant";
import { EditAddressBook } from "@web/components/Address/address-book/AddressBook/editAddressBook/EditAddressBook";
import { AddressBookBreadcrumbs } from "@web/components/Address/address-book/Tabs/AddressBookBreadCrumbs";

export type PageProps = Readonly<{
  params: {
    addressBookId: string;
  };
}>;

// eslint-disable-next-line import/no-default-export
export default function Page({ params }: PageProps) {
  const { addressBookId } = params;

  const [page] = useQueryState("page");

  const queryPage = page === EDIT_ADDRESS_BOOK ? EDIT_ADDRESS_BOOK : null;

  return (
    <Stack gap="5px">
      <AddressBookBreadcrumbs page={queryPage} />

      <EditAddressBook addressBookId={addressBookId} />
    </Stack>
  );
}
