import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, InputLabel, Stack, Tooltip, useTheme } from "@mui/material";
import type { DateTimePickerProps as MuiDateTimePickerProps } from "@mui/x-date-pickers/DateTimePicker";
import { DateTimePicker as MuiDateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import type { PickerValidDate } from "@mui/x-date-pickers/models";
import { DateTime } from "luxon";
import React, { type ReactElement, useState } from "react";
import type {
  FieldError,
  FieldValues,
  Path,
  PathValue,
  UseControllerProps,
} from "react-hook-form";
import { useController } from "react-hook-form";
import { CalendarIconAction } from "../../Actions";
import { Skeleton } from "./Skeleton";

export type DateTimePickerProps<P extends FieldValues> = UseControllerProps<P> &
  MuiDateTimePickerProps<PickerValidDate> &
  Partial<{
    label: string;
    required: boolean;
    disabled: boolean;
    format: string;
    error: boolean;
    helperText: string;
    loading: boolean;
    clearable?: boolean;
    helperIcon?: ReactElement;
    toolTipText?: string;
    timeStepsMinutes?: number;
    setError: (
      name: keyof P,
      error: FieldError | { type: string; message?: string }
    ) => void;
  }>;

const hoverTextStyle = (color: string) => ({
  "&:hover": {
    color,
  },
});

const LeftArrowIcon: React.FC = () => {
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

const RightArrowIcon: React.FC = () => {
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

export function DateTimePicker<P extends FieldValues>({
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
  format = "dd-MM-yyyy HH:mm",
  helperIcon,
  toolTipText,
  timeStepsMinutes = 1,
  ...restProps
}: DateTimePickerProps<P>) {
  const {
    field: { value, onChange, ...restField },
  } = useController({ name, control, defaultValue, rules });

  const [open, setOpen] = useState(false);

  if (error && value && typeof value === "object") {
    helperText = "Invalid time";
  }

  const theme = useTheme();

  const { iron, butterflyBlue, mirage } = theme.palette.app.color;

  const pickerValue = value
    ? (DateTime.fromISO(value) as PathValue<P, Path<P> & (string | undefined)>)
    : null;

  if (loading) {
    return (
      <Box sx={{ width: "350px" }}>
        <Skeleton label={label} />
      </Box>
    );
  }

  const EmptyIcon = () => null;

  return (
    <Stack gap="10px">
      {label && (
        <Stack alignItems="center" flexDirection="row" gap="5px">
          <InputLabel required={required} disabled={disabled}>
            {label}
          </InputLabel>
          {helperIcon && toolTipText && (
            <Tooltip title={toolTipText} placement="bottom">
              {helperIcon}
            </Tooltip>
          )}
        </Stack>
      )}
      <MuiDateTimePicker<DateTime>
        {...restField}
        {...restProps}
        disabled={disabled}
        readOnly={readOnly}
        open={open}
        ampm={false}
        value={pickerValue}
        timeSteps={{ minutes: timeStepsMinutes }}
        format={format}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        slotProps={{
          field: {
            clearable,
            onClear: () => onChange(null),
          },
          clearButton: {
            tabIndex: -1,
          },
          textField: {
            disabled,
            helperText,
            error,
            InputProps: {
              endAdornment: (
                <CalendarIconAction onClick={() => setOpen(true)} />
              ),
              sx: {
                "& .MuiInputAdornment-root": {
                  width: "30px",
                },
              },
            },
          },
          popper: {
            sx: {
              "& .MuiMultiSectionDigitalClockSection-root::after": {
                display: "unset",
              },
              "& .MuiList-padding": {
                padding: "10px",
              },
              "& .MuiMultiSectionDigitalClockSection-item:not(.Mui-selected)": {
                padding: "4px",
                ...hoverTextStyle(butterflyBlue[900]),
              },
              "& .MuiMultiSectionDigitalClockSection-item": {
                padding: "4px",
              },
              "& .MuiMultiSectionDigitalClockSection-item.Mui-selected": {
                backgroundColor: butterflyBlue[900],
                borderRadius: "5px",
                "&:hover": {
                  backgroundColor: butterflyBlue[900],
                  color: iron[600],
                },
              },
              "& .Mui-selected:hover": {
                backgroundColor: butterflyBlue[900],
                borderRadius: "5px",
              },
              "& .MuiMultiSectionDigitalClockSection-item.Mui-selected:focus-visible":
                {
                  backgroundColor: `${butterflyBlue[900]} !important`,
                  borderRadius: "5px",
                },
              "& .Mui-selected:focus-visible": {
                backgroundColor: butterflyBlue[900],
                borderRadius: "5px",
              },
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
              "&.MuiPickersDay-root:not(.Mui-selected)": {
                ...hoverTextStyle(butterflyBlue[900]),
              },
              "&.MuiPickersDay-today": {
                color: butterflyBlue[900],
                backgroundColor: iron[600],
              },
              ":focus": {
                backgroundColor: "transparent",
              },
            },
          },
          calendarHeader: {
            sx: {
              "& .MuiPickersCalendarHeader-label": {
                fontWeight: "500",
                ...hoverTextStyle(butterflyBlue[900]),
              },
            },
          },
          yearButton: {
            sx: {
              "&.MuiPickersYear-yearButton.Mui-selected": {
                backgroundColor: butterflyBlue[900],
                borderRadius: "25px",
              },
              "&.MuiPickersYear-yearButton:not(.Mui-selected)": {
                ...hoverTextStyle(butterflyBlue[900]),
                borderRadius: "25px",
              },
            },
          },
        }}
        slots={{
          leftArrowIcon: LeftArrowIcon,
          rightArrowIcon: RightArrowIcon,
          switchViewIcon: EmptyIcon,
        }}
        shouldDisableTime={() => !pickerValue}
        onChange={(value) => {
          if (value?.isValid) {
            return onChange(value.toUTC().toISO());
          }
          onChange(value);
        }}
      />
    </Stack>
  );
}
