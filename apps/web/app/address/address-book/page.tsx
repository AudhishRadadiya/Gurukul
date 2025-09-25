"use client";

import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { parseAsStringEnum, parseAsStringLiteral, useQueryState } from "nuqs";
import type { ReactNode } from "react";

import {
  ADD_ADDRESS_BOOK,
  LIST_ADDRESS_BOOK,
} from "@web/app/address/address-book/hooks/constant";
import { AddAddressBook } from "@web/components/Address/address-book/AddressBook/addAddressBook/AddAddressBook";
import type { OptionKey } from "@web/components/Address/address-book/Tabs/hooks/useTabsOptions";
import {
  addressBookOptionTabs,
  categories,
} from "@web/components/Address/address-book/Tabs/hooks/useTabsOptions";
import { Tabs } from "@web/components/Address/address-book/Tabs/Tabs";

export const addressBookPage = {
  [ADD_ADDRESS_BOOK]: "Add Address Book",
};

type AddressBookPageType = keyof typeof addressBookPage;

export const queryPageEmus = [ADD_ADDRESS_BOOK, "address-list"] as const;

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const router = useRouter();

  const [queryPage] = useQueryState(
    "page",
    parseAsStringLiteral(queryPageEmus).withDefault("address-list")
  );

  const [tab] = useQueryState(
    "tab",
    parseAsStringEnum<OptionKey>(addressBookOptionTabs).withDefault(
      "address-list"
    )
  );

  const isAddressBookList = queryPage === LIST_ADDRESS_BOOK;

  const breadcrumbsItems = [
    {
      icon: <SvgHome />,
      onClick: () => {
        router.push("/");
      },
    },
    {
      text: t("address.menu.label"),
    },
    ...(!isAddressBookList
      ? [
          {
            onClick: () => {
              router.push("/address/address-book");
            },
            text: t("address.book.menu.label"),
          },
        ]
      : [
          {
            text: t("address.book.menu.label"),
          },
        ]),
  ];

  const isAddAddressBookTab = queryPage === ADD_ADDRESS_BOOK;

  const AddressBookPageRenderer: Record<AddressBookPageType, ReactNode> = {
    [ADD_ADDRESS_BOOK]: <AddAddressBook />,
  };

  return (
    <Stack gap="5px">
      <Breadcrumbs
        items={
          !isAddressBookList
            ? [
                ...breadcrumbsItems,
                {
                  text: addressBookPage[queryPage],
                },
              ]
            : [
                ...breadcrumbsItems,
                {
                  text: categories[tab],
                },
              ]
        }
      />

      {isAddAddressBookTab ? AddressBookPageRenderer[queryPage] : <Tabs />}
    </Stack>
  );
}
