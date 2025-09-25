export const businessDetailKeys = {
  all: ["business-detail"] as const,

  listing: (body: object = {}) => {
    return [...businessDetailKeys.all, "listing", body] as const;
  },

  options: (contactNumber: string) =>
    [...businessDetailKeys.all, "options", contactNumber] as const,
} as const;
