import { styled } from "@mui/material/styles";
import type { PieSeriesType, PieValueType } from "@mui/x-charts";
import { useDrawingArea } from "@mui/x-charts/hooks";
import type { MakeOptional } from "@mui/x-charts/internals";
import type { PieChartProps as MuiPieChartProps } from "@mui/x-charts/PieChart";
import { PieChart as MuiPieChart } from "@mui/x-charts/PieChart";
import type { ReactNode } from "react";
import { Skeleton } from "./Skeleton";

type PieChartProps = Omit<MuiPieChartProps, "series"> & {
  series: MakeOptional<PieSeriesType<MakeOptional<PieValueType, "id">>, "type">;
  label?: string;
  valueFormatter?: (item: { value: number }) => string;
  loading?: boolean;
};

type PieCenterLabelProps = {
  children: ReactNode;
};

export const PieChart = ({
  height = 235,
  skipAnimation = false,
  loading = false,
  valueFormatter = (item: MakeOptional<PieValueType, "id">) => `${item.value}%`,
  tooltip,
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
        transform: "translate(50px, 0px)",
        overflow: "visible",
      }}
      series={[
        {
          arcLabel: (params) => params.label ?? "",
          arcLabelMinAngle: 20,
          valueFormatter,
          ...series,
        },
      ]}
      {...rest}
      tooltip={tooltip}
      skipAnimation={skipAnimation}
    >
      <PieCenterLabel>{label}</PieCenterLabel>
    </MuiPieChart>
  );
};
