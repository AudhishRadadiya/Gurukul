"use client";

import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRouter } from "next/navigation";

export type AddressBookBreadcrumbsProps = {
  page: "add-address-book" | "edit-address-book" | null;
};

export const AddressBookBreadcrumbs = ({
  page,
}: AddressBookBreadcrumbsProps) => {
  const router = useRouter();

  const breadcrumbsItems = [
    {
      icon: <SvgHome />,
      onClick: () => router.push("/"),
    },
    {
      text: t("address.menu.label"),
    },
    {
      onClick: () => {
        router.push("/address/address-book");
      },
      text: t("address.book.menu.label"),
    },
  ];

  return (
    <Breadcrumbs
      items={
        page
          ? [
              ...breadcrumbsItems,
              {
                text: `${page === "add-address-book" ? "Add" : "Edit"} Address Book`,
              },
            ]
          : breadcrumbsItems
      }
    />
  );
};
