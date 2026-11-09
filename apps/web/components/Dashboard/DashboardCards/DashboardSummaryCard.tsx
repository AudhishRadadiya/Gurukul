import { ArrowUpRight } from "@codezee/sixtify-brahma";
import { Box, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { TOTAL_DONATION_AMOUNT } from "@web/components/common/hooks/constant";
import { useDashboardMapping } from "@web/components/Dashboard/DashboardCards/hooks/useDashboardMapping";
import { useGetDashboardCardNavigationPath } from "@web/components/Dashboard/DashboardCards/hooks/useGetDashboardCardNavigationPath";
import type { DashboardKey } from "@web/components/Dashboard/DashboardCards/hooks/useGetDashboardCards";

type DashboardSummaryCardProps = {
  fromDate: string;
  label: DashboardKey;
  loading: boolean;
  toDate: string;
  value: number | string;
};

export const DashboardSummaryCard = ({
  fromDate,
  label,
  loading,
  toDate,
  value,
}: DashboardSummaryCardProps) => {
  const theme = useTheme();

  const router = useRouter();

  const { butterflyBlue, iron } = theme.palette.app.color;

  const { dashboardMapping } = useDashboardMapping();

  const [totalDonationToggle, setTotalDonationToggle] =
    useState<boolean>(false);

  const info = dashboardMapping[label];

  const { path } = useGetDashboardCardNavigationPath(label, {
    fromDate,
    toDate,
  });

  const onCardClick = () => {
    router.push(path);
  };

  const onIconClick = () => {
    if (info.label === TOTAL_DONATION_AMOUNT) {
      setTotalDonationToggle(!totalDonationToggle);
    }
  };

  return (
    <Box
      sx={{
        background: iron[600],
        border: `1px solid ${butterflyBlue[300]}`,
        borderRadius: "6px",
        height: "auto",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <Box sx={{ p: "7px" }}>
        <Stack
          direction="row"
          alignItems="center"
          position="relative"
          sx={{
            backgroundColor: info.bgColor,
            border: `1px solid ${iron[700]}`,
            borderRadius: "12px",
            overflow: "hidden",
            padding: "10px 28px 10px 10px",
          }}
        >
          <Box
            sx={{
              cursor: "pointer",
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <ArrowUpRight onClick={onCardClick} />
          </Box>

          <Stack
            direction="row"
            gap={{ sm: "22px", xs: "12px" }}
            alignItems="center"
            width="100%"
          >
            <Box
              onClick={onIconClick}
              sx={{
                alignItems: "center",
                cursor: "pointer",
                display: "flex",
                flexShrink: 0,
              }}
            >
              {info.icon}
            </Box>

            <Stack gap="4px" onClick={onCardClick} sx={{ cursor: "pointer" }}>
              {loading ? (
                <Box width={40} height={24}>
                  <Skeleton variant="rectangular" sx={{ height: "100%" }} />
                </Box>
              ) : (
                <Typography
                  variant="h5"
                  sx={{ fontSize: { sm: "20px", xs: "18px" }, fontWeight: 600 }}
                >
                  {totalDonationToggle ? "********" : value}
                </Typography>
              )}

              <Typography
                variant="body2"
                color={butterflyBlue[400]}
                fontWeight={300}
                noWrap
                title={info.label}
              >
                {info.label}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};
