"use client";

import {
  ContentBox,
  DateRangePickerField,
  PadBox,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { t } from "i18next";

import { WhatsappHistoryList } from "@web/components/report/whatsappHistory/whatsappHistoryList/WhatsappHistoryList";
import { useDateFilters } from "@web/hooks/useDateFilters";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { isMobile } = useGetDeviceType();

  const { control, dateRange } = useDateFilters();

  return (
    <Stack gap={{ md: "10px", xs: "8px" }}>
      <ContentBox>
        <PadBox padding={{ padding: { md: "10px", xs: "8px 10px" } }}>
          <Stack
            direction={{ md: "row", xs: "column" }}
            gap={3}
            justifyContent="space-between"
            alignItems={{ md: "center", xs: "stretch" }}
          >
            <Typography
              variant="subtitle1"
              fontSize={isMobile ? "16px" : "18px"}
              whiteSpace="nowrap"
            >
              {t("common.whatsapp.history.label")}
            </Typography>

            <Box width={{ md: "auto", xs: "100%" }}>
              <DateRangePickerField
                name="date_range"
                control={control}
                showPresets
                size={isMobile ? "small" : "large"}
                placeholder="Select Date Range"
              />
            </Box>
          </Stack>
        </PadBox>

        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <WhatsappHistoryList
            externalFilter={{
              from_date: dateRange[0],
              to_date: dateRange[1],
            }}
          />
        </Box>
      </ContentBox>
    </Stack>
  );
}
