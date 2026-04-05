import { Skeleton } from "@mui/material";
import { styled, type Theme } from "@mui/material/styles";
import type { ChartsTooltipProps, LineSeriesType } from "@mui/x-charts";
import type { LineChartProps as MuiLineChartProps } from "@mui/x-charts/LineChart";
import { LineChart as MuiLineChart } from "@mui/x-charts/LineChart";

type ExtendedLineSeriesType = Partial<LineSeriesType> & {
  color?: string;
  colorMap?: { [key: string]: string };
  strokeWidth?: number;
  getColor?: (
    value: number,
    index: number,
    data: readonly (number | null)[]
  ) => string;
};

type LineChartProps = Omit<MuiLineChartProps, "series"> & {
  series: ExtendedLineSeriesType[];
  xAxisData?: string[];
  yAxisLabel?: string;
  xAxisLabel?: string;
  loading?: boolean;
  height?: MuiLineChartProps["height"];
  width?: MuiLineChartProps["width"];
  hideLegend?: boolean;
  grid?: { horizontal?: boolean; vertical?: boolean };
  tooltip?: ChartsTooltipProps["trigger"];
  theme?: Theme;
};

const StyledLineChart = styled(MuiLineChart)(({ theme }) => ({
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

export const LineChart = ({
  height = 300,
  width,
  skipAnimation = false,
  loading = false,
  tooltip = "item",
  series,
  xAxisData,
  yAxisLabel,
  xAxisLabel,
  grid = { horizontal: false, vertical: false },
  ...rest
}: LineChartProps) => {
  if (loading) {
    return <Skeleton height={height} width={width} variant="rectangular" />;
  }

  const xAxisConfig = xAxisData
    ? [
        {
          data: xAxisData,
          scaleType: "point" as const,
          label: xAxisLabel,
        },
      ]
    : undefined;

  const yAxisConfig = yAxisLabel
    ? [
        {
          label: yAxisLabel,
          width: 50,
        },
      ]
    : undefined;

  return (
    <StyledLineChart
      height={height}
      width={width}
      series={series}
      xAxis={xAxisConfig}
      yAxis={yAxisConfig}
      skipAnimation={skipAnimation}
      grid={grid}
      slotProps={{
        tooltip: { trigger: tooltip },
      }}
      {...rest}
    />
  );
};
