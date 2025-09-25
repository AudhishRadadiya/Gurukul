import { DateTime, Duration } from "luxon";

export const formatDate = (date: string, format: string = "dd-MM-yyyy") => {
  return DateTime.fromISO(date).toFormat(format);
};

export const getTimeInHHmm = (date: string, format: string = "HH:mm") => {
  const dateTime = DateTime.fromISO(date);

  if (!dateTime.isValid) {
    return "";
  }

  return dateTime.toFormat(format);
};

export const getDifferenceInHHmmss = (startTime: string, endTime: string) => {
  const start = DateTime.fromISO(startTime);

  const end = DateTime.fromISO(endTime);

  const formattedEnd = end < start ? end.plus({ days: 1 }) : end;

  const diff = formattedEnd.diff(start, ["hours", "minutes", "seconds"]);

  return Duration.fromObject(diff.toObject()).toFormat("hh:mm:ss");
};
