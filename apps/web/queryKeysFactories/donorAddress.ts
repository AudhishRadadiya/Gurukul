export const donorAddressKeys = {
  add: (status: string) => [...donorAddressKeys.all, "add", status] as const,

  all: ["donor-address-list"],

  edit: () => [...donorAddressKeys.all, "edit"] as const,

  listing: (body: object = {}) =>
    [...donorAddressKeys.all, "listing", body] as const,
} as const;
