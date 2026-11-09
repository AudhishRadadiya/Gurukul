export const donationMasterKeys = {
  add: () => [...donationMasterKeys.all, "add"] as const,

  all: ["donation-master"],

  delete: (donationMasterId: string) =>
    [...donationMasterKeys.all, "delete", donationMasterId] as const,

  edit: (donationMasterId: string) =>
    [...donationMasterKeys.all, "edit", donationMasterId] as const,

  get: (donationMasterId: string) =>
    [...donationMasterKeys.all, "get", donationMasterId] as const,

  listing: (body: object = {}) =>
    [...donationMasterKeys.all, "listing", body] as const,

  userWiseOptions: (isUserWiseAll?: boolean) =>
    [
      ...donationMasterKeys.all,
      "user-wise-options",
      { isUserWiseAll },
    ] as const,
} as const;
