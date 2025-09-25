export const eventKeys = {
  add: () => [...eventKeys.all, "add"] as const,

  all: ["event"] as const,

  clone: (eventMasterId: string) =>
    [...eventKeys.all, "clone", eventMasterId] as const,

  delete: (eventMasterId: string) =>
    [...eventKeys.all, "delete", eventMasterId] as const,

  edit: (eventMasterId: string) =>
    [...eventKeys.all, "edit", eventMasterId] as const,

  get: (eventMasterId: string) =>
    [...eventKeys.all, "get", eventMasterId] as const,

  listing: (body: object = {}) => [...eventKeys.all, "listing", body] as const,

  options: () => [...eventKeys.all, "options"] as const,
} as const;
