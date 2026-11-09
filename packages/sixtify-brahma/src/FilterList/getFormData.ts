import type { FieldValues } from "react-hook-form";
import type { FilterListType } from "./FilterTypeWrapper";

type GetAmountFilterFormValueArgs = {
  data: FieldValues;
  item: FilterListType;
};

const formatAmountValue = (amount: unknown) => {
  if (amount === null || Number.isNaN(amount)) {
    return "";
  }

  if (typeof amount === "number" && !Number.isNaN(amount)) {
    return String(amount);
  }

  return "";
};

const getAmountFilterFormValue = ({
  data,
  item,
}: GetAmountFilterFormValueArgs) => {
  const { key, options, amountFilterKeys } = item;

  if (!amountFilterKeys) {
    return "";
  }

  const { operatorKey, fromAmountKey, toAmountKey, betweenOperatorValue } =
    amountFilterKeys;

  const amountData = data[key];

  const operatorValue = amountData[operatorKey];

  const fromAmount = amountData[fromAmountKey];

  const toAmount = amountData[toAmountKey];

  const formattedFromAmount = formatAmountValue(fromAmount);

  const formattedToAmount = formatAmountValue(toAmount);

  const operatorLabel = options?.find(
    (option) => option.value === operatorValue
  )?.label;

  if (operatorValue === betweenOperatorValue) {
    if (!formattedFromAmount && !formattedToAmount) {
      return "";
    }

    return `${operatorLabel ?? operatorValue} ${formattedFromAmount} and ${formattedToAmount}`;
  }

  if (!formattedFromAmount) {
    return "";
  }

  return `${operatorLabel ?? operatorValue} ${formattedFromAmount}`;
};

export const getFormValue = (
  value: unknown,
  item: FilterListType,
  data?: FieldValues
) => {
  let keyValue = value;

  if (item && item.type === "amountFilter" && data) {
    return getAmountFilterFormValue({ data, item });
  }

  if (item && item.type === "autoComplete") {
    if (item.multiSelect && Array.isArray(value)) {
      keyValue = item.options
        ?.filter((option) => value.includes(option.value))
        .map((option) => option.label)
        .join(", ");
    } else {
      keyValue = item.options
        ?.filter((option) => option.value === value)
        .map((option) => option.label)
        .join(", ");
    }
  }

  if (item.type === "dateRange" && Array.isArray(value) && value.length === 2) {
    const startDate = value[0];

    const endDate = value[1];

    keyValue = `${startDate} <= Start Date <= ${endDate}`;
  }

  return keyValue;
};
