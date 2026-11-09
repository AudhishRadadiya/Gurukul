"use client";

import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  ADD_ADDRESS_BOOK,
  EDIT_ADDRESS_BOOK,
} from "@web/app/address/address-book/hooks/constant";
import {
  addressBookOptionTabs,
  categories,
  type OptionKey,
} from "@web/components/Address/address-book/Tabs/hooks/useTabsOptions";

const addressBookPage = {
  [ADD_ADDRESS_BOOK]: "Add Address Book",
  [EDIT_ADDRESS_BOOK]: "Edit Address Book",
};

const isAddressBookTab = (tab: string | null): tab is OptionKey => {
  return addressBookOptionTabs.includes(tab as OptionKey);
};

export const AddressBookBreadcrumbs = () => {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const page = searchParams.get("page");

  const tab = searchParams.get("tab");

  const segments = (pathname ?? "").split("/").filter(Boolean);

  const isAddressBookDetail =
    segments[0] === "address" &&
    segments[1] === "address-book" &&
    segments.length >= 3;

  const addressBookSubPage =
    page === ADD_ADDRESS_BOOK ||
    (isAddressBookDetail && page === EDIT_ADDRESS_BOOK)
      ? page
      : null;

  const selectedTab = isAddressBookTab(tab) ? tab : "address-list";

  const breadcrumbsItems = [
    {
      icon: <SvgHome />,
      onClick: () => router.push("/"),
    },
    {
      text: t("address.menu.label"),
    },
    {
      ...(addressBookSubPage && {
        onClick: () => {
          router.push("/address/address-book");
        },
      }),
      text: t("address.book.menu.label"),
    },
  ];

  return (
    <Breadcrumbs
      items={
        addressBookSubPage
          ? [
              ...breadcrumbsItems,
              {
                text: addressBookPage[addressBookSubPage],
              },
            ]
          : [
              ...breadcrumbsItems,
              {
                text: categories[selectedTab],
              },
            ]
      }
    />
  );
};
