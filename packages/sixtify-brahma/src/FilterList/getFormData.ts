import type { FilterListType } from "./FilterTypeWrapper";

export const getFormValue = (value: unknown, item: FilterListType) => {
  let keyValue = value;

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
