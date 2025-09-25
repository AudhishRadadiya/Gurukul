import { NO, YES } from "@web/components/common/hooks/constant";

const optionTypes = {
  [NO]: "No",
  [YES]: "Yes",
};

export function useGetIsActiveOptions() {
  const isActiveOptions = [
    { label: optionTypes[YES], value: YES },
    { label: optionTypes[NO], value: NO },
  ];

  return { isActiveOptions };
}
