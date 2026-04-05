import { DateTime } from "luxon";

export const formatDateValue = (value: string) => {
  const date = DateTime.fromISO(value);

  if (date.isValid) {
    return date.toFormat("dd-MM-yyyy");
  }

  return value;
};
