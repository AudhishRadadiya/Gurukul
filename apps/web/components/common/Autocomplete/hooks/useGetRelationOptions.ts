import { z } from "zod";

import {
  BROTHER,
  DAUGHTER,
  FATHER,
  MOTHER,
  SISTER,
  SON,
  UNCLE,
  WIFE,
} from "@web/components/common/hooks/constant";

export const relationTypes = {
  [BROTHER]: "BROTHER",
  [DAUGHTER]: "DAUGHTER",
  [FATHER]: "FATHER",
  [MOTHER]: "MOTHER",
  [SISTER]: "SISTER",
  [SON]: "SON",
  [UNCLE]: "UNCLE",
  [WIFE]: "WIFE",
};

export type Relation = keyof typeof relationTypes;

export const RelationSchema = z.enum([
  SON,
  DAUGHTER,
  WIFE,
  UNCLE,
  FATHER,
  MOTHER,
  SISTER,
  BROTHER,
]);

export function useGetRelationOptions() {
  const relationOptions = [
    { label: relationTypes[SON], value: SON },
    { label: relationTypes[DAUGHTER], value: DAUGHTER },
    { label: relationTypes[WIFE], value: WIFE },
    { label: relationTypes[UNCLE], value: UNCLE },
    { label: relationTypes[FATHER], value: FATHER },
    { label: relationTypes[MOTHER], value: MOTHER },
    { label: relationTypes[SISTER], value: SISTER },
    { label: relationTypes[BROTHER], value: BROTHER }, // new entry
  ];

  return { relationOptions };
}
