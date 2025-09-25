export const donationModeKeys = {
  add: () => [...donationModeKeys.all, "add"] as const,

  all: ["donation-mode"],

  edit: (donationModeId: string) =>
    [...donationModeKeys.all, "edit", donationModeId] as const,

  get: (donationModeId: string) =>
    [...donationModeKeys.all, "get", donationModeId] as const,

  listing: (body: object = {}) =>
    [...donationModeKeys.all, "listing", body] as const,

  modeOfReceiptOptions: () =>
    [...donationModeKeys.all, "receipt-options"] as const,

  options: () => [...donationModeKeys.all, "options"] as const,
} as const;
