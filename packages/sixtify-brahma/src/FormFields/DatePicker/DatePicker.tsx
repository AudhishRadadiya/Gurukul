import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { InputLabel, Stack, type StackProps, useTheme } from "@mui/material";
import type { DatePickerProps as MuiDatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import type { DateView, PickerValidDate } from "@mui/x-date-pickers/models";
import _isFunction from "lodash/isFunction";
import { DateTime } from "luxon";
import React, { useMemo, useState } from "react";
import type {
  FieldError,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { useController } from "react-hook-form";
import { CalendarIconAction } from "../../Actions";
import {
  getDefaultInputLabelProps,
  getDefaultTextFieldSx,
} from "../commonStyles";
import { Skeleton } from "./Skeleton";

export type DatePickerProps<P extends FieldValues> = UseControllerProps<P> &
  MuiDatePickerProps<PickerValidDate> &
  Partial<{
    label?: string;
    required: boolean;
    disabled: boolean;
    format: string;
    error: boolean;
    helperText: string;
    loading: boolean;
    clearable?: boolean;
    view?: DateView[];
    disableKeyboardInput?: boolean;
    setOnFinalChange?: boolean;
    setError: (
      name: keyof P,
      error: FieldError | { type: string; message?: string }
    ) => void;
    containerProps?: StackProps;
    styling?: "custom" | "default";
  }>;

export const dateFormats = {
  dateWithISO8601: "yyyy-MM-dd",
  dateWithEuropean: "dd-MM-yyyy",
};

export const LeftArrowIcon: React.FC = () => {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  return (
    <ChevronLeftIcon
      sx={{
        border: `1px solid ${iron[800]}`,
        borderRadius: "5px",
        p: "4px",
      }}
    />
  );
};

export const RightArrowIcon: React.FC = () => {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  return (
    <ChevronRightIcon
      sx={{
        border: `1px solid ${iron[800]}`,
        borderRadius: "5px",
        p: "4px",
      }}
    />
  );
};

export function DatePicker<P extends FieldValues>({
  setError,
  control,
  defaultValue,
  disabled = false,
  label,
  readOnly = false,
  name,
  error = false,
  helperText,
  loading = false,
  required = false,
  clearable = required ? false : true,
  rules,
  disableKeyboardInput = false,
  setOnFinalChange = false,
  views = ["year", "month", "day"],
  format = dateFormats.dateWithEuropean,
  containerProps,
  styling = "default",
  ...restProps
}: DatePickerProps<P>) {
  const [localError, setLocalError] = useState<string>();

  const {
    field: { value, onChange, ...restField },
  } = useController({ name, control, defaultValue, rules });

  const [open, setOpen] = useState(false);

  const theme = useTheme();

  const { iron, butterflyBlue, mirage } = theme.palette.app.color;

  const finalValue = useMemo(() => {
    if ((disableKeyboardInput || setOnFinalChange) && open) {
      return value ? DateTime.fromISO(value) : undefined;
    }

    return DateTime.fromISO(value);
  }, [value, disableKeyboardInput, setOnFinalChange, open]);

  // eslint-disable-next-line sonarjs/rules-of-hooks
  useMemo(() => {
    if (!error && localError) {
      const timer = setTimeout(() => {
        setLocalError(undefined);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) {
    return <Skeleton label={label} styling={styling} />;
  }

  return (
    <Stack gap="5px" {...containerProps}>
      {label && styling === "custom" && (
        <InputLabel
          sx={{ fontSize: { xs: "14px", md: "16px" } }}
          required={required}
          disabled={disabled}
        >
          {label}
        </InputLabel>
      )}

      <MuiDatePicker<DateTime>
        {...restField}
        {...restProps}
        disabled={disabled}
        views={views}
        format={format}
        value={finalValue}
        readOnly={readOnly}
        open={open && !readOnly}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        slotProps={{
          field: {
            clearable,
            onClear: () => onChange(null),
            readOnly: disableKeyboardInput,
          },
          clearButton: {
            tabIndex: -1,
          },
          textField: {
            disabled,
            error: !!localError || error,
            helperText: localError ?? helperText,
            label: styling === "default" ? label : undefined,
            required: styling === "default" ? required : undefined,
            sx: getDefaultTextFieldSx(styling),
            InputLabelProps: getDefaultInputLabelProps(styling),
            InputProps: {
              endAdornment: (
                <CalendarIconAction
                  disabled={disabled}
                  onClick={() => setOpen(true)}
                  showTooltip={false}
                />
              ),
              sx: {
                "& .MuiInputAdornment-root": {
                  width: "30px",
                },
              },
            },
            onKeyDown: (event) => {
              if (event.key === "Backspace" && clearable) {
                onChange(null);
                setLocalError(undefined);
              } else if (event.key === "Backspace" && !clearable) {
                event.preventDefault();
              }
            },
          },
          day: {
            sx: {
              "&.MuiPickersDay-root": {
                borderRadius: "5px",
                borderColor: butterflyBlue[900],
                fontWeight: 500,
                color: mirage[900],
              },
              "&.MuiPickersDay-root.Mui-selected": {
                backgroundColor: butterflyBlue[900],
                color: iron[600],
              },
              "&.MuiPickersDay-today": {
                color: butterflyBlue[900],
                backgroundColor: iron[600],
              },
              "&.MuiPickersDay-root:not(.Mui-selected):hover": {
                color: butterflyBlue[900],
              },
            },
          },
          calendarHeader: {
            sx: {
              "& .MuiPickersCalendarHeader-label": {
                fontWeight: "500",
                "&:hover": {
                  color: butterflyBlue[900],
                },
              },
            },
          },
          yearButton: {
            sx: {
              "&.MuiPickersYear-yearButton.Mui-selected": {
                backgroundColor: butterflyBlue[900],
                color: iron[600],
              },
              "&.MuiPickersYear-yearButton:not(.Mui-selected):hover": {
                color: butterflyBlue[900],
              },
            },
          },
          monthButton: {
            sx: {
              "&.MuiPickersMonth-monthButton.Mui-selected": {
                backgroundColor: butterflyBlue[900],
                color: iron[600],
              },
              "&.MuiPickersMonth-monthButton:not(.Mui-selected):hover": {
                color: butterflyBlue[900],
              },
            },
          },
        }}
        slots={{
          leftArrowIcon: LeftArrowIcon,
          rightArrowIcon: RightArrowIcon,
        }}
        dayOfWeekFormatter={(weekday) => `${weekday.toFormat("ccc")}`}
        onAccept={(value, details) => {
          if (setOnFinalChange && value?.isValid) {
            onChange(value.toISODate());
            setLocalError(undefined);
          }
          restProps?.onAccept?.(value, details);
        }}
        onChange={(value, details) => {
          if ((disableKeyboardInput || setOnFinalChange) && open) {
            return;
          }

          if (!value) {
            onChange(null);
            setLocalError(undefined);

            return;
          }

          const isValid = value?.isValid === true;

          const hasError = Boolean(details.validationError ?? !isValid);

          onChange(isValid ? value.toISODate() : null);

          const errorMessage = hasError
            ? "Please enter a valid date"
            : undefined;

          setLocalError(errorMessage);

          requestAnimationFrame(() => {
            if (_isFunction(setError) && hasError) {
              setError(name, {
                type: "manual",
                message: errorMessage,
              });
            }
          });

          restProps?.onChange?.(value, details);
        }}
      />
    </Stack>
  );
}
