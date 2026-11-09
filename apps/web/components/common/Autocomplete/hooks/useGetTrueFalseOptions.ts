import type { BooleanOptionsType } from "@web/types/options";

export function useGetTrueFalseOptions() {
  const trueFalseOptions: BooleanOptionsType[] = [
    {
      label: "Yes",
      value: true,
    },
    {
      label: "No",
      value: false,
    },
  ];

  return { trueFalseOptions };
}
