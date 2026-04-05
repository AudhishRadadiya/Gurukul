"use client";

import { Breadcrumbs, ContentBox, SvgHome } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import type { ReactNode } from "react";

import {
  CLONE_DONATION_ENTRY,
  donationEntryPage,
  EDIT_DONATION_ENTRY,
} from "@web/app/donation/donation-entry/[donationId]/hooks/constant";
import { CloneDonationEntry } from "@web/components/Donation/donationEntry/cloneDonationEntry/CloneDonationEntry";
import { EditDonationEntry } from "@web/components/Donation/donationEntry/editDonationEntry/EditDonationEntry";

export type PageProps = Readonly<{
  params: {
    donationId: string;
  };
}>;

type DonationEntryPageType = keyof typeof donationEntryPage;

const queryPageEmus = [CLONE_DONATION_ENTRY, EDIT_DONATION_ENTRY] as const;

// eslint-disable-next-line import/no-default-export
export default function Page({ params }: PageProps) {
  const { donationId } = params;

  const router = useRouter();

  const [queryPage] = useQueryState(
    "page",
    parseAsStringLiteral(queryPageEmus).withDefault(EDIT_DONATION_ENTRY)
  );

  const DonationPageRenderer: Record<DonationEntryPageType, ReactNode> = {
    [CLONE_DONATION_ENTRY]: <CloneDonationEntry donationId={donationId} />,
    [EDIT_DONATION_ENTRY]: <EditDonationEntry donationId={donationId} />,
  };

  return (
    <Stack gap="10px">
      <Breadcrumbs
        items={[
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
            onClick: () => {
              router.push("/donation/donation-entry");
            },
            text: t("donation.entry.label"),
          },
          {
            text: donationEntryPage[queryPage],
          },
        ]}
      />

      <ContentBox>{DonationPageRenderer[queryPage]}</ContentBox>
    </Stack>
  );
}
