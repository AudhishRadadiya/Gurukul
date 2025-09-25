export const eventDonationEntryKeys = {
  add: () => [...eventDonationEntryKeys.all, "add"] as const,

  all: ["event-donation-entry"],

  delete: (eventDonationId: string) =>
    [...eventDonationEntryKeys.all, "delete", eventDonationId] as const,

  donationReceiptEntryDetail: (body: object = {}) =>
    [...eventDonationEntryKeys.all, "listing", body] as const,

  donationReceiptListing: (body: object = {}) =>
    [...eventDonationEntryKeys.all, "listing", body] as const,

  edit: (eventDonationId: string) =>
    [...eventDonationEntryKeys.all, "edit", eventDonationId] as const,

  export: () => [...eventDonationEntryKeys.all, "export"] as const,

  get: (eventDonationId: string) =>
    [...eventDonationEntryKeys.all, "get", eventDonationId] as const,

  listing: (body: object = {}) =>
    [...eventDonationEntryKeys.all, "listing", body] as const,
} as const;
