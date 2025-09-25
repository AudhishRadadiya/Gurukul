import { BOTH, PASS, PENDING } from "@web/components/common/hooks/constant";

export const chequeStatusTypes = {
  [BOTH]: "Both",
  [PASS]: "Pass",
  [PENDING]: "Pending",
};

export type chequeStatus = keyof typeof chequeStatusTypes;

export function useGetChequeStatusOptions() {
  const chequeStatusOptions = [
    { label: chequeStatusTypes[PENDING], value: PENDING },
    { label: chequeStatusTypes[PASS], value: PASS },
    { label: chequeStatusTypes[BOTH], value: BOTH },
  ];

  return { chequeStatusOptions };
}
