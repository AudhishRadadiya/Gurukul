export const userKeys = {
  add: () => [...userKeys.all, "add"] as const,

  all: ["user"],

  delete: (userId: string) => [...userKeys.all, "edit", userId] as const,

  edit: (userId: string) => [...userKeys.all, "edit", userId] as const,

  get: (userId: string) => [...userKeys.all, "get", userId] as const,

  listing: (body: object = {}) => [...userKeys.all, "listing", body] as const,

  options: () => [...userKeys.all, "options"] as const,
} as const;
