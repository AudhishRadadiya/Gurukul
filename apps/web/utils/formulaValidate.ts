import Mexp from "math-expression-evaluator";

import { formulaRegex } from "@web/utils/regex";

export const validateFormula = (
  formula: string,
  placeHoldersShortTypes: string[]
): boolean => {
  if (!formulaRegex.test(formula)) {
    return false;
  }

  placeHoldersShortTypes.forEach((item) => {
    formula = formula.replaceAll(`[${item}]`, " 1 ");
  });

  const mexp = new Mexp();

  try {
    mexp.eval(formula);

    return true;
    // eslint-disable-next-line sonarjs/no-ignored-exceptions
  } catch (e) {
    return false;
  }
};
