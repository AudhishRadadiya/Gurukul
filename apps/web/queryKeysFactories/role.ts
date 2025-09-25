export const roleKeys = {
  add: () => [...roleKeys.all, "add"] as const,

  all: ["role"],

  delete: (roleId: string) => [...roleKeys.all, "delete", roleId] as const,

  edit: (roleId: string) => [...roleKeys.all, "edit", roleId],

  get: (roleId: string) => [...roleKeys.all, "get", roleId],

  listing: (body: object = {}) => [...roleKeys.all, "listing", body] as const,

  options: () => [...roleKeys.all, "options"] as const,
} as const;
