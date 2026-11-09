"use client";

import { ContentBox } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import type { ReactNode } from "react";

import type { donationEntryPage } from "@web/app/donation/donation-entry/[donationId]/hooks/constant";
import {
  CLONE_DONATION_ENTRY,
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
      <ContentBox>{DonationPageRenderer[queryPage]}</ContentBox>
    </Stack>
  );
}
