export const eventSummaryKeys = {
  all: ["event-summary"],

  export: () => [...eventSummaryKeys.all, "export"] as const,

  listing: (body: object = {}) =>
    [...eventSummaryKeys.all, "listing", body] as const,
} as const;
