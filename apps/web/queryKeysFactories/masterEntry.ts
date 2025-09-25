export const masterEntryKeys = {
  add: () => [...masterEntryKeys.all, "add"] as const,

  all: ["master-entry"],

  delete: (masterParameterId: string) =>
    [...masterEntryKeys.all, "delete", masterParameterId] as const,

  edit: (masterParameterId: string) =>
    [...masterEntryKeys.all, "edit", masterParameterId] as const,

  get: (masterParameterId: string) =>
    [...masterEntryKeys.all, "get", masterParameterId] as const,

  listing: (body: object = {}) =>
    [...masterEntryKeys.all, "listing", body] as const,

  options: () => [...masterEntryKeys.all, "options"] as const,
} as const;
