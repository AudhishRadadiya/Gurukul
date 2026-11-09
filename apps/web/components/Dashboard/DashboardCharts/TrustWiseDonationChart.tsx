import { BarChart, NoDataFoundSvg, PadBox } from "@codezee/sixtify-brahma";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { ChartsTooltipContainer, legendClasses } from "@mui/x-charts";
import { t } from "i18next";
import _every from "lodash/every";

import type { DashboardCharts } from "@web/components/Dashboard/DashboardCharts/hooks/useGetTrustWiseDonationChartData";
import { useTrustWiseDonationChartData } from "@web/components/Dashboard/DashboardCharts/hooks/useTrustWiseDonationChartData";
import { TrustWiseDonationChartTooltip } from "@web/components/Dashboard/DashboardCharts/TrustWiseDonationChartTooltip";
import { formatToIndianNumber } from "@web/utils/helper";

type TrustWiseDonationChartProps = {
  loading: boolean;
  trustWiseDonationData: DashboardCharts;
};

export const TrustWiseDonationChart = ({
  loading,
  trustWiseDonationData,
}: TrustWiseDonationChartProps) => {
  const theme = useTheme();

  const { iron, lightBlue, slate } = theme.palette.app.color;

  const { categories, series } = useTrustWiseDonationChartData(
    trustWiseDonationData
  );

  const allZero = _every(series, (item) =>
    _every(item.data, (val) => val === 0)
  );

  return (
    <PadBox padding={{ padding: { sm: "15px", xs: "12px" } }}>
      {!loading && allZero ? (
        <Box
          height={250}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <NoDataFoundSvg />
          <Typography variant="caption">{t("common.no.data.found")}</Typography>
        </Box>
      ) : (
        <Stack direction={{ sm: "row", xs: "column" }} gap={{ sm: 0, xs: 2 }}>
          <Box width={{ sm: "70%", xs: "100%" }} mr={{ sm: 2, xs: 0 }}>
            <BarChart
              loading={loading}
              tooltip="axis"
              series={series}
              xAxis={[
                {
                  barGapRatio: 0.1,
                  categoryGapRatio: 0.4,
                  data: categories,
                  height: 60,
                  id: "xAxis",
                  label: t("common.donation.date"),
                  position: "bottom",
                  scaleType: "band",
                  tickLabelPlacement: "tick",
                  tickPlacement: "middle",
                },
              ]}
              yAxis={[
                {
                  label: t("total.amount.label"),
                },
              ]}
              height={350}
              margin={{
                bottom: 0,
                left: 10,
                right: 10,
                top: 0,
              }}
              slotProps={{
                legend: {
                  direction: "horizontal",
                  position: { horizontal: "end", vertical: "top" },
                  sx: {
                    [`.${legendClasses.mark}`]: {
                      height: 13,
                      width: 13,
                    },
                    [`.${legendClasses.label}`]: {
                      fontSize: 12,
                      fontWeight: 400,
                    },
                  },
                },
              }}
              slots={{
                // eslint-disable-next-line sonarjs/no-unstable-nested-components
                tooltip: (props) => (
                  <ChartsTooltipContainer {...props}>
                    <TrustWiseDonationChartTooltip />
                  </ChartsTooltipContainer>
                ),
              }}
            />
          </Box>

          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            bgcolor={lightBlue[50]}
            width={{ sm: "auto", xs: "100%" }}
            sx={{
              border: `1px solid ${slate[700]}`,
              borderRadius: "5px",
              minWidth: 0,
            }}
          >
            <PadBox padding={{ padding: { sm: "10px", xs: "12px" } }}>
              <Stack gap="10px" width="100%">
                <Typography variant="body1">{t("insights.label")}</Typography>

                <Divider />

                {trustWiseDonationData.trust_wise_total.map((trust) => (
                  <Stack
                    key={trust.trust_id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={1}
                  >
                    <Typography
                      variant="caption"
                      color={iron[900]}
                      noWrap
                      title={trust.trust_name}
                      sx={{ minWidth: 0 }}
                    >
                      {trust.trust_name}
                    </Typography>

                    {loading ? (
                      <Skeleton variant="text" width={80} height={24} />
                    ) : (
                      <Typography variant="subtitle2" flexShrink={0}>
                        {formatToIndianNumber(trust.total_amount, 2) ?? "-"}
                      </Typography>
                    )}
                  </Stack>
                ))}
              </Stack>
            </PadBox>
          </Box>
        </Stack>
      )}
    </PadBox>
  );
};
