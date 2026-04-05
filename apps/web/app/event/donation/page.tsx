"use client";

import { ContentBox, DatePicker, PadBox } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { DateFilterPeriodAutocomplete } from "@web/components/common/Autocomplete/DateFilterPeriodAutocomplete";
import { CUSTOM, SEVEN_DAYS } from "@web/components/common/hooks/constant";
import { EventDonationBreadcrumbs } from "@web/components/Event/eventDonation/EventDonationBreadcrumbs";
import { EventDonationList } from "@web/components/Event/eventDonation/eventDonationList/EventDonationList";
import { useDateFilters } from "@web/hooks/useDateFilters";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const searchParams = useSearchParams();

  const {
    control: dateControl,
    fromDate,
    setValue: setDateValue,
    toDate,
  } = useDateFilters();

  useEffect(() => {
    const urlFromDate = searchParams.get("from_date");

    const urlToDate = searchParams.get("to_date");

    if (urlFromDate && urlToDate) {
      setDateValue("date_filter_period", CUSTOM);
      setDateValue("from_date", urlFromDate);
      setDateValue("to_date", urlToDate);
    } else {
      setDateValue("date_filter_period", SEVEN_DAYS);
    }
  }, [searchParams]);

  return (
    <Stack gap="10px">
      <EventDonationBreadcrumbs />
      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack direction="row" gap="10px" justifyContent="space-between">
            <Typography variant="subtitle1">
              {t("common.event.wise.donation")}
            </Typography>

            <Stack direction="row" gap="10px" alignItems="center">
              <DateFilterPeriodAutocomplete
                name="date_filter_period"
                control={dateControl}
                clearIcon
                sx={{ width: "160px" }}
              />

              <DatePicker
                control={dateControl}
                name="from_date"
                clearable={false}
                containerProps={{ width: "160px" }}
              />

              <DatePicker
                control={dateControl}
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
        <EventDonationList
          externalDateFilter={{
            from_date: fromDate,
            to_date: toDate,
          }}
        />
      </ContentBox>
    </Stack>
  );
}
