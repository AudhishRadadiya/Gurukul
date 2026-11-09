export const webUserKeys = {
  add: () => [...webUserKeys.all, "add"] as const,

  all: ["web-user"],

  delete: (webUserId: string) =>
    [...webUserKeys.all, "delete", webUserId] as const,

  edit: (webUserId: string) => [...webUserKeys.all, "edit", webUserId] as const,

  get: (webUserId: string) => [...webUserKeys.all, "get", webUserId] as const,

  listing: (body: object = {}) =>
    [...webUserKeys.all, "listing", body] as const,
} as const;
