import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import _omit from "lodash/omit";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  CLONE_DONATION_ENTRY,
  donationEntryPage as donationEntryDetailPage,
  EDIT_DONATION_ENTRY,
} from "@web/app/donation/donation-entry/[donationId]/hooks/constant";
import {
  ADD_DONATION_ENTRY,
  donationEntryPage,
} from "@web/app/donation/donation-entry/hooks/constant";

type DonationEntrySubPage =
  | typeof ADD_DONATION_ENTRY
  | typeof CLONE_DONATION_ENTRY
  | typeof EDIT_DONATION_ENTRY;

const getDonationEntrySubPage = ({
  isDonationEntryDetail,
  page,
}: {
  isDonationEntryDetail: boolean;
  page: string | null;
}): DonationEntrySubPage | null => {
  if (isDonationEntryDetail) {
    return page === CLONE_DONATION_ENTRY
      ? CLONE_DONATION_ENTRY
      : EDIT_DONATION_ENTRY;
  }

  if (page === ADD_DONATION_ENTRY) {
    return ADD_DONATION_ENTRY;
  }

  return null;
};

const getDonationEntryPageText = (
  donationEntrySubPage: DonationEntrySubPage | null
) => {
  if (!donationEntrySubPage) {
    return "from Donation summary";
  }

  if (donationEntrySubPage === ADD_DONATION_ENTRY) {
    return donationEntryPage[ADD_DONATION_ENTRY];
  }

  return donationEntryDetailPage[donationEntrySubPage];
};

export const DonationEntryBreadcrumbs = () => {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const page = searchParams.get("page");

  const segments = (pathname ?? "").split("/").filter(Boolean);

  const isDonationEntryDetail =
    segments[0] === "donation" &&
    segments[1] === "donation-entry" &&
    segments.length >= 3;

  const isAddOnMainRoute =
    !isDonationEntryDetail && page === ADD_DONATION_ENTRY;

  const isListOnMainRoute = !isDonationEntryDetail && !isAddOnMainRoute;

  const params = Object.fromEntries(searchParams.entries());

  const otherParams = _omit(params, "page");

  const hasSummaryParams = !_isEmpty(otherParams);

  const donationEntrySubPage = getDonationEntrySubPage({
    isDonationEntryDetail,
    page,
  });

  const hasDonationEntrySubPage = Boolean(donationEntrySubPage);

  const needsDonationEntryBackLink =
    hasDonationEntrySubPage || (isListOnMainRoute && hasSummaryParams);

  const showTrailingItem =
    hasDonationEntrySubPage || (isListOnMainRoute && hasSummaryParams);

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
    {
      ...(needsDonationEntryBackLink && {
        onClick: () => {
          router.push("/donation/donation-entry");
        },
      }),
      text: t("donation.entry.label"),
    },
  ];

  return (
    <Breadcrumbs
      items={
        showTrailingItem
          ? [
              ...breadcrumbsItems,
              {
                text: getDonationEntryPageText(donationEntrySubPage),
              },
            ]
          : breadcrumbsItems
      }
    />
  );
};
