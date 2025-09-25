"use client";

import { ContentBox, DatePicker, PadBox } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";

import { UserLoginReportBreadcrumbs } from "@web/components/user/userLoginReport/UserLoginReportBreadcrumbs";
import { UserLoginReportList } from "@web/components/user/userLoginReport/userLoginReportList/UserLoginReportList";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { control, watch } = useForm({
    defaultValues: {
      from_date: DateTime.now().toISODate(),
      to_date: DateTime.now().toISODate(),
    },
  });

  const fromDate = watch("from_date");

  const toDate = watch("to_date");

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
              <DatePicker
                control={control}
                name="from_date"
                clearable={false}
              />

              <DatePicker
                control={control}
                name="to_date"
                minDate={fromDate ? DateTime.fromISO(fromDate) : DateTime.now()}
                clearable={false}
              />
            </Stack>
          </Stack>
        </PadBox>

        <UserLoginReportList fromDate={fromDate} toDate={toDate} />
      </ContentBox>
    </Stack>
  );
}
