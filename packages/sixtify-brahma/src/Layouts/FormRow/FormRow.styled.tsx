import type { StackProps } from "@mui/material";
import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { ComponentType } from "react";
import { Children } from "react";

function calculateWidth(
  childrenCount: number,
  fullWidth: boolean,
  maxColumn: number
) {
  if (maxColumn <= 2 && childrenCount <= 2 && !fullWidth) {
    return "calc(50% - 10px)";
  }

  if (childrenCount <= 3 && !fullWidth) {
    return "calc(33% - 20px)";
  }

  return "100%";
}

type RowContainerStyledProps = StackProps & {
  fullWidth: boolean;
  maxColumn: number;
};

export const RowContainerStyled: ComponentType<RowContainerStyledProps> =
  styled(Stack, {
    shouldForwardProp(prop) {
      return prop !== "fullWidth" && prop !== "maxColumn";
    },
  })<{ fullWidth: boolean; maxColumn: number }>(({
    theme,
    children,
    fullWidth,
    maxColumn,
  }) => {
    const childrenCount = Children.toArray(children).length;

    const flexBasis = calculateWidth(childrenCount, fullWidth, maxColumn);

    return {
      "& > *": {
        flexBasis,
        [theme.breakpoints.down("sm")]: {
          flexBasis: "100%",
        },
      },
    };
  });
