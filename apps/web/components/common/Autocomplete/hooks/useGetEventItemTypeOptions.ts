import {
  CUSTOM1,
  MULTIPLE,
  SINGLE,
} from "@web/components/common/hooks/constant";

export const eventItemType = {
  [CUSTOM1]: "Custom",
  [MULTIPLE]: "Multiple",
  [SINGLE]: "Single",
};

export type EventItemTypeKey = typeof SINGLE | typeof MULTIPLE | typeof CUSTOM1;

export const getEventItemTypeLabel = (value: EventItemTypeKey): string => {
  return eventItemType[value as EventItemTypeKey];
};

export function useGetEventItemTypeOptions() {
  const eventItemOptions = [
    { label: eventItemType[MULTIPLE], value: MULTIPLE },
    { label: eventItemType[SINGLE], value: SINGLE },
    { label: eventItemType[CUSTOM1], value: CUSTOM1 },
  ];

  return { eventItemOptions };
}
