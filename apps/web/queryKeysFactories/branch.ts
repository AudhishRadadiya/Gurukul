export const branchKeys = {
  add: () => [...branchKeys.all, "add"] as const,

  all: ["branch"],

  delete: (branchId: string) =>
    [...branchKeys.all, "delete", branchId] as const,

  edit: (branchId: string) => [...branchKeys.all, "edit", branchId] as const,

  get: (branchId: string) => [...branchKeys.all, "get", branchId] as const,

  listing: (body: object = {}) => [...branchKeys.all, "listing", body] as const,

  options: (isUserWise?: boolean) =>
    [...branchKeys.all, "options", { isUserWise }] as const,
} as const;
