import type { OptionsType } from "@web/types/options";

export function useGetEventDropdownFieldTypeOptions() {
  const eventDropdownFieldTypeOptions: OptionsType[] = [
    { label: "Single Line", value: 1 },
    { label: "Alphabet", value: 2 },
    { label: "Alphanumeric", value: 3 },
    { label: "Date", value: 4 },
    { label: "TextArea", value: 5 },
    { label: "Link", value: 6 },
    { label: "Number", value: 7 },
    { label: "Dropdown", value: 8 },
  ];

  return { eventDropdownFieldTypeOptions };
}
