export const donationEntryKeys = {
  add: () => [...donationEntryKeys.all, "add"] as const,

  all: ["donation-entry"],

  cancelDonationEntry: () =>
    [...donationEntryKeys.all, "cancelDonationEntry"] as const,

  donationLetter: () => [...donationEntryKeys.all, "donationLetter"] as const,

  donationReceipt: () => [...donationEntryKeys.all, "donationReceipt"] as const,

  edit: (donationId: string) =>
    [...donationEntryKeys.all, "edit", donationId] as const,

  export: () => [...donationEntryKeys.all, "export"] as const,

  get: (donationId: string) =>
    [...donationEntryKeys.all, "get", donationId] as const,

  listing: (body: object = {}) =>
    [...donationEntryKeys.all, "listing", body] as const,

  options: (body: object = {}) =>
    [...donationEntryKeys.all, "options", body] as const,

  previousDonationDetail: (body: object = {}) =>
    [...donationEntryKeys.all, "previousDonationDetail", body] as const,

  printAddress: (donationIds: string[]) =>
    [...donationEntryKeys.all, "printAddress", donationIds] as const,

  sendBulkMail: (body: object = {}) =>
    [...donationEntryKeys.all, "bulkMail", body] as const,
} as const;
