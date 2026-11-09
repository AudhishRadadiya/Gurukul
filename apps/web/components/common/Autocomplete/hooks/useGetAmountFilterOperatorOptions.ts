import {
  BETWEEN,
  DOES_NOT_EQUAL,
  EQUALS,
  GREATER_THAN,
  GREATER_THAN_OR_EQUAL_TO,
  LESS_THAN,
  LESS_THAN_OR_EQUAL_TO,
} from "@web/components/common/hooks/constant";

export const amountFilterOperatorTypes = {
  [BETWEEN]: "Between",
  [DOES_NOT_EQUAL]: "Does not equal",
  [EQUALS]: "Equals",
  [GREATER_THAN]: "Greater than",
  [GREATER_THAN_OR_EQUAL_TO]: "Greater than or equal to",
  [LESS_THAN]: "Less than",
  [LESS_THAN_OR_EQUAL_TO]: "Less than or equal to",
};

export type AmountFilterOperator = keyof typeof amountFilterOperatorTypes;

export const amountFilterOperatorOptions = [
  { label: amountFilterOperatorTypes[EQUALS], value: EQUALS },
  { label: amountFilterOperatorTypes[DOES_NOT_EQUAL], value: DOES_NOT_EQUAL },
  { label: amountFilterOperatorTypes[GREATER_THAN], value: GREATER_THAN },
  {
    label: amountFilterOperatorTypes[GREATER_THAN_OR_EQUAL_TO],
    value: GREATER_THAN_OR_EQUAL_TO,
  },
  { label: amountFilterOperatorTypes[LESS_THAN], value: LESS_THAN },
  {
    label: amountFilterOperatorTypes[LESS_THAN_OR_EQUAL_TO],
    value: LESS_THAN_OR_EQUAL_TO,
  },
  { label: amountFilterOperatorTypes[BETWEEN], value: BETWEEN },
] as const;

export function useGetAmountFilterOperatorOptions() {
  return { amountFilterOperatorOptions };
}
