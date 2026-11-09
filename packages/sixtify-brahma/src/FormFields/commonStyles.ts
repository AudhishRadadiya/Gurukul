import type { SxProps, Theme } from "@mui/material";
import type { SizeType } from "../utils";
import { getInputLabelStyleConfig } from "./utils/helper";

export const getDefaultInputLabelProps = (
  styling?: "custom" | "default",
  size?: SizeType,
  isMultiline?: boolean
): { sx?: SxProps<Theme> } | undefined => {
  if (styling !== "default") {
    return undefined;
  }

  const { fontSize, topMargin, scale } = getInputLabelStyleConfig(size);

  return {
    sx: {
      opacity: 0.8,
      "&:not(.MuiInputLabel-shrink)": {
        fontSize: isMultiline ? "13px" : fontSize,
        top: `calc(var(--input-base-height, ${isMultiline ? 22 : topMargin}px) / 2)`,
        transform: "translate(14px, -8%)",
      },
      "&.MuiInputLabel-shrink": {
        transform: `translate(14px, -8px) scale(${scale})`,
      },
    },
  };
};

export const getDefaultTextFieldSx = (
  styling?: "custom" | "default"
  // eslint-disable-next-line sonarjs/function-return-type
): SxProps<Theme> | undefined => {
  if (styling !== "default") {
    return undefined;
  }

  return {
    "& .MuiInputBase-root": {
      "--input-base-height": "100%",
    },
    "&.MuiTextField-sizeSmall .MuiInputBase-root": {
      "--input-base-height-small": "40px",
    },
  };
};

export const getDefaultFormControlSx = (
  styling?: "custom" | "default"
  // eslint-disable-next-line sonarjs/function-return-type
): SxProps<Theme> | undefined => {
  if (styling !== "default") {
    return undefined;
  }

  return {
    "& .MuiInputBase-root": {
      "--input-base-height": "100%",
    },
  };
};

export const getDefaultInputLabelSx = (
  styling?: "custom" | "default"
  // eslint-disable-next-line sonarjs/function-return-type
): SxProps<Theme> | undefined => {
  if (styling !== "default") {
    return undefined;
  }

  return {
    opacity: 0.8,
    "&:not(.MuiInputLabel-shrink)": {
      fontSize: "14px",
      top: "calc(var(--input-base-height, 56px) / 2)",
      transform: "translate(14px, -90%)",
    },
    "&.MuiInputLabel-shrink": {
      transform: "translate(14px, -9px) scale(0.75)",
    },
  };
};
