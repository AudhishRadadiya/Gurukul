export const masterTypeKeys = {
  add: () => [...masterTypeKeys.all, "add"] as const,

  all: ["master-type"],

  edit: (masterTypeId: string) =>
    [...masterTypeKeys.all, "edit", masterTypeId] as const,

  get: (masterTypeId: string) =>
    [...masterTypeKeys.all, "get", masterTypeId] as const,

  listing: (body: object = {}) =>
    [...masterTypeKeys.all, "listing", body] as const,

  options: () => [...masterTypeKeys.all, "options"] as const,

  parameterOptions: () => [...masterTypeKeys.all, "parameter-options"] as const,
} as const;
