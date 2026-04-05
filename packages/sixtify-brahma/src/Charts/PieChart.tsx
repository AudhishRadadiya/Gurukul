import { styled, type Theme } from "@mui/material/styles";
import type {
  ChartsTooltipProps,
  PieSeriesType,
  PieValueType,
} from "@mui/x-charts";
import { useDrawingArea } from "@mui/x-charts/hooks";
import type { PieChartProps as MuiPieChartProps } from "@mui/x-charts/PieChart";
import { PieChart as MuiPieChart } from "@mui/x-charts/PieChart";
import type { ReactNode } from "react";
import { Skeleton } from "./Skeleton";

type PieChartProps = Omit<MuiPieChartProps, "series"> & {
  series: Partial<PieSeriesType<Partial<PieValueType>>>;
  label?: string;
  valueFormatter?: (item: { value: number }) => string;
  loading?: boolean;
  tooltip?: ChartsTooltipProps["trigger"];
  theme?: Theme;
};

type PieCenterLabelProps = {
  children: ReactNode;
};

export const PieChart = ({
  height = 235,
  skipAnimation = false,
  loading = false,
  valueFormatter = (item: Partial<PieValueType>) => `${item.value}%`,
  tooltip = "item",
  label,
  series,
  ...rest
}: PieChartProps) => {
  const StyledText = styled("text")(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 20,
  }));

  const outerRadius = Number(series.outerRadius ?? 0);

  const innerRadius = Number(series.innerRadius ?? 0);

  const radius = outerRadius - innerRadius;

  // eslint-disable-next-line sonarjs/no-unstable-nested-components
  const PieCenterLabel = ({ children }: PieCenterLabelProps) => {
    const { width, height, left, top } = useDrawingArea();

    return (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>
    );
  };

  if (loading) {
    return <Skeleton height={height} radius={radius} />;
  }

  return (
    <MuiPieChart
      height={height}
      sx={{
        transform: "translate(0px, 0px)",
        overflow: "visible",
        "& .MuiPieArcLabel-root": {
          display: "none",
        },
      }}
      series={[
        {
          type: "pie",
          data: series.data as readonly PieValueType[],
          arcLabel: (params) => params.label ?? "",
          arcLabelMinAngle: 20,
          valueFormatter,
          innerRadius: series.innerRadius,
          outerRadius: series.outerRadius,
        },
      ]}
      slotProps={{
        tooltip: {
          trigger: tooltip,
        },
      }}
      {...rest}
      skipAnimation={skipAnimation}
    >
      <PieCenterLabel>{label}</PieCenterLabel>
    </MuiPieChart>
  );
};
