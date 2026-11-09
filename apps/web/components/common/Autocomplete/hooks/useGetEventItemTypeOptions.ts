import {
  CUSTOM1,
  MULTIPLE,
  CHECKBOX_OPTIONS,
  RADIO_OPTIONS,
  SINGLE,
} from "@web/components/common/hooks/constant";

export const eventItemType = {
  [CHECKBOX_OPTIONS]: "Checkbox Options",
  [CUSTOM1]: "Custom",
  [MULTIPLE]: "Multiple",
  [RADIO_OPTIONS]: "Radio Options",
  [SINGLE]: "Single",
};

export type EventItemTypeKey =
  | typeof SINGLE
  | typeof MULTIPLE
  | typeof CUSTOM1
  | typeof CHECKBOX_OPTIONS
  | typeof RADIO_OPTIONS;

export const getEventItemTypeLabel = (value: EventItemTypeKey): string => {
  return eventItemType[value as EventItemTypeKey];
};

export function useGetEventItemTypeOptions() {
  const eventItemOptions = [
    { label: eventItemType[MULTIPLE], value: MULTIPLE },
    { label: eventItemType[SINGLE], value: SINGLE },
    { label: eventItemType[CUSTOM1], value: CUSTOM1 },
    { label: eventItemType[RADIO_OPTIONS], value: RADIO_OPTIONS },
    { label: eventItemType[CHECKBOX_OPTIONS], value: CHECKBOX_OPTIONS },
  ];

  return { eventItemOptions };
}
