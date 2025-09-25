export const donationCollectionKeys = {
  all: ["donation-collection"],

  edit: (dailyDonationId: string) =>
    [...donationCollectionKeys.all, "get-currency", dailyDonationId] as const,

  export: () => [...donationCollectionKeys.all, "export"] as const,

  getCurrencyDetail: (dailyDonationId: string) =>
    [...donationCollectionKeys.all, "get-currency", dailyDonationId] as const,

  listing: (body: object = {}) =>
    [...donationCollectionKeys.all, "listing", body] as const,
} as const;
