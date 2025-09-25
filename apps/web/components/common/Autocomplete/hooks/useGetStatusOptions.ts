import { z } from "zod";

import { ACTIVE, ALL, INACTIVE } from "@web/components/common/hooks/constant";

const statusTypes = {
  [ACTIVE]: "Active",
  [ALL]: "All",
  [INACTIVE]: "In Active",
};

export type Status = keyof typeof statusTypes;

export const StatusTypeSchema = z.enum([ACTIVE, INACTIVE, ALL]);

export function useGetStatusOptions() {
  const statusOptions = [
    { label: statusTypes[ALL], value: ALL },
    { label: statusTypes[ACTIVE], value: ACTIVE },
    { label: statusTypes[INACTIVE], value: INACTIVE },
  ];

  return { statusOptions };
}
