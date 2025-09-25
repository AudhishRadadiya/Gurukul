import type { SwitchProps } from "@mui/material";
import { Switch as MuiSwitch, useTheme } from "@mui/material";
import {
  useController,
  type ControllerRenderProps,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { Skeleton } from "./Skeleton";

export type SwitchFieldProps<P extends FieldValues> = UseControllerProps<P> &
  Omit<Omit<SwitchProps, "checked">, keyof ControllerRenderProps<P>> & {
    loading?: boolean;
  };

export function SwitchField<P extends FieldValues>({
  name,
  rules,
  control,
  defaultValue,
  loading = false,
  ...restSwitchProps
}: SwitchFieldProps<P>) {
  const theme = useTheme();

  const { butterflyBlue, iron } = theme.palette.app.color;

  const {
    field: { value = false, ...restField },
  } = useController({ name, control, defaultValue, rules });

  if (loading) {
    return <Skeleton />;
  }

  return (
    <MuiSwitch
      checked={value}
      {...restField}
      {...restSwitchProps}
      sx={{
        padding: 1,
        "& .MuiSwitch-track": {
          borderRadius: 11,
          backgroundColor: iron[900],
          position: "relative",
          "&::before": {
            content: "unset",
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: 16,
            height: 16,
            left: 12,
          },
          "&::after": {
            content: "unset",
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: 16,
            height: 16,
            right: 12,
          },
        },
        "& .MuiSwitch-thumb": {
          boxShadow: "none",
          width: 16,
          height: 16,
          margin: 0.15,
          color: "white",
        },
        "& .Mui-checked + .MuiSwitch-track": {
          backgroundColor: `${butterflyBlue[900]} !important`,
          opacity: `${1} !important`,
        },
      }}
    />
  );
}
