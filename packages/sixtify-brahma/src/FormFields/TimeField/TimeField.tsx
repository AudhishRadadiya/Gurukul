import { InputLabel, Stack, useTheme } from "@mui/material";
import {
  TimeField as MuiTimeField,
  type TimeFieldProps as MuiTimeFieldProps,
} from "@mui/x-date-pickers/TimeField";
import { DateTime } from "luxon";
import type {
  FieldValues,
  Path,
  PathValue,
  UseControllerProps,
} from "react-hook-form";
import { useController } from "react-hook-form";
import type { PickerValidDate } from "@mui/x-date-pickers/models";
import { Skeleton } from "./Skeleton";

export type TimeFieldProps<P extends FieldValues> = UseControllerProps<P> &
  MuiTimeFieldProps<PickerValidDate> &
  Partial<{
    label: string;
    required: boolean;
    disabled: boolean;
    error: boolean;
    helperText: string;
    loading: boolean;
    format: string;
    isReturnLocalTime: boolean;
    isReturnDateWithTime: boolean;
  }>;

export function TimeField<P extends FieldValues>({
  control,
  defaultValue,
  disabled = false,
  label,
  name,
  error,
  helperText,
  loading = false,
  required = false,
  rules,
  format = "HH:mm",
  isReturnLocalTime = false,
  isReturnDateWithTime = false,
  ...restProps
}: TimeFieldProps<P>) {
  const {
    field: { value, onChange, ...restField },
  } = useController({ name, control, defaultValue, rules });

  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  if (error && value && typeof value === "object") {
    helperText = "Invalid time";
  }

  const pickerValue = value
    ? (DateTime.fromISO(value) as PathValue<P, Path<P> & (string | undefined)>)
    : null;

  if (loading) {
    return <Skeleton label={label} />;
  }

  return (
    <Stack gap="10px">
      {label && (
        <InputLabel required={required} disabled={disabled}>
          {label}
        </InputLabel>
      )}
      <MuiTimeField<DateTime>
        {...restField}
        {...restProps}
        disabled={disabled}
        value={pickerValue}
        onChange={(value) => {
          if (value?.isValid) {
            if (isReturnLocalTime) {
              return onChange(value.toFormat(format));
            }

            if (isReturnDateWithTime) {
              return onChange(value.toUTC().toISO());
            }

            onChange(value.toUTC().toISOTime());
          } else {
            onChange(value);
          }
        }}
        slotProps={{
          textField: {
            disabled,
            helperText,
            error,
            sx: {
              backgroundColor: "white",
              "& .Mui-selected": {
                backgroundColor: butterflyBlue[900],
                borderRadius: "5px",
              },
            },
          },
        }}
        format={format}
        helperText={helperText}
        sx={{
          backgroundColor: "white",
          "& .Mui-selected": {
            backgroundColor: butterflyBlue[900],
            borderRadius: "5px",
          },
        }}
      />
    </Stack>
  );
}
