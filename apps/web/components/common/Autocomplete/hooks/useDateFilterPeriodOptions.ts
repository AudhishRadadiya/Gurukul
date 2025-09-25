import {
  CUSTOM,
  ONE_MONTH,
  SEVEN_DAYS,
  TODAY,
} from "@web/components/common/hooks/constant";

const optionTypes = {
  [CUSTOM]: "Custom",
  [ONE_MONTH]: "1 Month",
  [SEVEN_DAYS]: "7 Days",
  [TODAY]: "Today",
};

export function useDateFilterPeriodOptions() {
  const dateFilterPeriodOptions = [
    { label: optionTypes[CUSTOM], value: CUSTOM },
    { label: optionTypes[ONE_MONTH], value: ONE_MONTH },
    { label: optionTypes[SEVEN_DAYS], value: SEVEN_DAYS },
    { label: optionTypes[TODAY], value: TODAY },
  ];

  return { dateFilterPeriodOptions };
}
