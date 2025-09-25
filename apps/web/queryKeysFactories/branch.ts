export const branchKeys = {
  add: () => [...branchKeys.all, "add"],

  all: ["branch"],

  delete: (branchId: string) => [...branchKeys.all, "delete", branchId],

  edit: (branchId: string) => [...branchKeys.all, "edit", branchId],

  get: (branchId: string) => [...branchKeys.all, "get", branchId],

  listing: (body: object = {}) => [...branchKeys.all, "listing", body],

  options: () => [...branchKeys.all, "options"],
} as const;
