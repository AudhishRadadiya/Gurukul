import type { PropsWithChildren } from "react";
import { RowContainerStyled } from "./FormRow.styled";

export const FormRow = ({
  children,
  fullWidth = false,
  maxColumn = 3,
}: PropsWithChildren<{ fullWidth?: boolean; maxColumn?: number }>) => {
  return (
    <RowContainerStyled
      direction="row"
      flexWrap="wrap"
      gap="20px"
      fullWidth={fullWidth}
      maxColumn={maxColumn}
    >
      {children}
    </RowContainerStyled>
  );
};
