export const eventSummaryKeys = {
  all: ["event-summary"],

  export: () => [...eventSummaryKeys.all, "export"] as const,

  listing: (body: object = {}) =>
    [...eventSummaryKeys.all, "listing", body] as const,
} as const;

export const eventItemSummaryKeys = {
  all: ["event-item-summary"],

  export: () => [...eventItemSummaryKeys.all, "export"] as const,

  listing: (body: object = {}) =>
    [...eventItemSummaryKeys.all, "listing", body] as const,
} as const;
