"use client";

import { ContentBox, DatePicker, PadBox } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { DateTime } from "luxon";

import { DateFilterPeriodAutocomplete } from "@web/components/common/Autocomplete/DateFilterPeriodAutocomplete";
import { UserLoginReportBreadcrumbs } from "@web/components/user/userLoginReport/UserLoginReportBreadcrumbs";
import { UserLoginReportList } from "@web/components/user/userLoginReport/userLoginReportList/UserLoginReportList";
import { useDateFilters } from "@web/hooks/useDateFilters";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { control, fromDate, toDate } = useDateFilters();

  return (
    <Stack gap="10px">
      <UserLoginReportBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="subtitle1">
              {t("common.user.login.report")}
            </Typography>

            <Stack direction="row" alignItems="center" gap="10px">
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

        <UserLoginReportList
          externalFilter={{
            from_date: fromDate,
            to_date: toDate,
          }}
        />
      </ContentBox>
    </Stack>
  );
}
