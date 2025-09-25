import { z } from "zod";

import {
  A_NEG,
  A_POS,
  AB_NEG,
  AB_POS,
  B_NEG,
  B_POS,
  O_NEG,
  O_POS,
} from "@web/components/common/hooks/constant";

export const bloodGroupTypes = {
  [AB_NEG]: "AB−",
  [AB_POS]: "AB+",
  // eslint-disable-next-line sort-keys
  [A_NEG]: "A−",
  [A_POS]: "A+",
  [B_NEG]: "B−",
  [B_POS]: "B+",
  [O_NEG]: "O−",
  [O_POS]: "O+",
};

export type BloodGroup = keyof typeof bloodGroupTypes;

export const BloodGroupSchema = z.enum([
  A_POS,
  B_POS,
  AB_POS,
  O_POS,
  A_NEG,
  B_NEG,
  AB_NEG,
  O_NEG,
]);

export function useGetBloodGroupOptions() {
  const bloodGroupOptions = [
    { label: bloodGroupTypes[A_POS], value: A_POS },
    { label: bloodGroupTypes[B_POS], value: B_POS },
    { label: bloodGroupTypes[AB_POS], value: AB_POS },
    { label: bloodGroupTypes[O_POS], value: O_POS },
    { label: bloodGroupTypes[A_NEG], value: A_NEG },
    { label: bloodGroupTypes[B_NEG], value: B_NEG },
    { label: bloodGroupTypes[AB_NEG], value: AB_NEG },
    { label: bloodGroupTypes[O_NEG], value: O_NEG },
  ];

  return { bloodGroupOptions };
}
