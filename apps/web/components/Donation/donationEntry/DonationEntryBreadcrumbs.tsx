import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRouter } from "next/navigation";

import {
  donationEntryPage,
  LIST_DONATION_ENTRY,
} from "@web/app/donation/donation-entry/hooks/constant";

export type DonationEntryBreadcrumbProps = {
  queryPage: keyof typeof donationEntryPage;
};

export const DonationEntryBreadcrumbs = ({
  queryPage,
}: DonationEntryBreadcrumbProps) => {
  const router = useRouter();

  const isDonationEntryList = queryPage === LIST_DONATION_ENTRY;

  const breadcrumbsItems = [
    {
      icon: <SvgHome />,
      onClick: () => {
        router.push("/");
      },
    },
    {
      text: t("donation.menu.label"),
    },
    ...(!isDonationEntryList
      ? [
          {
            onClick: () => {
              router.push("/donation/donation-entry");
            },
            text: t("donation.entry.label"),
          },
        ]
      : [
          {
            text: t("donation.entry.label"),
          },
        ]),
  ];

  return (
    <Breadcrumbs
      items={
        !isDonationEntryList
          ? [
              ...breadcrumbsItems,
              {
                text: donationEntryPage[queryPage],
              },
            ]
          : breadcrumbsItems
      }
    />
  );
};
