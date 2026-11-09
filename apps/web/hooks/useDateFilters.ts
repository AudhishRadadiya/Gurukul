import { DateTime } from "luxon";
import { useMemo } from "react";
import { useForm, type Control } from "react-hook-form";

import {
  CUSTOM,
  ONE_MONTH,
  SEVEN_DAYS,
  TODAY,
} from "@web/components/common/hooks/constant";

export type DateFiltersFormValues = {
  date_filter_period: string;
  date_range: string[];
  from_date: string;
  only_contact_no: boolean;
  search: string;
  to_date: string;
};

export type UseDateFiltersReturn = {
  control: Control<DateFiltersFormValues>;
  dateFilterPeriod: string;
  dateRange: string[];
  fromDate: string;
  onlyContactNo: boolean;
  search: string;
  setValue: (
    name: keyof DateFiltersFormValues,
    value: string | boolean | string[]
  ) => void;
  toDate: string;
};

export const calculateFromDate = (period: string): string => {
  if (period === SEVEN_DAYS) {
    return DateTime.now().minus({ days: 7 }).toISODate();
  }

  if (period === ONE_MONTH) {
    return DateTime.now().minus({ months: 1 }).toISODate();
  }

  return DateTime.now().toISODate();
};

const detectDatePeriod = (fromDate: string, toDate: string): string => {
  const today = DateTime.now().toISODate();

  const sevenDaysAgo = DateTime.now().minus({ days: 7 }).toISODate();

  const oneMonthAgo = DateTime.now().minus({ months: 1 }).toISODate();

  // Check if both dates are today
  if (fromDate === today && toDate === today) {
    return TODAY;
  }

  // Check if dates match 7 days period
  if (fromDate === sevenDaysAgo && toDate === today) {
    return SEVEN_DAYS;
  }

  // Check if dates match 1 month period
  if (fromDate === oneMonthAgo && toDate === today) {
    return ONE_MONTH;
  }

  // Otherwise, it's a custom period
  return CUSTOM;
};

export function useDateFilters(
  defaultPeriod: string = SEVEN_DAYS
): UseDateFiltersReturn {
  const { control, setValue, watch } = useForm<DateFiltersFormValues>({
    defaultValues: {
      date_filter_period: defaultPeriod,
      date_range: [
        calculateFromDate(defaultPeriod),
        DateTime.now().toISODate(),
      ],
      from_date: calculateFromDate(defaultPeriod),
      only_contact_no: false,
      search: "",
      to_date: DateTime.now().toISODate(),
    },
  });

  const dateFilterPeriod = watch("date_filter_period");

  const fromDate = watch("from_date");

  const dateRange = watch("date_range");

  const toDate = watch("to_date");

  const search = watch("search");

  const onlyContactNo = watch("only_contact_no");

  useMemo(() => {
    // Don't override from_date when period is CUSTOM (user has set custom dates)
    if (dateFilterPeriod === CUSTOM) {
      return;
    }

    const calculatedFromDate = calculateFromDate(dateFilterPeriod);

    setValue("from_date", calculatedFromDate);

    setValue("to_date", DateTime.now().toISODate());
  }, [dateFilterPeriod, setValue]);

  useMemo(() => {
    // Detect and update the period based on selected dates
    if (fromDate && toDate) {
      const detectedPeriod = detectDatePeriod(fromDate, toDate);

      // Only update if the detected period is different from current
      if (detectedPeriod !== dateFilterPeriod) {
        setValue("date_filter_period", detectedPeriod);
      }
    }
  }, [fromDate, toDate]);

  return {
    control,
    dateFilterPeriod,
    dateRange,
    fromDate,
    onlyContactNo,
    search,
    setValue,
    toDate,
  };
}
