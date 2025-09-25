import { InputLabel, Stack, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { useState } from "react";
import { DateRangePicker as RdrDateRangePicker } from "react-date-range";
import type { FieldValues, UseControllerProps } from "react-hook-form";
import { useController } from "react-hook-form";
import { Skeleton } from "./Skeleton";

export type DateRangePickerProps<P extends FieldValues> =
  UseControllerProps<P> & {
    label?: string;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    loading?: boolean;
    minDate?: Date;
    maxDate?: Date;
    months?: number;
  };

export function DateRangePicker<P extends FieldValues>({
  control,
  defaultValue,
  disabled = false,
  label,
  name,
  error = false,
  helperText,
  loading = false,
  required = false,
  months = 1,
  rules,
}: DateRangePickerProps<P>) {
  const {
    field: { onChange },
  } = useController({ name, control, defaultValue, rules });

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <Stack gap="10px">
      {label && (
        <InputLabel required={required} disabled={disabled}>
          {label}
        </InputLabel>
      )}

      <RdrDateRangePicker
        ranges={range}
        onChange={(ranges) => {
          const selectedRange = ranges.selection;

          if (
            selectedRange?.endDate &&
            selectedRange?.startDate &&
            selectedRange?.key
          ) {
            setRange([
              {
                startDate: selectedRange.startDate,
                endDate: selectedRange.endDate,
                key: selectedRange.key,
              },
            ]);

            const startDate = DateTime.fromJSDate(
              selectedRange.startDate
            ).toISODate();

            const endDate = DateTime.fromJSDate(
              selectedRange.endDate
            ).toISODate();

            onChange([startDate, endDate]);
          }
        }}
        months={months}
        direction="horizontal"
        calendarFocus="backwards"
        staticRanges={[]}
        inputRanges={[]}
        moveRangeOnFirstSelection={false}
        preventSnapRefocus={true}
      />

      {error && <Typography color="red">{helperText}</Typography>}
    </Stack>
  );
}
