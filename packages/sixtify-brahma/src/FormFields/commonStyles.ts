import type { SxProps, Theme } from "@mui/material";

export const getDefaultInputLabelProps = (
  styling?: "custom" | "default"
): { sx?: SxProps<Theme> } | undefined => {
  if (styling !== "default") {
    return undefined;
  }

  return {
    sx: {
      opacity: 0.8,
      "&:not(.MuiInputLabel-shrink)": {
        fontSize: "14px",
        top: "calc(var(--input-base-height, 56px) / 2)",
        transform: "translate(14px, -90%)",
      },
      "&.MuiInputLabel-shrink": {
        transform: "translate(14px, -9px) scale(0.75)",
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
