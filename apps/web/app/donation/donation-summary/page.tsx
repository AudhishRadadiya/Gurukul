"use client";

import {
  CheckBox,
  ContentBox,
  DatePicker,
  PadBox,
  toasts,
} from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";

import { DateFilterPeriodAutocomplete } from "@web/components/common/Autocomplete/DateFilterPeriodAutocomplete";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import {
  ONE_MONTH,
  SEVEN_DAYS,
  TODAY,
} from "@web/components/common/hooks/constant";
import { DonationSummaryBreadcrumbs } from "@web/components/Donation/donationSummary/DonationSummaryBreadcrumbs";
import { DonationSummaryFilter } from "@web/components/Donation/donationSummary/donationSummaryList/DonationSummaryFlter";
import { DonationSummaryList } from "@web/components/Donation/donationSummary/donationSummaryList/DonationSummaryList";
import type { GetDonationSummaryExportApiSuccessResponse } from "@web/components/Donation/donationSummary/donationSummaryList/hooks/useGetDonationSummaryExport";
import { useGetDonationSummaryExport } from "@web/components/Donation/donationSummary/donationSummaryList/hooks/useGetDonationSummaryExport";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const [filterListData, setFilterListData] = useState<FieldValues>({});

  const { control, setValue, watch } = useForm({
    defaultValues: {
      date_filter_period: TODAY,
      from_date: DateTime.now().toISODate(),
      only_contact_no: false,
      to_date: DateTime.now().toISODate(),
    },
  });

  const dateFilterPeriod = watch("date_filter_period");

  const { mutate } = useGetDonationSummaryExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetDonationSummaryExportApiSuccessResponse) => {
        window.open(data.url, "_blank");

        toasts.success({ title: message });
      },
    },
  });

  const onExport = (fileType: FilType) => {
    mutate({
      body: {
        externalFilter: { ...filterListData },
      },
      fileType,
    });
  };

  const toDate = watch("to_date");

  const fromDate = watch("from_date");

  const onlyContactNo = watch("only_contact_no");

  useEffect(() => {
    let fromDate = DateTime.now().toISODate();

    if (dateFilterPeriod === SEVEN_DAYS) {
      const sevenDaysAgo = DateTime.now().minus({ days: 7 }).toISODate();

      fromDate = sevenDaysAgo;
    }

    if (dateFilterPeriod === ONE_MONTH) {
      const oneMonthAgo = DateTime.now().minus({ months: 1 }).toISODate();

      fromDate = oneMonthAgo;
    }

    setValue("from_date", fromDate);
  }, [dateFilterPeriod]);

  const rangeDateDisable = useMemo(() => {
    return (
      dateFilterPeriod === SEVEN_DAYS ||
      dateFilterPeriod === ONE_MONTH ||
      dateFilterPeriod === TODAY
    );
  }, [dateFilterPeriod]);

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
                sx={{ width: "170px" }}
              />

              <DatePicker
                control={control}
                name="from_date"
                clearable={false}
                disabled={rangeDateDisable}
              />

              <DatePicker
                control={control}
                name="to_date"
                minDate={fromDate ? DateTime.fromISO(fromDate) : DateTime.now()}
                clearable={false}
                disabled={rangeDateDisable}
              />
            </Stack>
          </Stack>
        </PadBox>
      </ContentBox>

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack direction="row" gap="10px">
            <DonationSummaryFilter
              filterListData={filterListData}
              setFilterListData={setFilterListData}
            />

            <DataExport onExport={onExport} />
          </Stack>
        </PadBox>

        <DonationSummaryList
          externalFilter={filterListData}
          onlyContactNo={onlyContactNo}
          fromDate={fromDate}
          toDate={toDate}
        />
      </ContentBox>
    </Stack>
  );
}
