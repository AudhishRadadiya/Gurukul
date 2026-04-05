import { Skeleton } from "@mui/material";
import { styled, type Theme } from "@mui/material/styles";
import type { BarSeriesType, ChartsTooltipProps } from "@mui/x-charts";
import type { BarChartProps as MuiBarChartProps } from "@mui/x-charts/BarChart";
import { BarChart as MuiBarChart } from "@mui/x-charts/BarChart";

type ExtendedBarSeriesType = Partial<BarSeriesType> & {
  color?: string;
  colorMap?: { [key: string]: string };
  getColor?: (
    value: number,
    index: number,
    data: readonly (number | null)[]
  ) => string;
};

type BarChartProps = Omit<MuiBarChartProps, "series"> & {
  series: ExtendedBarSeriesType[];
  xAxisData?: string[];
  yAxisLabel?: string;
  xAxisLabel?: string;
  loading?: boolean;
  layout?: MuiBarChartProps["layout"];
  height?: MuiBarChartProps["height"];
  width?: MuiBarChartProps["width"];
  skipAnimation?: boolean;
  tooltip?: ChartsTooltipProps["trigger"];
  theme?: Theme;
};

const StyledBarChart = styled(MuiBarChart)(({ theme }) => ({
  "& .MuiChartsAxis-tick": {
    stroke: theme.palette.text.secondary,
  },
  "& .MuiChartsAxis-line": {
    stroke: theme.palette.divider,
  },
  "& .MuiChartsAxis-tickLabel": {
    fill: theme.palette.text.secondary,
    fontSize: 12,
  },
  "& .MuiChartsLegend-mark": {
    rx: 4,
  },
}));

export const BarChart = ({
  height = 300,
  width,
  skipAnimation = false,
  loading = false,
  tooltip = "item",
  series,
  layout = "vertical",
  ...rest
}: BarChartProps) => {
  if (loading) {
    return <Skeleton height={height} width={width} variant="rectangular" />;
  }

  return (
    <StyledBarChart
      height={height}
      width={width}
      series={series}
      layout={layout}
      skipAnimation={skipAnimation}
      slotProps={{ tooltip: { trigger: tooltip } }}
      {...rest}
    />
  );
};
