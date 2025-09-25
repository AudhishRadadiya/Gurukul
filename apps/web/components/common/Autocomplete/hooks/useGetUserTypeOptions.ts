import type { OptionsType } from "@web/types/options";

export type UserTypeOptionsKey = "admin" | "user ";

export function useGetUserTypeOptions() {
  const userTypeOption: OptionsType[] = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
  ];

  return { userTypeOption };
}
