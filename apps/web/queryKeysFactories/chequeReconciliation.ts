export const chequeReconciliationKeys = {
  all: ["cheque-reconciliation"],

  edit: (donationId: string) =>
    [...chequeReconciliationKeys.all, "edit", donationId] as const,

  export: () => [...chequeReconciliationKeys.all, "export"] as const,

  get: (donationId: string) =>
    [...chequeReconciliationKeys.all, "get", donationId] as const,

  listing: (body: object = {}) =>
    [...chequeReconciliationKeys.all, "listing", body] as const,
} as const;
