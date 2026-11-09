import {
  ADDRESS_LINE_1,
  CITY,
  COUNTRY,
  STATE,
} from "@web/components/common/hooks/constant";

const optionTypes = {
  [ADDRESS_LINE_1]: "Address Line 1",
  [CITY]: "City",
  [COUNTRY]: "Country",
  [STATE]: "State",
};

export const ALLOWED_FIELD_VALUES = [
  ADDRESS_LINE_1,
  CITY,
  STATE,
  COUNTRY,
] as const;

export function useGetAllowedFieldsOptions() {
  const allowedFieldsOptions = [
    { label: optionTypes[ADDRESS_LINE_1], value: ADDRESS_LINE_1 },
    { label: optionTypes[CITY], value: CITY },
    { label: optionTypes[COUNTRY], value: COUNTRY },
    { label: optionTypes[STATE], value: STATE },
  ];

  return { allowedFieldsOptions };
}
