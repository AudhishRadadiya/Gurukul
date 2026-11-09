"use client";

import {
  ContentBox,
  DateRangePickerField,
  PadBox,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";

import { UserLoginReportList } from "@web/components/user/userLoginReport/userLoginReportList/UserLoginReportList";
import { useDateFilters } from "@web/hooks/useDateFilters";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { control, dateRange } = useDateFilters();

  const { layout } = useGetDeviceType();

  const isMobile = layout === "mobile";

  return (
    <Stack gap="10px">
      <ContentBox>
        <PadBox padding={{ padding: { sm: "10px", xs: "10px 10px 12px" } }}>
          <Stack
            direction={{ sm: "row", xs: "column" }}
            alignItems={{ sm: "center", xs: "stretch" }}
            justifyContent="space-between"
            gap={{ sm: 2, xs: 1.5 }}
          >
            <Typography
              variant="subtitle1"
              fontSize={{ lg: "18px", xs: "16px" }}
            >
              {t("common.user.login.report")}
            </Typography>

            <Stack>
              <DateRangePickerField
                name="date_range"
                control={control}
                showPresets
                size={isMobile ? "small" : "large"}
                placeholder="Select Date Range"
              />
            </Stack>
          </Stack>
        </PadBox>

        <UserLoginReportList
          externalFilter={{
            from_date: dateRange[0],
            to_date: dateRange[1],
          }}
        />
      </ContentBox>
    </Stack>
  );
}
