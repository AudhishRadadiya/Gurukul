import { z } from "zod";

import { FEMALE, MALE } from "@web/components/common/hooks/constant";

export const genderTypes = {
  [FEMALE]: "Female",
  [MALE]: "Male",
};

export type Gender = keyof typeof genderTypes;

export const GenderSchema = z.enum([MALE, FEMALE]);

export function useGetGenderOptions() {
  const genderOptions = [
    { label: genderTypes[MALE], value: MALE },
    { label: genderTypes[FEMALE], value: FEMALE },
  ];

  return { genderOptions };
}
