import { Stack, type StackProps } from "@mui/material";
import type { PropsWithChildren } from "react";

type GridProviderProps = PropsWithChildren &
  StackProps & {
    gap?: number | string;
    columns?: number;
    columnsOnMobile?: number;
    columnsOnSmallDevice?: number;
    columnsOnTablet?: number;
  };

export const GridProvider = ({
  children,
  gap,
  columns = 3,
  columnsOnMobile = 1,
  columnsOnSmallDevice = 2,
  columnsOnTablet = 3,
  ...props
}: GridProviderProps) => {
  return (
    <Stack
      {...props}
      display="grid"
      gap={gap}
      gridTemplateColumns={{
        xs: `repeat(${columnsOnMobile},  minmax(0, 1fr))`,
        sm: `repeat(${Math.min(columns, columnsOnSmallDevice)},  minmax(0, 1fr))`,
        md: `repeat(${Math.min(columns, columnsOnTablet)},  minmax(0, 1fr))`,
        lg: `repeat(${columns},  minmax(0, 1fr))`,
      }}
    >
      {children}
    </Stack>
  );
};
