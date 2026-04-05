export const updateDonorAddressKeys = {
  all: ["update-donor-address-list"],

  export: () => [...updateDonorAddressKeys.all, "export"] as const,

  listing: (body: object = {}) =>
    [...updateDonorAddressKeys.all, "list", body] as const,
} as const;
