"use client";

import { ContentBox } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useState, type ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

import type { donationListPage } from "@web/app/donation/donation-list/hooks/constant";
import {
  ADD_DONATION_ENTRY,
  LIST_DONATION_LIST,
} from "@web/app/donation/donation-list/hooks/constant";
import type { Status } from "@web/components/common/Autocomplete/hooks/useGetStatusOptions";
import { ALL } from "@web/components/common/hooks/constant";
import { AddDonationEntry } from "@web/components/Donation/donationEntry/addDonationEntry/AddDonationEntry";
import {
  DonationEntryColumnHideDefaultValue,
  type DonationEntryColumnHideTypes,
} from "@web/components/Donation/donationEntry/donationEntryList/hooks/templateTypes";
import { DonationList } from "@web/components/Donation/donationRecords/donationList/DonationList";

type DonationListPageType = keyof typeof donationListPage;

const queryPageEmus = [ADD_DONATION_ENTRY, LIST_DONATION_LIST] as const;

export type DonationListValues = {
  is_active: Status;
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const formMethods = useForm<DonationListValues>({
    defaultValues: {
      is_active: ALL,
    },
  });

  const [columnHide, setColumnHide] = useState<DonationEntryColumnHideTypes>(
    DonationEntryColumnHideDefaultValue
  );

  const [queryPage] = useQueryState(
    "page",
    parseAsStringLiteral(queryPageEmus).withDefault(LIST_DONATION_LIST)
  );

  const isDonationList = queryPage === LIST_DONATION_LIST;

  const DonationListPageRenderer: Record<DonationListPageType, ReactNode> = {
    [ADD_DONATION_ENTRY]: (
      <ContentBox>
        <AddDonationEntry />
      </ContentBox>
    ),
    [LIST_DONATION_LIST]: (
      <DonationList columnHide={columnHide} setColumnHide={setColumnHide} />
    ),
  };

  return (
    <FormProvider {...formMethods}>
      <Stack gap="10px">
        {isDonationList
          ? DonationListPageRenderer[LIST_DONATION_LIST]
          : DonationListPageRenderer[queryPage]}
      </Stack>
    </FormProvider>
  );
}
