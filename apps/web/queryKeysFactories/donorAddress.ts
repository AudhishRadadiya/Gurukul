import type { FilType } from "@web/types/shared-types";

export const donorAddressKeys = {
  add: (fileType: FilType) =>
    [...donorAddressKeys.all, "add", fileType] as const,

  all: ["donor-address-list"],

  edit: () => [...donorAddressKeys.all, "edit"] as const,

  export: () => [...donorAddressKeys.all, "export"] as const,

  listing: (body: object = {}) =>
    [...donorAddressKeys.all, "list", body] as const,
} as const;
