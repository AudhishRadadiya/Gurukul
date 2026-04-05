"use client";

import {
  CheckBox,
  ContentBox,
  DatePicker,
  PadBox,
} from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";

import { DateFilterPeriodAutocomplete } from "@web/components/common/Autocomplete/DateFilterPeriodAutocomplete";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import { ONE_MONTH } from "@web/components/common/hooks/constant";
import { DonationSummaryBreadcrumbs } from "@web/components/Donation/donationSummary/DonationSummaryBreadcrumbs";
import { DonationSummaryFilter } from "@web/components/Donation/donationSummary/donationSummaryList/DonationSummaryFlter";
import {
  DonationSummaryList,
  type DonationSummaryListHandle,
} from "@web/components/Donation/donationSummary/donationSummaryList/DonationSummaryList";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { FilType } from "@web/types/shared-types";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { allowPrintExport } = useUserPermissions();

  const [filterListData, setFilterListData] = useState<FieldValues>({});

  const { control, fromDate, onlyContactNo, toDate } =
    useDateFilters(ONE_MONTH);

  const donationSummaryListRef = useRef<DonationSummaryListHandle>(null);

  const onExport = (fileType: FilType) => {
    donationSummaryListRef.current?.onExport(fileType);
  };

  return (
    <Stack gap="10px">
      <DonationSummaryBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack direction="row" gap="10px" justifyContent="space-between">
            <Typography variant="subtitle1">
              {t("summary.label", {
                label: t("donation.menu.label"),
              })}
            </Typography>

            <Stack direction="row" gap="10px" alignItems="center">
              <CheckBox name="only_contact_no" control={control} size="small" />
              <Typography fontSize={15}>{t("only.mobile_no")}</Typography>

              <DateFilterPeriodAutocomplete
                name="date_filter_period"
                control={control}
                clearIcon
                sx={{ width: "160px" }}
              />

              <DatePicker
                control={control}
                name="from_date"
                clearable={false}
                containerProps={{ width: "160px" }}
              />

              <DatePicker
                control={control}
                name="to_date"
                minDate={fromDate ? DateTime.fromISO(fromDate) : DateTime.now()}
                clearable={false}
                containerProps={{ width: "160px" }}
              />
            </Stack>
          </Stack>
        </PadBox>
      </ContentBox>

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack direction="row" gap="10px" justifyContent="flex-end">
            <DonationSummaryFilter
              filterListData={filterListData}
              setFilterListData={setFilterListData}
            />

            <PermissionGuard canAccess={allowPrintExport}>
              <DataExport onExport={onExport} />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <DonationSummaryList
          ref={donationSummaryListRef}
          externalFilter={filterListData}
          fromDate={fromDate}
          onlyContactNo={onlyContactNo}
          toDate={toDate}
        />
      </ContentBox>
    </Stack>
  );
}
