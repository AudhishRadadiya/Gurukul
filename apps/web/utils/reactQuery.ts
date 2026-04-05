import _every from "lodash/every";

import type { GetListArgsAg2 } from "@web/types/shared-types";

export const isBranchFilterEnabled = (body: GetListArgsAg2) =>
  _every(body.externalFilter?.branch_id, Boolean);
