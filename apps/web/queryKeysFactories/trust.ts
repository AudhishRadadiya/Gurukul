export const trustKeys = {
  add: () => [...trustKeys.all, "add"],

  all: ["trust"],

  bankOptions: (trustId?: string) => [
    ...trustKeys.all,
    "bank-options",
    trustId,
  ],

  delete: (trustId: string) => [...trustKeys.all, "delete", trustId],

  edit: (trustMasterId: string) => [...trustKeys.all, "edit", trustMasterId],

  get: (trustMasterId: string) => [...trustKeys.all, "get", trustMasterId],

  listing: (body: object = {}) => [...trustKeys.all, "listing", body],

  multipleOptions: (branchIds: string[]) => [
    ...trustKeys.all,
    "multiple-options",
    branchIds,
  ],

  options: (useShortName?: boolean, useUserWise?: boolean) => [
    ...trustKeys.all,
    "options",
    ...(useUserWise ? ["user-wise"] : []),
    ...(useShortName ? ["short-name"] : []),
  ],

  userWiseTrust: () => [...trustKeys.all, "user-wise-trust-options"],
} as const;
