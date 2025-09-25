export const cancelReceiptKeys = {
  add: () => [...cancelReceiptKeys.all, "add"] as const,

  all: ["cancel-receipt"],

  generateReceiptNumber: (donation_mode_id: string, trust_id: string) =>
    [
      ...cancelReceiptKeys.all,
      "generateReceiptNumber",
      donation_mode_id,
      trust_id,
    ] as const,

  listing: (body: object = {}) =>
    [...cancelReceiptKeys.all, "listing", body] as const,
} as const;
