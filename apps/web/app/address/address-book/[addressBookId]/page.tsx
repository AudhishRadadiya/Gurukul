"use client";

import { Stack } from "@mui/material";

import { EditAddressBook } from "@web/components/Address/address-book/AddressBook/editAddressBook/EditAddressBook";

export type PageProps = Readonly<{
  params: {
    addressBookId: string;
  };
}>;

// eslint-disable-next-line import/no-default-export
export default function Page({ params }: PageProps) {
  const { addressBookId } = params;

  return (
    <Stack gap="5px">
      <EditAddressBook addressBookId={addressBookId} />
    </Stack>
  );
}
