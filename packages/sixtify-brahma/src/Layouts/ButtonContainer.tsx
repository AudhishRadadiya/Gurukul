import { Stack } from "@mui/material";

import type { PropsWithChildren } from "react";
import { useGetDeviceType } from "../utils/hooks/useGetDeviceType";
import { FormGridLayout } from "./FormGridLayout";
type ButtonContainerProps = PropsWithChildren & {
  columns?: number;
  columnsOnMobile?: number;
};

export const ButtonContainer = ({
  columns = 2,
  columnsOnMobile = 2,
  children,
}: ButtonContainerProps) => {
  const { layout } = useGetDeviceType();

  return layout === "mobile" ? (
    <FormGridLayout columnsOnMobile={columnsOnMobile} columns={columns}>
      {children}
    </FormGridLayout>
  ) : (
    <Stack direction="row" gap="5px">
      {children}
    </Stack>
  );
};
