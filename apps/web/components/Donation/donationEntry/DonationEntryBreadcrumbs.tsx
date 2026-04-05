import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import _omit from "lodash/omit";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import {
  ADD_DONATION_ENTRY,
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

  const searchParams = useSearchParams();

  const isDonationEntryList = queryPage === LIST_DONATION_ENTRY;

  const isAddDonationEntry = queryPage === ADD_DONATION_ENTRY;

  // Check if there are any query parameters (excluding the 'page' param)
  const hasQueryParams = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries());

    const otherParams = _omit(params, "page");

    return !_isEmpty(otherParams);
  }, [searchParams]);

  const breadcrumbsItems = useMemo(() => {
    const items: Array<{
      icon?: React.ReactNode;
      onClick?: () => void;
      text?: string;
    }> = [
      {
        icon: <SvgHome />,
        onClick: () => {
          router.push("/");
        },
      },
      {
        text: t("donation.menu.label"),
      },
    ];

    if (hasQueryParams) {
      items.push({
        onClick: () => {
          router.push("/donation/donation-entry");
        },
        text: t("donation.entry.label"),
      });
      items.push({
        text: "from Donation summary",
      });
    } else if (isAddDonationEntry) {
      items.push({
        onClick: () => {
          router.push("/donation/donation-entry");
        },
        text: t("donation.entry.label"),
      });
    } else {
      items.push({
        text: t("donation.entry.label"),
      });
    }

    if (!isDonationEntryList) {
      items.push({
        text: donationEntryPage[queryPage],
      });
    }

    return items;
  }, [hasQueryParams, isDonationEntryList, queryPage, router, t]);

  return <Breadcrumbs items={breadcrumbsItems} />;
};
