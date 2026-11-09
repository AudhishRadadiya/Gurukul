"use client";

import { Stack } from "@mui/material";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import type { ReactNode } from "react";

import {
  ADD_ADDRESS_BOOK,
} from "@web/app/address/address-book/hooks/constant";
import { AddAddressBook } from "@web/components/Address/address-book/AddressBook/addAddressBook/AddAddressBook";
import { Tabs } from "@web/components/Address/address-book/Tabs/Tabs";

export const addressBookPage = {
  [ADD_ADDRESS_BOOK]: "Add Address Book",
};

type AddressBookPageType = keyof typeof addressBookPage;

export const queryPageEmus = [ADD_ADDRESS_BOOK, "address-list"] as const;

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const [queryPage] = useQueryState(
    "page",
    parseAsStringLiteral(queryPageEmus).withDefault("address-list")
  );

  const isAddAddressBookTab = queryPage === ADD_ADDRESS_BOOK;

  const AddressBookPageRenderer: Record<AddressBookPageType, ReactNode> = {
    [ADD_ADDRESS_BOOK]: <AddAddressBook />,
  };

  return (
    <Stack gap="5px">
      {isAddAddressBookTab ? AddressBookPageRenderer[queryPage] : <Tabs />}
    </Stack>
  );
}
