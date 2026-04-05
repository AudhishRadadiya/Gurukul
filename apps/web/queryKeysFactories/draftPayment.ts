export const draftPaymentKeys = {
  all: ["draft-payment"],

  listing: (body: object = {}) =>
    [...draftPaymentKeys.all, "listing", body] as const,
} as const;
