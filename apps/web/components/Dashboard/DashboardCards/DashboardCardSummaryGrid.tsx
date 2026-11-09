import { ContentBox, PadBox, DatePicker } from "@codezee/sixtify-brahma";
import { Box, Stack } from "@mui/material";
import { DateTime } from "luxon";

import { DashboardSummaryCard } from "@web/components/Dashboard/DashboardCards/DashboardSummaryCard";
import {
  DASHBOARD_KEYS,
  useGetDashboardCards,
} from "@web/components/Dashboard/DashboardCards/hooks/useGetDashboardCards";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { formatToIndianNumber } from "@web/utils/helper";

type DashboardCardSummaryGridArgs = {
  branchIds: string;
};

export const DashboardCardSummaryGrid = ({
  branchIds,
}: DashboardCardSummaryGridArgs) => {
  const { control: dateControl, fromDate, toDate } = useDateFilters();

  const { data, isLoading } = useGetDashboardCards({
    branch_id: [branchIds],
    from_date: fromDate,
    to_date: toDate,
  });

  return (
    <Stack gap="10px">
      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction={{ sm: "row", xs: "column" }}
            gap="10px"
            alignItems={{ sm: "center", xs: "stretch" }}
            justifyContent="flex-end"
          >
            <DatePicker
              control={dateControl}
              name="from_date"
              clearable={false}
              containerProps={{ width: { sm: "200px", xs: "100%" } }}
            />

            <DatePicker
              control={dateControl}
              name="to_date"
              minDate={fromDate ? DateTime.fromISO(fromDate) : DateTime.now()}
              clearable={false}
              containerProps={{ width: { sm: "200px", xs: "100%" } }}
            />
          </Stack>
        </PadBox>
      </ContentBox>

      <Stack
        direction="row"
        gap="10px"
        alignItems="flex-start"
        justifyContent={{ sm: "space-between", xs: "flex-start" }}
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          overflowX: { sm: "visible", xs: "auto" },
          overflowY: "hidden",
          scrollbarWidth: "none",
        }}
      >
        {DASHBOARD_KEYS.map((key) => {
          const value =
            formatToIndianNumber(
              data[key],
              key === "total_donation_amount" ? 2 : 0
            ) ?? 0;

          return (
            <Box
              key={key}
              sx={{
                flex: { sm: 1, xs: "0 0 auto" },
                height: "fit-content",
                minWidth: { sm: 0, xs: "260px" },
                width: { sm: "auto", xs: "260px" },
              }}
            >
              <DashboardSummaryCard
                label={key}
                loading={isLoading}
                value={value}
                fromDate={fromDate}
                toDate={toDate}
              />
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
};
