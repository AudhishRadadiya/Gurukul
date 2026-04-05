import type { GetListArgsAg2 } from "@web/types/shared-types";

export const eventDropdownSummaryKeys = {
  all: ["eventDropdownSummary"] as const,
  export: () => [...eventDropdownSummaryKeys.all, "export"] as const,
  listing: (body: GetListArgsAg2) =>
    [...eventDropdownSummaryKeys.all, "listing", body] as const,
};

