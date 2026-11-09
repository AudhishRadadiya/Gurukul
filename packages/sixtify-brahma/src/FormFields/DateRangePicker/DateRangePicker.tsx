import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import { DateTime } from "luxon";
import { useState } from "react";
import {
  createStaticRanges,
  DateRangePicker as RdrDateRangePicker,
  type CalendarProps,
  type StaticRange,
  defaultInputRanges,
} from "react-date-range";
import { useController } from "react-hook-form";

import { PadBox } from "../../PadBox";
import { useGetDeviceType } from "../../utils";

import { Skeleton } from "./Skeleton";

import type { FieldValues, UseControllerProps } from "react-hook-form";
import { DateRangePickerFocusWrapper } from "./DateRangePicker.styled";

const isSameDay = (a?: Date, b?: Date): boolean => {
  if (!a || !b) {
    return false;
  }

  return a.toDateString() === b.toDateString();
};

const namedStaticRanges: StaticRange[] = [
  {
    label: "Today",
    range: () => ({
      startDate: new Date(),
      endDate: new Date(),
    }),
    isSelected: (range) =>
      isSameDay(range.startDate, new Date()) &&
      isSameDay(range.endDate, new Date()),
  },
  {
    label: "This Week",
    range: () => ({
      startDate: startOfWeek(new Date()),
      endDate: endOfWeek(new Date()),
    }),
    isSelected: (range) =>
      isSameDay(range.startDate, startOfWeek(new Date())) &&
      isSameDay(range.endDate, endOfWeek(new Date())),
  },
  {
    label: "Last Week",
    range: () => ({
      startDate: startOfWeek(subDays(new Date(), 7)),
      endDate: endOfWeek(subDays(new Date(), 7)),
    }),
    isSelected: (range) =>
      isSameDay(range.startDate, startOfWeek(subDays(new Date(), 7))) &&
      isSameDay(range.endDate, endOfWeek(subDays(new Date(), 7))),
  },
  {
    label: "This Month",
    range: () => ({
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
    }),
    isSelected: (range) =>
      isSameDay(range.startDate, startOfMonth(new Date())) &&
      isSameDay(range.endDate, endOfMonth(new Date())),
  },
  {
    label: "Last Month",
    range: () => ({
      startDate: startOfMonth(subDays(new Date(), 30)),
      endDate: endOfMonth(subDays(new Date(), 30)),
    }),
    isSelected: (range) =>
      isSameDay(range.startDate, startOfMonth(subDays(new Date(), 30))) &&
      isSameDay(range.endDate, endOfMonth(subDays(new Date(), 30))),
  },
];

const isCustomRange = (startDate?: Date, endDate?: Date): boolean => {
  return !namedStaticRanges.some((r) => {
    const { startDate: s, endDate: e } = r.range();

    return isSameDay(s, startDate) && isSameDay(e, endDate);
  });
};

const customStaticRange: StaticRange = {
  label: "Custom Range",
  range: () => ({
    startDate: new Date(),
    endDate: new Date(),
  }),
  isSelected: (range) => isCustomRange(range.startDate, range.endDate),
};

const staticRanges = createStaticRanges([
  ...namedStaticRanges,
  customStaticRange,
]);

function getCalendarMonths(
  showPresets: boolean | undefined,
  isCompact: boolean,
  months: number
) {
  if (!showPresets) {
    return months;
  }

  return isCompact ? 1 : 2;
}

function getDateRangePickerClassName(
  showPresets?: boolean,
  isCompact?: boolean
) {
  return [
    !showPresets ? "hide-presets" : undefined,
    isCompact ? "compact" : undefined,
  ]
    .filter(Boolean)
    .join(" ");
}

export type DateRangePickerProps<P extends FieldValues> =
  UseControllerProps<P> & {
    label?: string;
    required?: boolean;
    disabled?: boolean;
    showPresets?: boolean;
    error?: boolean;
    helperText?: string;
    loading?: boolean;
    minDate?: Date;
    maxDate?: Date;
    months?: number;
    disabledDates?: CalendarProps["disabledDates"];
    disabledDay?: CalendarProps["disabledDay"];
    maxInputDays?: number;
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
  showPresets,
  months = 1,
  rules,
  minDate,
  maxDate,
  disabledDates,
  disabledDay,
  maxInputDays = 365,
}: DateRangePickerProps<P>) {
  const { isDesktop } = useGetDeviceType();

  const isCompact = !isDesktop;

  const {
    field: { onChange },
  } = useController({ name, control, defaultValue, rules });

  const [range, setRange] = useState([
    {
      startDate: defaultValue?.[0] ? new Date(defaultValue[0]) : new Date(),
      endDate: defaultValue?.[1] ? new Date(defaultValue[1]) : new Date(),
      key: "selection",
    },
  ]);

  const start =
    range[0] && DateTime.fromJSDate(range[0].startDate).toFormat("dd LLL yyyy");

  const end =
    range[0] && DateTime.fromJSDate(range[0].endDate).toFormat("dd LLL yyyy");

  const customInputRanges = defaultInputRanges.map((item) => ({
    ...item,

    range(value: number) {
      const safeValue = Math.min(value, maxInputDays);

      return item.range(safeValue);
    },
  }));

  if (loading) {
    return <Skeleton />;
  }

  return (
    <Stack gap="5px">
      {label && (
        <InputLabel required={required} disabled={disabled}>
          {label}
        </InputLabel>
      )}

      <Box>
        <DateRangePickerFocusWrapper
          className={getDateRangePickerClassName(showPresets, isCompact)}
        >
          <RdrDateRangePicker
            ranges={range}
            disabledDates={disabledDates}
            disabledDay={disabledDay}
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
            direction={isCompact ? "vertical" : "horizontal"}
            calendarFocus="forwards"
            months={getCalendarMonths(showPresets, isCompact, months)}
            {...(showPresets && {
              staticRanges,
              inputRanges: customInputRanges,
            })}
            moveRangeOnFirstSelection={false}
            preventSnapRefocus={true}
            minDate={minDate}
            maxDate={maxDate}
          />
        </DateRangePickerFocusWrapper>

        <Box
          sx={{
            borderColor: "divider",
            borderTop: "1px solid",
            textAlign: "center",
          }}
        >
          <PadBox padding={{ padding: isCompact ? "4px" : "7px" }}>
            <Typography
              variant="body2"
              sx={{ fontSize: isCompact ? "11px" : undefined }}
            >
              {`${start} - ${end}`}
            </Typography>
          </PadBox>
        </Box>
      </Box>

      {error && <Typography color="red">{helperText}</Typography>}
    </Stack>
  );
}
