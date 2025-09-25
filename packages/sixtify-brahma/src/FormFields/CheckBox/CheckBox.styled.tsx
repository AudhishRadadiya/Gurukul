import { Check } from "@mui/icons-material";
import type { BoxProps, CSSObject, CheckboxProps } from "@mui/material";
import { Box, styled } from "@mui/material";
import type { ComponentType } from "react";
type BoxStyledProps = {
  size: CheckboxProps["size"];
} & BoxProps;

type CheckStyledProps = {
  size: CheckboxProps["size"];
} & CheckboxProps;

export const BoxStyled: ComponentType<BoxStyledProps> = styled(Box)<{
  size: CheckboxProps["size"];
}>(({ theme, size }) => {
  const { color } = theme.palette.app;

  const checkBoxSize =
    size === "small"
      ? {
          width: "14px",
          height: "14px",
        }
      : {
          width: "20px",
          height: "20px",
        };

  const style: CSSObject = {
    ...checkBoxSize,
    borderRadius: "4px",
    border: `2px solid ${color.iron[900]}`,
    "input:hover ~ &": {
      borderColor: color.butterflyBlue[900],
    },
    "input:disabled ~ &": {
      borderColor: color.iron[800],
    },
  };

  return style;
});

export const CheckStyled: ComponentType<CheckStyledProps> = styled(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Check as any
)<{
  size: CheckboxProps["size"];
}>(({ theme, size }) => {
  const { color } = theme.palette.app;

  const checkBoxSize =
    size === "small"
      ? {
          width: "14px",
          height: "14px",
        }
      : {
          width: "20px",
          height: "20px",
        };

  const style: CSSObject = {
    ...checkBoxSize,
    border: `2px solid ${color.butterflyBlue[900]}`,
    borderRadius: "4px",
    color: color.iron[600],
    backgroundColor: color.butterflyBlue[900],
    "input:disabled ~ &": {
      borderColor: color.iron[800],
      backgroundColor: color.iron[800],
    },
  };

  return style;
});
