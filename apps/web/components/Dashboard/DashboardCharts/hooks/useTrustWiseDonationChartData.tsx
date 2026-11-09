import type { BarSeriesType } from "@mui/x-charts";
import _map from "lodash/map";
import _sortBy from "lodash/sortBy";
import _split from "lodash/split";
import _toNumber from "lodash/toNumber";
import { useMemo } from "react";

import type {
  DashboardCharts,
  LastNDaysTrustWise,
} from "@web/components/Dashboard/DashboardCharts/hooks/useGetTrustWiseDonationChartData";
import { formatToIndianNumber } from "@web/utils/helper";

const colorPalette = {
  blue: ["#BBDEFB", "#90CAF9", "#64B5F6"],
  gray: ["#cfcbcb", "#b3adad", "#979696"],
  orange: ["#FFE0B2", "#FFCC80", "#FFB74D"],
  pink: ["#F8BBD0", "#F48FB1", "#F06292"],
  purple: ["#E1BEE7", "#CE93D8", "#BA68C8"],
};

type SeriesValueFormatterContext = {
  dataIndex: number;
};

const getModeWiseLines = (
  modeWiseTotals: Record<string, number | string> | null | undefined
) => {
  return Object.entries(modeWiseTotals ?? {}).map(
    ([mode, amount]) => `${mode}: ${formatToIndianNumber(amount, 2) ?? "-"}`
  );
};

export function useTrustWiseDonationChartData(
  trustWiseDonationData?: DashboardCharts
) {
  const flatColors = Object.values(colorPalette).flat();

  const getColor = (index: number) => {
    return flatColors[index % flatColors.length];
  };

  return useMemo(() => {
    if (!trustWiseDonationData?.last_n_days_trust_wise.length) {
      return { categories: [], series: [] };
    }

    const { amountByDateAndTrust, modeByDateAndTrust } =
      trustWiseDonationData.last_n_days_trust_wise.reduce(
        (
          acc: {
            amountByDateAndTrust: Record<string, Record<string, number>>;
            modeByDateAndTrust: Record<
              string,
              Record<string, Record<string, number | string>>
            >;
          },
          item: LastNDaysTrustWise
        ) => {
          const {
            donation_date,
            donation_mode_wise_total,
            short_name,
            total_amount,
          } = item;

          if (!acc.amountByDateAndTrust[donation_date]) {
            acc.amountByDateAndTrust[donation_date] = {};
          }

          if (!acc.modeByDateAndTrust[donation_date]) {
            acc.modeByDateAndTrust[donation_date] = {};
          }

          acc.amountByDateAndTrust[donation_date][short_name] =
            Number(total_amount);

          acc.modeByDateAndTrust[donation_date][short_name] =
            donation_mode_wise_total ?? {};

          return acc;
        },
        { amountByDateAndTrust: {}, modeByDateAndTrust: {} }
      );

    const categories: string[] = _sortBy(
      _map(amountByDateAndTrust, (_, key) => key),
      (date) => _toNumber(_split(date, "-")[0])
    );

    const series: BarSeriesType[] = trustWiseDonationData.trust_wise_total.map(
      (trust, index) => {
        return {
          color: getColor(index),
          data: categories.map(
            (date) => amountByDateAndTrust[date]?.[trust.short_name] ?? 0
          ),
          label: trust.short_name,
          stack: "total",
          type: "bar",
          valueFormatter: (
            value: number | null,
            context: SeriesValueFormatterContext
          ) => {
            const formattedValue = `${formatToIndianNumber(value, 2) ?? "-"}`;

            const date = categories[context.dataIndex] ?? null;

            const modeWiseTotals = date
              ? modeByDateAndTrust[date]?.[trust.short_name]
              : null;

            const modeWiseLines = getModeWiseLines(modeWiseTotals);

            if (modeWiseLines.length === 0) {
              return formattedValue;
            }

            const modeWiseLinesString = modeWiseLines
              // eslint-disable-next-line sonarjs/no-nested-functions
              .map((line) => `  ${line}`)
              .join("\n");

            return `${formattedValue}\n${modeWiseLinesString}`;
          },
        };
      }
    );

    return { categories, series };
  }, [trustWiseDonationData]);
}
