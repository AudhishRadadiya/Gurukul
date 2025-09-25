export const donationSummaryKeys = {
  all: ["donation-summary"],

  export: () => [...donationSummaryKeys.all, "export"] as const,

  listing: (body: object = {}) =>
    [...donationSummaryKeys.all, "listing", body] as const,
} as const;
