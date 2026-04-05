import type { GetListArgsAg2 } from "@web/types/shared-types";

export const eventDonationKeys = {
  all: ["eventDonation"] as const,
  export: () => [...eventDonationKeys.all, "export"] as const,
  listing: (body: GetListArgsAg2) =>
    [...eventDonationKeys.all, "listing", body] as const,
};

